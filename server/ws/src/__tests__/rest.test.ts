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

// import { generateToken } from '@hcengineering/server-token'

// import { createRestClient, type RestClient } from '@hcengineering/api-client'
// import core, {
//   type Class,
//   type Doc,
//   type DocumentQuery,
//   type Domain,
//   type FindOptions,
//   type FindResult,
//   generateId,
//   Hierarchy,
//   type MeasureContext,
//   MeasureMetricsContext,
//   ModelDb,
//   type PersonId,
//   type PersonUuid,
//   type Ref,
//   type Space,
//   toFindResult,
//   type Tx,
//   type TxCreateDoc,
//   type TxResult,
//   type WorkspaceUuid
// } from '@hcengineering/core'
// import { ClientSession, startSessionManager } from '@hcengineering/server'
// import { createDummyStorageAdapter } from '@hcengineering/server-core'
// import { generateToken } from '@hcengineering/server-token'
// import { startHttpServer } from '../server_http'
// import { genMinModel } from './minmodel'

describe.skip('rest-server', () => {
  // async function getModelDb (): Promise<{ modelDb: ModelDb, hierarchy: Hierarchy, txes: Tx[] }> {
  //   const txes = genMinModel()
  //   const hierarchy = new Hierarchy()
  //   for (const tx of txes) {
  //     hierarchy.tx(tx)
  //   }
  //   const modelDb = new ModelDb(hierarchy)
  //   for (const tx of txes) {
  //     await modelDb.tx(tx)
  //   }
  //   return { modelDb, hierarchy, txes }
  // }

  // let shutdown: () => Promise<void>
  // const port: number = 3330

  // beforeAll(async () => {
  //   ;({ shutdown } = startSessionManager(new MeasureMetricsContext('test', {}), {
  //     pipelineFactory: async () => {
  //       const { modelDb, hierarchy, txes } = await getModelDb()
  //       return {
  //         hierarchy,
  //         modelDb,
  //         context: {
  //           workspace: {
  //             url: 'test-ws',
  //             uuid: 'test-ws' as WorkspaceUuid
  //           },
  //           hierarchy,
  //           modelDb,
  //           lastTx: generateId(),
  //           lastHash: generateId(),
  //           contextVars: {},
  //           branding: null
  //         },
  //         handleBroadcast: async (ctx) => {},
  //         findAll: async <T extends Doc>(
  //           ctx: MeasureContext,
  //           _class: Ref<Class<T>>,
  //           query: DocumentQuery<T>,
  //           options?: FindOptions<T>
  //         ): Promise<FindResult<T>> => toFindResult(await modelDb.findAll(_class, query, options)),
  //         tx: async (ctx: MeasureContext, tx: Tx[]): Promise<[TxResult, Tx[], string[] | undefined]> => [
  //           await modelDb.tx(...tx),
  //           [],
  //           undefined
  //         ],
  //         groupBy: async () => new Map(),
  //         close: async () => {},
  //         domains: async () => hierarchy.domains(),
  //         find: (ctx: MeasureContext, domain: Domain) => ({
  //           next: async (ctx: MeasureContext) => undefined,
  //           close: async (ctx: MeasureContext) => {}
  //         }),
  //         load: async (ctx: MeasureContext, domain: Domain, docs: Ref<Doc>[]) => [],
  //         upload: async (ctx: MeasureContext, domain: Domain, docs: Doc[]) => {},
  //         clean: async (ctx: MeasureContext, domain: Domain, docs: Ref<Doc>[]) => {},
  //         searchFulltext: async (ctx, query, options) => {
  //           return { docs: [] }
  //         },
  //         loadModel: async (ctx, lastModelTx, hash) => ({
  //           full: true,
  //           hash: generateId(),
  //           transactions: txes
  //         })
  //       }
  //     },
  //     sessionFactory: (token, workspace, account) => new ClientSession(token, workspace, account, true),
  //     port,
  //     brandingMap: {},
  //     serverFactory: startHttpServer,
  //     accountsUrl: '',
  //     externalStorage: createDummyStorageAdapter()
  //   }))
  // })
  // afterAll(async () => {
  //   await shutdown()
  // })

  // async function connect (): Promise<RestClient> {
  //   const token: string = generateToken('user1@site.com' as PersonUuid, 'test-ws' as WorkspaceUuid)
  //   return await createRestClient(`http://localhost:${port}`, 'test-ws', token)
  // }

  // it('get account', async () => {
  //   const conn = await connect()
  //   const account = await conn.getAccount()

  //   expect(account.uuid).toBe('user1@site.com')
  //   expect(account.role).toBe('OWNER')
  //   expect(account.primarySocialId).toBe('user1@site.com')
  // })

  // it('find spaces', async () => {
  //   const conn = await connect()
  //   const spaces = await conn.findAll(core.class.Space, {})
  //   expect(spaces.length).toBe(2)
  //   expect(spaces[0].name).toBe('Sp1')
  //   expect(spaces[1].name).toBe('Sp2')
  // })

  // it('find avg', async () => {
  //   const conn = await connect()
  //   let ops = 0
  //   let total = 0
  //   const attempts = 1000
  //   for (let i = 0; i < attempts; i++) {
  //     const st = performance.now()
  //     const spaces = await conn.findAll(core.class.Space, {})
  //     expect(spaces.length).toBe(2)
  //     expect(spaces[0].name).toBe('Sp1')
  //     expect(spaces[1].name).toBe('Sp2')
  //     const ed = performance.now()
  //     ops++
  //     total += ed - st
  //   }
  //   const avg = total / ops
  //   // console.log('ops:', ops, 'total:', total, 'avg:', )
  //   expect(ops).toEqual(attempts)
  //   expect(avg).toBeLessThan(5) // 5ms max per operation
  // })

  it.skip('add space', async () => {
    //   const conn = await connect()
    //   const tx: TxCreateDoc<Space> = {
    //     _class: core.class.TxCreateDoc,
    //     space: core.space.Tx,
    //     _id: generateId(),
    //     objectSpace: core.space.Model,
    //     modifiedBy: 'user1@site.com' as PersonId,
    //     modifiedOn: Date.now(),
    //     attributes: {
    //       name: 'Sp3',
    //       description: '',
    //       private: false,
    //       archived: false,
    //       members: [],
    //       autoJoin: false
    //     },
    //     objectClass: core.class.Space,
    //     objectId: generateId()
    //   }
    //   await conn.tx(tx)
    //   const spaces = await conn.findAll(core.class.Space, {})
    //   expect(spaces.length).toBe(3)
  })
})
