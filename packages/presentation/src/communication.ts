//
// Copyright © 2025 Hardcore Engineering Inc.
//
// Licensed under the Eclipse Public License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License. You may
// obtain a copy of the License at https://www.eclipse.org/legal/epl-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//
// See the License for the specific language governing permissions and
// limitations under the License.
//
import {
  PatchType,
  type CardID,
  type FindMessagesGroupsParams,
  type FindMessagesParams,
  type FindNotificationContextParams,
  type FindNotificationsParams,
  type Message,
  type MessageID,
  type MessagesGroup,
  type Notification,
  type NotificationContext,
  type RichText,
  type SocialID,
  MessageType,
  type ContextID,
  type AccountID
} from '@hcengineering/communication-types'
import {
  type CreateAttachmentEvent,
  type CreateMessageEvent,
  type CreateMessageResult,
  type CreatePatchEvent,
  type CreateReactionEvent,
  type CreateThreadEvent,
  type EventResult,
  type RemoveAttachmentEvent,
  type RemoveMessagesEvent,
  type RemoveReactionEvent,
  type RequestEvent,
  RequestEventType,
  type ResponseEvent,
  type UpdateNotificationContextEvent
} from '@hcengineering/communication-sdk-types'
import {
  type Client as PlatformClient,
  type ClientConnection as PlatformConnection,
  getCurrentAccount,
  SocialIdType
} from '@hcengineering/core'
import { onDestroy } from 'svelte'
import {
  createMessagesQuery,
  createNotificationsQuery,
  initLiveQueries,
  createNotificationContextsQuery
} from '@hcengineering/communication-client-query'

import { getCurrentWorkspaceUuid, getFilesUrl } from './file'

export { createMessagesQuery, createNotificationsQuery, createNotificationContextsQuery }

interface Connection extends PlatformConnection {
  findMessages: (params: FindMessagesParams, queryId?: number) => Promise<Message[]>
  findMessagesGroups: (params: FindMessagesGroupsParams) => Promise<MessagesGroup[]>
  findNotificationContexts: (params: FindNotificationContextParams, queryId?: number) => Promise<NotificationContext[]>
  findNotifications: (params: FindNotificationsParams, queryId?: number) => Promise<Notification[]>
  sendEvent: (event: RequestEvent) => Promise<EventResult>
  unsubscribeQuery: (id: number) => Promise<void>
}

let client: CommunicationClient

export type CommunicationClient = Client

export function getCommunicationClient (): CommunicationClient {
  return client
}

export async function setCommunicationClient (platformClient: PlatformClient): Promise<void> {
  const connection = platformClient.getConnection?.()
  if (connection === undefined) {
    return
  }
  client = new Client(connection as unknown as Connection)
  initLiveQueries(client, getCurrentWorkspaceUuid(), getFilesUrl(), onDestroy)
}

class Client {
  constructor (private readonly connection: Connection) {
    connection.pushHandler((...events: any[]) => {
      for (const event of events) {
        if (event != null && 'type' in event) {
          this.onEvent(event as ResponseEvent)
        }
      }
    })
  }

  onEvent: (event: ResponseEvent) => void = () => {}

  async createThread (card: CardID, message: MessageID, thread: CardID): Promise<void> {
    const event: CreateThreadEvent = {
      type: RequestEventType.CreateThread,
      card,
      message,
      thread
    }

    await this.connection.sendEvent(event)
  }

  async createMessage (card: CardID, content: RichText): Promise<MessageID> {
    const event: CreateMessageEvent = {
      type: RequestEventType.CreateMessage,
      messageType: MessageType.Message,
      card,
      content,
      creator: this.getSocialId()
    }
    const result = await this.connection.sendEvent(event)
    return (result as CreateMessageResult).id
  }

  async removeMessage (card: CardID, message: MessageID): Promise<void> {
    const event: RemoveMessagesEvent = {
      type: RequestEventType.RemoveMessages,
      card,
      messages: [message]
    }
    await this.connection.sendEvent(event)
  }

  async updateMessage (card: CardID, message: MessageID, content: RichText): Promise<void> {
    const event: CreatePatchEvent = {
      type: RequestEventType.CreatePatch,
      patchType: PatchType.update,
      card,
      message,
      content,
      creator: this.getSocialId()
    }
    await this.connection.sendEvent(event)
  }

  async createReaction (card: CardID, message: MessageID, reaction: string): Promise<void> {
    const event: CreateReactionEvent = {
      type: RequestEventType.CreateReaction,
      card,
      message,
      reaction,
      creator: this.getSocialId()
    }
    await this.connection.sendEvent(event)
  }

  async removeReaction (card: CardID, message: MessageID, reaction: string): Promise<void> {
    const event: RemoveReactionEvent = {
      type: RequestEventType.RemoveReaction,
      card,
      message,
      reaction,
      creator: this.getSocialId()
    }
    await this.connection.sendEvent(event)
  }

  async createAttachment (card: CardID, message: MessageID, attachment: CardID): Promise<void> {
    const event: CreateAttachmentEvent = {
      type: RequestEventType.CreateAttachment,
      card,
      message,
      attachment,
      creator: this.getSocialId()
    }
    await this.connection.sendEvent(event)
  }

  async removeAttachment (card: CardID, message: MessageID, attachment: CardID): Promise<void> {
    const event: RemoveAttachmentEvent = {
      type: RequestEventType.RemoveAttachment,
      card,
      message,
      attachment
    }
    await this.connection.sendEvent(event)
  }

  async updateNotificationContext (context: ContextID, lastView?: Date): Promise<void> {
    const event: UpdateNotificationContextEvent = {
      type: RequestEventType.UpdateNotificationContext,
      context,
      account: this.getAccount(),
      lastView
    }
    await this.connection.sendEvent(event)
  }

  async findMessages (params: FindMessagesParams, queryId?: number): Promise<Message[]> {
    return await this.connection.findMessages(params, queryId)
  }

  async findMessagesGroups (params: FindMessagesGroupsParams): Promise<MessagesGroup[]> {
    return await this.connection.findMessagesGroups(params)
  }

  async findNotificationContexts (
    params: FindNotificationContextParams,
    queryId?: number
  ): Promise<NotificationContext[]> {
    return await this.connection.findNotificationContexts(params, queryId)
  }

  async findNotifications (params: FindNotificationsParams, queryId?: number): Promise<Notification[]> {
    return await this.connection.findNotifications(params, queryId)
  }

  async unsubscribeQuery (id: number): Promise<void> {
    await this.connection.unsubscribeQuery(id)
  }

  close (): void {
    // do nothing
  }

  private getSocialId (): SocialID {
    const id = getCurrentAccount().socialIds.find((it) => it.startsWith(SocialIdType.HULY))
    if (id == null) throw new Error('Huly social id not found')
    return id
  }

  private getAccount (): AccountID {
    return getCurrentAccount().uuid
  }
}
