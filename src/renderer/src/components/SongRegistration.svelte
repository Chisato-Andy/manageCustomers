<script lang="ts">
  import { onMount } from 'svelte'
  import type { CustomerType, SongType } from '../../../lib/type'

  const api = (window as any).api

  let mode: 'register' | 'update' = 'register'
  let previousMode: 'register' | 'update' = mode
  let songList: SongType[] = []
  let customerList: CustomerType[] = []
  let selectedSongId: number = -1

  let songModel: SongType = {
    id: -1,
    name: '',
    customer_id: -1,
    memo: ''
  }

  let errorlist = {
    name: '',
    customer_id: '',
    memo: ''
  }

  let successMessage = ''

  onMount(async () => {
    customerList = await api.selectCustomerWithBlacklist(false)
    songList = (await api.selectAllSongs()) || []
  })

  $: if (mode !== previousMode) {
    previousMode = mode
    cleanForm()
  }

  function selectSong() {
    const selected = songList.find((s) => s.id === selectedSongId)
    if (selected) {
      songModel = { ...selected }
      cleanErrorlist()
      successMessage = ''
    }
  }

  function checkName() {
    if (!songModel.name) {
      errorlist.name = '・曲名は必須です'
    } else if (songModel.name.length > 30) {
      errorlist.name = '・曲名は30字以内で入力してください'
    } else {
      errorlist.name = ''
    }
  }

  function checkCustomer() {
    if (songModel.customer_id === -1) {
      errorlist.customer_id = '・顧客を選択してください'
    } else {
      errorlist.customer_id = ''
    }
  }

  function checkMemo() {
    if (songModel.memo.length > 300) {
      errorlist.memo = '・メモは300字以内で入力してください'
    } else {
      errorlist.memo = ''
    }
  }

  function cleanErrorlist() {
    errorlist.name = ''
    errorlist.customer_id = ''
    errorlist.memo = ''
  }

  function cleanForm() {
    songModel = {
      id: -1,
      name: '',
      customer_id: -1,
      memo: ''
    }
    selectedSongId = -1
    cleanErrorlist()
  }

  async function handleSubmit() {
    checkName()
    checkCustomer()
    checkMemo()

    const hasError = Object.values(errorlist).some((v) => v !== '')
    if (hasError) return

    let result = false
    if (mode === 'register') {
      result = await api.registerSong(songModel)
    } else {
      result = await api.updateSong(songModel)
    }

    if (result) {
      successMessage = mode === 'register' ? '登録が完了しました！' : '更新が完了しました！'
      cleanForm()
      songList = (await api.selectAllSongs()) || []
    } else {
      successMessage = '登録／更新に失敗しました。'
    }
  }

  function getCustomerName(customerId: number): string {
    const customer = customerList.find((c) => c.id === customerId)
    return customer ? customer.name : '不明'
  }
</script>

<div style="margin-bottom: 10px;">
  <label><input type="radio" bind:group={mode} value="register" /> 登録</label>
  <label><input type="radio" bind:group={mode} value="update" /> 更新</label>
</div>

<!-- 更新モード：曲選択 -->
{#if mode === 'update'}
  <div style="margin-bottom: 10px;">
    <label for="song-select">更新する曲を選択</label><br />
    <select
      id="song-select"
      bind:value={selectedSongId}
      on:change={selectSong}
      style="width: 300px;"
    >
      <option value={-1}>-- 曲を選択 --</option>
      {#each songList as song}
        <option value={song.id}>
          {song.name} / {getCustomerName(song.customer_id)}
        </option>
      {/each}
    </select>
  </div>
{/if}

<!-- フォーム本体 -->
<form on:submit|preventDefault={handleSubmit}>
  <div class="need">赤字：必須項目</div>
  <table>
    <tr>
      <td style="color: red;">曲名</td>
      <td>
        <input
          type="text"
          bind:value={songModel.name}
          on:input={checkName}
          disabled={mode === 'update'}
        />
        {#if errorlist.name}<div class="error">{errorlist.name}</div>{/if}
      </td>
    </tr>
    <tr>
      <td style="color: red;">顧客名</td>
      <td>
        <select
          bind:value={songModel.customer_id}
          on:change={checkCustomer}
          disabled={mode === 'update'}
        >
          <option value={-1}>-- 顧客を選択 --</option>
          {#each customerList as c}
            <option value={c.id}>{c.name}</option>
          {/each}
        </select>
        {#if errorlist.customer_id}<div class="error">{errorlist.customer_id}</div>{/if}
      </td>
    </tr>
    <tr>
      <td>メモ</td>
      <td>
        <textarea bind:value={songModel.memo} rows="5" cols="40" on:input={checkMemo}></textarea>
        {#if errorlist.memo}<div class="error">{errorlist.memo}</div>{/if}
      </td>
    </tr>
  </table>

  <div style="margin-top: 10px;">
    <button type="submit">{mode === 'update' ? '更新' : '登録'}</button>
    <button type="button" on:click={cleanForm} style="margin-left: 10px;">クリア</button>
    {#if successMessage}<span style="color: green; margin-left: 10px;">{successMessage}</span>{/if}
  </div>
</form>

<style>
  .error {
    color: red;
    font-size: 0.9em;
  }
  .need {
    color: red;
  }
  table {
    border-collapse: collapse;
    width: 100%;
  }
  td {
    padding: 8px;
    vertical-align: top;
  }
  input[type='text'],
  select,
  textarea {
    width: 300px;
    padding: 4px;
  }
</style>
