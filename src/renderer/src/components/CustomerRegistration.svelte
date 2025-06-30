<script lang="ts">
  import { onMount } from 'svelte'
  import type { CustomerType } from '../../../lib/type'

  const api = (window as any).api

  let mode: 'register' | 'update' = 'register'
  let customerList: CustomerType[] = []
  let selectedCustomerId: number = -1

  let customerModel: CustomerType = {
    id: -1,
    name: '',
    age: '',
    birthday: '',
    place: '',
    hobby: '',
    contact: '',
    memo: '',
    isGiven: true,
    isBlack: false
  }

  let errorlist = {
    name: '',
    age: '',
    birthday: '',
    place: '',
    hobby: '',
    contact: '',
    memo: ''
  }

  let successMessage = ''
  let now = new Date()

  onMount(async () => {
    customerList = await api.selectCustomerWithBlacklist(false)
  })

  function selectCustomer() {
    const selected = customerList.find((c) => c.id === selectedCustomerId)
    if (selected) {
      customerModel = {
        ...selected,
        isGiven: selected.isGiven === true,
        isBlack: selected.isBlack === true
      }

      customerModel.isGiven = selected.isGiven === true
      customerModel.isBlack = selected.isBlack === true

      successMessage = ''
      cleanErrorlist()
    }
  }

  function checkName() {
    if (!customerModel.name) {
      errorlist.name = '・名前は必須です'
    } else if (customerModel.name.length > 30) {
      errorlist.name = '・名前は30字以内で入力してください'
    } else {
      errorlist.name = ''
    }
  }

  function checkAge() {
    if (customerModel.age.length > 5) {
      errorlist.age = '・年齢は5字以内で入力してください'
    } else if (customerModel.age && !/^\d+$/.test(customerModel.age)) {
      errorlist.age = '・数字のみ入力してください'
    } else {
      errorlist.age = ''
    }
  }

  function checkBirthday() {
    if (customerModel.birthday) {
      const birthDate = new Date(customerModel.birthday)
      if (birthDate > now) {
        errorlist.birthday = '・未来の日付は無効です'
      } else {
        errorlist.birthday = ''
      }
    } else {
      errorlist.birthday = ''
    }
  }

  function checkContact() {
    if (!customerModel.contact) {
      errorlist.contact = '・連絡方法は必須です'
    } else {
      errorlist.contact = ''
    }
  }

  function cleanErrorlist() {
    for (let key in errorlist) errorlist[key] = ''
  }

  function cleanForm() {
    customerModel = {
      id: -1,
      name: '',
      age: '',
      birthday: '',
      place: '',
      hobby: '',
      contact: '',
      memo: '',
      isGiven: true,
      isBlack: false
    }
    selectedCustomerId = -1
    cleanErrorlist()
  }

  async function handleSubmit() {
    checkName()
    checkAge()
    checkBirthday()
    checkContact()

    const hasError = Object.values(errorlist).some((v) => v !== '')
    if (hasError) return

    const result =
      mode === 'update'
        ? api.updateCustomerWithBlacklist(customerModel)
        : api.registerCustomer(customerModel)

    if (result) {
      successMessage = mode === 'update' ? '更新が完了しました！' : '登録が完了しました！'
      cleanForm()
      customerList = await api.selectCustomerWithBlacklist(false) // 再取得
    } else {
      successMessage = '登録/更新に失敗しました。'
    }
  }
</script>

<!-- モード選択 -->
<div>
  <label><input type="radio" bind:group={mode} value="register" /> 登録</label>
  <label><input type="radio" bind:group={mode} value="update" /> 更新</label>
</div>

<!-- 編集モード用: 顧客選択 -->
{#if mode === 'update'}
  <div style="margin-top: 10px;">
    <label for="customer-select">更新する顧客を選択</label><br />
    <select
      id="customer-select"
      bind:value={selectedCustomerId}
      on:change={selectCustomer}
      style="width: 300px;"
    >
      <option value={-1}>-- 顧客を選択 --</option>
      {#each customerList as c}
        <option value={c.id}>{c.name}</option>
      {/each}
    </select>
  </div>
{/if}

<!-- フォーム本体 -->
<form on:submit|preventDefault={handleSubmit}>
  <div class="need">赤字：必須項目</div>
  <table>
    <tr>
      <td style="color: red;">名前</td>
      <td>
        {#if mode === 'update'}
          <input type="text" bind:value={customerModel.name} disabled={mode === 'update'} />
        {:else}
          <input type="text" bind:value={customerModel.name} on:input={checkName} />
        {/if}
        {#if errorlist.name}<div class="error">{errorlist.name}</div>{/if}
      </td>
    </tr>
    <tr>
      <td>年齢</td>
      <td>
        <input type="text" bind:value={customerModel.age} on:input={checkAge} />
        {#if errorlist.age}<div class="error">{errorlist.age}</div>{/if}
      </td>
    </tr>
    <tr>
      <td>誕生日</td>
      <td>
        <input type="date" bind:value={customerModel.birthday} on:input={checkBirthday} />
        {#if errorlist.birthday}<div class="error">{errorlist.birthday}</div>{/if}
      </td>
    </tr>
    <tr>
      <td>活動場所</td>
      <td><input type="text" bind:value={customerModel.place} /></td>
    </tr>
    <tr>
      <td>趣味</td>
      <td><textarea bind:value={customerModel.hobby}></textarea></td>
    </tr>
    <tr>
      <td style="color: red;">連絡方法</td>
      <td>
        <input type="text" bind:value={customerModel.contact} on:input={checkContact} />
        {#if errorlist.contact}<div class="error">{errorlist.contact}</div>{/if}
      </td>
    </tr>
    <tr>
      <td>メモ</td>
      <td><textarea bind:value={customerModel.memo}></textarea></td>
    </tr>
    <tr>
      <td style="color: red;">楽曲提供</td>
      <td>
        <label>
          <input type="radio" bind:group={customerModel.isGiven} value={true} />
          提供済
        </label>
        <label>
          <input type="radio" bind:group={customerModel.isGiven} name="isGiven" value={false} />
          未提供
        </label>
      </td>
    </tr>
    <tr>
      <td style="color: red;">ブラックリスト対象</td>
      <td>
        <label>
          <input type="radio" bind:group={customerModel.isBlack} value={false} />
          対象にしない
        </label>
        <label>
          <input type="radio" bind:group={customerModel.isBlack} value={true} />
          対象にする
        </label>
      </td>
    </tr>
  </table>

  <div style="margin-top: 10px;">
    <button type="submit">{mode === 'update' ? '更新' : '登録'}</button>
    <button type="button" on:click={cleanForm} style="margin-left: 10px;">クリア</button>
    {#if successMessage}
      <span style="color: green; margin-left: 15px;">{successMessage}</span>
    {/if}
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
    width: 100%;
    border-collapse: collapse;
  }
  td {
    padding: 8px;
    vertical-align: top;
  }
  input[type='text'],
  input[type='date'],
  select,
  textarea {
    width: 300px;
    padding: 4px;
  }
</style>
