<!--
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
-->
<script lang="ts">
  import { Class, Doc, Ref } from '@hcengineering/core'
  import { getClient } from '@hcengineering/presentation'
  import { Separator, deviceOptionsStore as deviceInfo } from '@hcengineering/ui'
  import { SpecialView } from '@hcengineering/workbench-resources'
  import card from '../plugin'
  import Navigator from './Navigator.svelte'
  import { onDestroy } from 'svelte'
  import { IntlString } from '@hcengineering/platform'

  export let currentSpace: Ref<Class<Doc>>

  $: _class = currentSpace

  const client = getClient()

  $: label = getLabel(_class)

  function getLabel (_class: Ref<Class<Doc>> | undefined): IntlString | undefined {
    try {
      const clazz = _class !== undefined ? client.getHierarchy().getClass(_class) : undefined
      return clazz?.label
    } catch {}
  }

  let replacedPanel: HTMLElement
  $: $deviceInfo.replacedPanel = replacedPanel
  onDestroy(() => ($deviceInfo.replacedPanel = undefined))
</script>

<div class="hulyPanels-container">
  {#if $deviceInfo.navigator.visible}
    <Navigator bind:_class />
    <Separator
      name={'workbench'}
      float={$deviceInfo.navigator.float}
      index={0}
      color={'transparent'}
      separatorSize={0}
      short
    />
  {/if}

  <div class="hulyComponent" bind:this={replacedPanel}>
    {#if _class !== undefined && label !== undefined}
      <SpecialView {_class} {label} icon={card.icon.Card} />
    {/if}
  </div>
</div>
