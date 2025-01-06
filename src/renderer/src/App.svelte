<script lang="ts">
  import { push, location } from 'svelte-spa-router'
  import CustomerOverview from './components/CustomerOverview.svelte'
  import CustomerRegistration from './components/CustomerRegistration.svelte'
  import SongRegistration from './components/SongRegistration.svelte'
  import Blacklist from './components/Blacklist.svelte'

  // ルート遷移の関数
  function navigateTo(path: string) {
    push(path)
  }
</script>

<div class="button-container">
  <button on:click={() => navigateTo('/')}>初期画面</button>
  <button on:click={() => navigateTo('/customer-registration')}>顧客登録</button>
  <button on:click={() => navigateTo('/song-registration')}>曲登録</button>
  <button on:click={() => navigateTo('/blacklist')}>ブラックリスト</button>
</div>

<div class="route-container">
  <!-- ルーティングされるコンポーネント -->
  {#if $location === '/'}
    <CustomerOverview />
  {/if}

  {#if $location === '/customer-registration'}
    <CustomerRegistration />
  {/if}

  {#if $location === '/song-registration'}
    <SongRegistration />
  {/if}

  {#if $location === '/blacklist'}
    <Blacklist />
  {/if}
</div>

<style>
  .route-container {
    margin-top: 100px; /* コンテンツの上にスペースを追加 */
  }
</style>
