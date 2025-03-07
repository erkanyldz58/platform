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
import { type SendMailOptions, type Transporter } from 'nodemailer'

import config from './config'
import { getTransport } from './transport'

export class MailClient {
  private readonly transporter: Transporter

  constructor () {
    this.transporter = getTransport(config)
  }

  async sendMessage (message: SendMailOptions): Promise<void> {
    this.transporter.sendMail(message, (err, info) => {
      const messageInfo = `(from: ${message.from as string}, to: ${message.to as string})`
      if (err !== null) {
        console.error(`Failed to send email ${messageInfo}: `, err.message)
        console.log('Failed message details: ', message)
      } else {
        console.log(`Email request ${messageInfo} sent: ${info?.response}`)
      }
    })
  }
}
