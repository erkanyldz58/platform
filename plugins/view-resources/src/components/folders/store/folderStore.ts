// Copyright © 2024 Hardcore Engineering Inc.
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

import { type Doc, type Ref } from '@hcengineering/core'
import { writable, type Writable } from 'svelte/store'

import { type FoldersState, FoldersManager, emptyFoldersState } from './folderUtils'

export { type FoldersState, emptyFoldersState }

export const FoldersStore: Writable<Map<string, FoldersState>> = writable(new Map())

export const resetState = (storeId: string): void => {
  FoldersStore.update((map) => {
    map.delete(storeId)
    return map
  })
}

export function getFoldersManager (
  storeId: string,
  titleKey: string,
  parentKey: string,
  noParentId: Ref<Doc>,
  plainList: boolean
): FoldersManager {
  FoldersStore.update((map) => {
    return map.set(storeId, emptyFoldersState())
  })
  return new FoldersManager(titleKey, parentKey, noParentId, plainList, (state: FoldersState) => {
    FoldersStore.update((map) => {
      return map.set(storeId, state)
    })
  })
}
