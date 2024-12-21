<script lang="ts">
  // 型 & 変数的な
  let customerModel = {
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

  // validation
  function checkName(): void {
    if (!customerModel.name) {
      errorlist.name = '・名前は必須です'
    } else if (customerModel.name.length > 30) {
      errorlist.name = '・名前は30字以内で入力してください'
    } else {
      errorlist.name = ''
    }
  }

  function checkAge(): void {
    if (customerModel.age.length > 5) {
      errorlist.age = '・年齢は5字以内で入力してください'
    } else {
      errorlist.age = ''
    }
  }

  function checkBirthday(): void {
    // 誕生日処理追加
    if (customerModel.birthday) {
      errorlist.birthday = customerModel.birthday
    }
  }

  function checkPlace(): void {
    if (customerModel.place.length > 50) {
      errorlist.place = '・活動場所は50字以内で入力してください'
    } else {
      errorlist.place = ''
    }
  }

  function checkHobby(): void {
    if (customerModel.hobby.length > 100) {
      errorlist.hobby = '・趣味は100字以内で入力してください'
    } else {
      errorlist.hobby = ''
    }
  }

  function checkContact(): void {
    if (!customerModel.contact) {
      errorlist.contact = '・連絡方法は必須です'
    } else if (customerModel.contact.length > 50) {
      errorlist.contact = '・連絡方法は50字以内で入力してください'
    } else {
      errorlist.contact = ''
    }
  }

  // function checkInputs(): boolean {
  //   let result = true
  //   if (!customerModel.name) {
  //     errorlist.name = '・名前は必須です'
  //     result = false
  //   }
  //   // 連絡方法が空ならエラーメッセージを追加
  //   if (!customerModel.contact) {
  //     errorlist.contact = '・連絡方法は必須です'
  //     result = false;
  //   }
  //   // 楽曲提供の状態が選択されていない場合
  //   if (customerModel.isGiven === null) {
  //     errorlist.isGiven = '・楽曲提供の状態を選択してください';
  //     result = false;
  //   }
  //   // ブラックリスト対象が選択されていない場合
  //   if (customerModel.isBlack === null) {
  //     errorlist.isBlack = '・ブラックリスト対象を選択してください';
  //     result = false;
  //   }

  //   return result;
  // }

  // 関数集
  function handleSubmit(): void {
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
      successMessage = '登録が完了しました！'
      // 登録する処理追加

      // 入力欄きれいに
      cleanErrorlist()
      cleanCustomerInput()
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
