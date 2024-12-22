<script lang="ts">
  import type { CustomerType } from '../../../backgraound/type'

  // 型 & 変数的な
  let customerModel: CustomerType = {
    name: '',
    age: '',
    birthday: '',
    place: '',
    hobby: '',
    contact: '',
    isGiven: true,
    isBlack: false
  }

  let errorlist = {
    name: '',
    age: '',
    birthday: '',
    place: '',
    hobby: '',
    contact: ''
  }

  let successMessage = 'registering'

  const now = new Date()

  // validation
  function checkName(): void {
    successMessage = 'registering'
    if (!customerModel.name) {
      errorlist.name = '・名前は必須です'
    } else if (customerModel.name.length > 30) {
      errorlist.name = '・名前は30字以内で入力してください'
    } else {
      errorlist.name = ''
    }
  }

  function checkAge(): void {
    successMessage = 'registering'
    if (customerModel.age.length > 5) {
      errorlist.age = '・年齢は5字以内で入力してください'
    } else {
      errorlist.age = ''
    }
  }

  function checkBirthday(): void {
    successMessage = 'registering'
    if (customerModel.birthday) {
      const inputBirthDay = new Date(customerModel.birthday)
      if (inputBirthDay > now) {
        errorlist.birthday = '・未来の日付は無効です'
      } else if (inputBirthDay < now && customerModel.age) {
        const inputAge = parseInt(customerModel.age, 10)
        // 入力値が数字に変換できなかった場合
        if (isNaN(inputAge)) {
          errorlist.age = 'A'
          return
        }

        // Calculate age from birthday
        // 年齢を誕生日から計算
        const yearDiff = now.getFullYear() - inputBirthDay.getFullYear()
        const hasHadBirthdayThisYear =
          // 月比較
          now.getMonth() > inputBirthDay.getMonth() ||
          // 月が一致した場合、に日にちを比較
          (now.getMonth() === inputBirthDay.getMonth() && now.getDate() >= inputBirthDay.getDate())

        const calculatedAge = hasHadBirthdayThisYear ? yearDiff : yearDiff - 1

        // Check if the calculated age matches the input age
        if (calculatedAge !== inputAge) {
          errorlist.birthday = `・年齢と誕生日が一致しません (誕生日から計算した年齢：${calculatedAge}）`
        } else {
          errorlist.birthday = ''
        }
      } else {
        errorlist.birthday = ''
      }
    }
  }

  function checkPlace(): void {
    successMessage = 'registering'
    if (customerModel.place.length > 50) {
      errorlist.place = '・活動場所は50字以内で入力してください'
    } else {
      errorlist.place = ''
    }
  }

  function checkHobby(): void {
    successMessage = 'registering'
    if (customerModel.hobby.length > 100) {
      errorlist.hobby = '・趣味は100字以内で入力してください'
    } else {
      errorlist.hobby = ''
    }
  }

  function checkContact(): void {
    successMessage = 'registering'
    if (!customerModel.contact) {
      errorlist.contact = '・連絡方法は必須です'
    } else if (customerModel.contact.length > 50) {
      errorlist.contact = '・連絡方法は50字以内で入力してください'
    } else {
      errorlist.contact = ''
    }
  }

  // 関数集
  function handleSubmit(): void {
    successMessage = 'registering'

    // 入力チェック
    checkName()
    checkAge()
    checkBirthday()
    checkPlace()
    checkHobby()
    checkContact()

    if (
      errorlist.name === '' &&
      errorlist.age === '' &&
      errorlist.birthday === '' &&
      errorlist.place === '' &&
      errorlist.hobby === '' &&
      errorlist.contact === ''
    ) {
      // 登録する処理追加
      const result = window.api.registerCustomer(customerModel)

      if (result) {
        // 入力欄きれいに
        cleanErrorlist()
        cleanCustomerInput()
        successMessage = '登録が完了しました！'
      } else {
        successMessage = '登録に失敗しました、'
      }
    } else {
      successMessage = 'registering'
    }
  }

  function cleanCustomerInput(): void {
    customerModel.name = ''
    customerModel.age = ''
    customerModel.birthday = ''
    customerModel.place = ''
    customerModel.hobby = ''
    customerModel.contact = ''
    customerModel.isGiven = true
    customerModel.isBlack = false
  }

  function cleanErrorlist(): void {
    errorlist.name = ''
    errorlist.age = ''
    errorlist.birthday = ''
    errorlist.place = ''
    errorlist.hobby = ''
    errorlist.contact = ''
  }
</script>

<h1>顧客登録</h1>
{#if errorlist.name}
  <dev class="error">{errorlist.name}</dev>
  <br />
{/if}
{#if errorlist.age}
  <dev class="error">{errorlist.age}</dev>
  <br />
{/if}
{#if errorlist.birthday}
  <dev class="error">{errorlist.birthday}</dev>
  <br />
{/if}
{#if errorlist.place}
  <dev class="error">{errorlist.place}</dev>
  <br />
{/if}
{#if errorlist.hobby}
  <dev class="error">{errorlist.hobby}</dev>
  <br />
{/if}
{#if errorlist.contact}
  <dev class="error">{errorlist.contact}</dev>
  <br />
{/if}
<br />
<form on:submit|preventDefault={handleSubmit}>
  <div class="need">赤字：必須項目</div>
  <table>
    <tr>
      <td style="color: red;">名前</td>
      <td>
        <input
          type="text"
          bind:value={customerModel.name}
          autocomplete="off"
          style="width:300px; height:30px;"
          on:input={() => checkName()}
        />
      </td>
    </tr>
    <tr>
      <td>年齢</td>
      <td>
        <input
          type="text"
          bind:value={customerModel.age}
          autocomplete="off"
          style="width:300px; height:30px;"
          on:input={() => checkAge()}
        />
      </td>
    </tr>
    <tr>
      <td>誕生日</td>
      <td>
        <input
          type="date"
          bind:value={customerModel.birthday}
          autocomplete="off"
          style="width:300px; height:30px;"
          on:input={() => checkBirthday()}
        />
      </td>
    </tr>
    <tr>
      <td>活動場所</td>
      <td>
        <input
          type="text"
          bind:value={customerModel.place}
          autocomplete="off"
          style="width:300px; height:30px;"
          on:input={() => checkPlace()}
        />
      </td>
    </tr>
    <tr>
      <td>趣味</td>
      <td>
        <textarea bind:value={customerModel.hobby} rows="5" cols="40" on:input={() => checkHobby()}
        ></textarea>
      </td>
    </tr>
    <tr>
      <td style="color: red;">連絡方法</td>
      <td>
        <input
          type="text"
          bind:value={customerModel.contact}
          autocomplete="off"
          style="width:300px; height:30px;"
          on:input={() => checkContact()}
        />
      </td>
    </tr>
    <tr>
      <td style="color: red;">楽曲提供</td>
      <td>
        <input
          type="radio"
          id="radio_isGiven_true"
          bind:group={customerModel.isGiven}
          value={true}
        />
        <label for="radio_isGiven_true">提供済</label>
        <input
          type="radio"
          id="radio_isGiven_false"
          bind:group={customerModel.isGiven}
          value={false}
        />
        <label for="radio_isGiven_false">未提供</label>
      </td>
    </tr>
    <tr>
      <td style="color: red;">ブラックリスト対象</td>
      <td>
        <input
          type="radio"
          id="radio_isBlack_false"
          bind:group={customerModel.isBlack}
          value={false}
        />
        <label for="radio_isBlack_false">対象にしない</label>
        <input
          type="radio"
          id="radio_isBlack_true"
          bind:group={customerModel.isBlack}
          value={true}
        />
        <label for="radio_isBlack_true">対象にする</label>
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
