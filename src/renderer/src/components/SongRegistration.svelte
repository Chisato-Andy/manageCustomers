<script lang="ts">
  import type { CustomerType, SongType } from '../../../lib/type'
  import { onMount } from 'svelte'

  // 型 & 変数的な
  let songModel: SongType = {
    name: '',
    customer_id: -1,
    memo: ''
  }

  let errorlist = {
    name: '',
    customer_id: '',
    memo: ''
  }

  let customerList: CustomerType[] = []
  onMount(async () => {
    const fetchCustomerList = async () => {
      customerList = await window.api.selectCustomerWithBlacklist(false)
    }
    fetchCustomerList()
  })

  let successMessage = 'registering'

  // validation
  function checkName(): void {
    successMessage = 'registering'
    if (!songModel.name) {
      errorlist.name = '・曲名は必須です'
    } else if (songModel.name.length > 30) {
      errorlist.name = '・曲名は30字以内で入力してください'
    } else {
      errorlist.name = ''
    }
  }

  function checkCustomer(): void {
    successMessage = 'registering'
    if (songModel.customer_id === -1) {
      errorlist.customer_id = '・顧客を選択してください'
    } else {
      errorlist.customer_id = ''
    }
  }

  function checkMemo(): void {
    successMessage = 'registering'
    if (songModel.memo.length > 300) {
      errorlist.memo = '・メモは300字以内で入力してください'
    } else {
      errorlist.memo = ''
    }
  }

  // 関数集
  function handleSubmit(): void {
    successMessage = 'registering'

    // 入力チェック
    checkName()
    checkCustomer()
    checkMemo()

    if (errorlist.name === '' && errorlist.customer_id === '' && errorlist.memo === '') {
      // 登録する処理追加
      const result = window.api.registerSong(songModel)

      if (result) {
        // 入力欄きれいに
        cleanErrorlist()
        cleanSongInput()
        successMessage = '登録が完了しました！'
      } else {
        successMessage = '登録に失敗しました、'
      }
    } else {
      successMessage = 'registering'
    }
  }

  function cleanSongInput(): void {
    songModel.name = ''
    songModel.customer_id = -1
    songModel.memo = ''
  }

  function cleanErrorlist(): void {
    errorlist.name = ''
    errorlist.customer_id = ''
    errorlist.memo = ''
  }
</script>

<div>
  <h1>曲登録</h1>
  {#if errorlist.name}
    <dev class="error">{errorlist.name}</dev>
    <br />
  {/if}
  {#if errorlist.customer_id}
    <dev class="error">{errorlist.customer_id}</dev>
    <br />
  {/if}
  {#if errorlist.memo}
    <dev class="error">{errorlist.memo}</dev>
    <br />
  {/if}

  <form on:submit|preventDefault={handleSubmit}>
    <div class="need">赤字：必須項目</div>
    <table>
      <tr>
        <td style="color: red;">曲名</td>
        <td>
          <input
            type="text"
            bind:value={songModel.name}
            autocomplete="off"
            style="width:300px; height:30px;"
            on:input={() => checkName()}
          />
        </td>
      </tr>
      <tr>
        <td style="color: red;">顧客名</td>
        <td>
          <select
            bind:value={songModel.customer_id}
            on:change={() => checkCustomer()}
            style="width:300px; height:30px;"
          >
            <option value="-1" disabled selected>顧客を選択してください</option>
            {#each customerList as customer}
              <option value={customer.id}>{customer.name}</option>
            {/each}
          </select>
        </td>
      </tr>
      <tr>
        <td>Memo</td>
        <td>
          <textarea bind:value={songModel.memo} rows="8" cols="40" on:input={() => checkMemo()} />
        </td>
      </tr>
    </table>
    <br />
    <div style="display: flex; align-items: center;">
      <button type="submit" class="register-button">登録</button>
      {#if successMessage && successMessage !== 'registering'}
        <div style="color: green;">{successMessage}</div>
      {/if}
    </div>
  </form>
</div>

<style>
  .error {
    color: red;
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
    border: 1px solid #ccc;
  }
  .register-button {
    margin-right: 20px;
    cursor: pointer;
    border-radius: 20px;
    padding: 5px 15px;
    font-size: 16px;
    background-color: transparent;
    color: white;
    border: 1px solid white;
  }
</style>
