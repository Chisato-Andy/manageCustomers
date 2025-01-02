<script lang="ts">
  import type { CustomerType } from '../../../lib/type'
  import { onMount } from 'svelte'

  let customerList: Customer[] = []
  let selectedCustomerId: number | null = null
  let songList: SongType[] = []

  // 顧客リストの取得
  onMount(async () => {
    const fetchCustomerList = async () => {
      customerList = await window.api.selectCustomerWithBlacklist(false)
    }
    fetchCustomerList()
  })

  // 曲リストの取得と表示切り替え
  const toggleSongList = async (customerId: number) => {
    if (selectedCustomerId === customerId) {
      // 同じ顧客をクリックした場合、リストを閉じる
      selectedCustomerId = null
      songList = []
    } else {
      // 選択された顧客の曲リストを取得
      selectedCustomerId = customerId
      songList = await window.api.selectSongsByCustomerId(customerId)
    }
  }
</script>

<div class="box">
  {#if customerList.length > 0}
    <table>
      <thead>
        <tr>
          <th>名前</th>
          <th>年齢</th>
          <th>誕生日</th>
          <th>活動場所</th>
          <th>趣味</th>
          <th>連絡方法</th>
        </tr>
      </thead>
      <tbody>
        {#each customerList as customer}
          <tr class="clickable" on:click={() => toggleSongList(customer.id)}>
            <td>{customer.name}</td>
            <td>{customer.age}</td>
            <td>{customer.birthday}</td>
            <td>{customer.place}</td>
            <td>{customer.hobby}</td>
            <td>{customer.contact}</td>
          </tr>
          {#if selectedCustomerId === customer.id && songList.length > 0}
            <tr>
              <td colspan="6">
                <ul>
                  {#each songList as song}
                    <li>{song.name}</li>
                  {/each}
                </ul>
              </td>
            </tr>
          {/if}
        {/each}
      </tbody>
    </table>
  {:else}
    <p>No customers in the blacklist.</p>
  {/if}
</div>

<style>
  table {
    border-collapse: collapse;
    margin-top: 1em;
    width: 100%;
  }

  th,
  td {
    border: 1px solid #ccc;
    padding: 0.5em;
    text-align: left;
    max-width: 300px;
    white-space: pre-wrap;
  }

  .box {
    height: 35em;
    overflow: auto;
    border-collapse: collapse;
  }

  .clickable {
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .clickable:hover {
    background-color: #f0f0f0;
  }

  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  li {
    margin: 0.5em 0;
  }
</style>
