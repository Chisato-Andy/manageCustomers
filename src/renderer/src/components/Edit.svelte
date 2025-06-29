<script lang="ts">
  import { writable } from 'svelte/store'

  let editedType = writable('customer')
</script>

<div>
  <h1>編集</h1>
  <form>
    <input type="radio" id="editedCustomer" bind:group={editedType} value="customer" />
    <label for="editedCustomer">顧客情報</label>
    <input type="radio" id="editedSong" bind:group={editedType} value="song" />
    <label for="editedSong">曲情報</label>
  </form>
</div>
{#if editedType === 'customer'}
  <!-- 顧客登録フォーム -->
  <div>
    <h1>顧客登録</h1>
  </div>
{/if}

{#if editedType === "song"}
  <!-- 曲登録フォーム -->
  <div>
    <h1>曲登録</h1>
  </div>
{/if}

<style>
</style>
