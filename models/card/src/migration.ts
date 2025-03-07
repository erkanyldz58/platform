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

import { DOMAIN_CARD } from '@hcengineering/card'
import { chunterId } from '@hcengineering/chunter'
import core, { type Client, type Data, type Doc, TxOperations } from '@hcengineering/core'
import {
  tryMigrate,
  tryUpgrade,
  type MigrateOperation,
  type MigrationClient,
  type MigrationUpgradeClient
} from '@hcengineering/model'
import view from '@hcengineering/view'
import card from '.'

export const cardOperation: MigrateOperation = {
  async migrate (client: MigrationClient): Promise<void> {
    await tryMigrate(client, chunterId, [
      {
        state: 'set-parent-info',
        func: setParentInfo
      }
    ])
  },
  async upgrade (state: Map<string, Set<string>>, client: () => Promise<MigrationUpgradeClient>): Promise<void> {
    await tryUpgrade(state, client, chunterId, [
      {
        state: 'migrateViewlets',
        func: migrateViewlets
      }
    ])
  }
}

async function setParentInfo (client: MigrationClient): Promise<void> {
  await client.update(
    DOMAIN_CARD,
    {
      parentInfo: { $exists: false }
    },
    {
      parentInfo: []
    }
  )
}

function extractObjectProps<T extends Doc> (doc: T): Data<T> {
  const data: any = {}
  for (const key in doc) {
    if (key === '_id') {
      continue
    }
    data[key] = doc[key]
  }
  return data as Data<T>
}

async function migrateViewlets (client: Client): Promise<void> {
  const txOp = new TxOperations(client, core.account.System)
  const viewlets = await client.findAll(view.class.Viewlet, { attachTo: card.class.Card })
  const masterTags = await client.findAll(card.class.MasterTag, {})
  const currentViewlets = await client.findAll(view.class.Viewlet, { attachTo: { $in: masterTags.map((p) => p._id) } })
  for (const masterTag of masterTags) {
    for (const viewlet of viewlets) {
      const base = extractObjectProps(viewlet)
      const current = currentViewlets.find(
        (p) => p.attachTo === masterTag._id && p.variant === viewlet.variant && p.descriptor === viewlet.descriptor
      )
      if (current === undefined) {
        await txOp.createDoc(view.class.Viewlet, core.space.Model, {
          ...base,
          attachTo: masterTag._id
        })
      } else {
        await txOp.diffUpdate(current, {
          ...base,
          attachTo: masterTag._id
        })
      }
    }
  }
}
