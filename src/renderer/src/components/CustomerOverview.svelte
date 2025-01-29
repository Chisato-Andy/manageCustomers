<script lang="ts">
  import type { CustomerType } from '../../../lib/type'
  import { onMount } from 'svelte'

  const api = (window as any).api

  let originalCustomerList: CustomerType[] = []
  let customerList: CustomerType[] = []
  let expandedCustomers = new Set<number>()
  let searchQuery: string = ''

  // 顧客リストの取得
  onMount(async () => {
    const fetchCustomerList = async () => {
      customerList = await api.selectCustomerWithBlacklist(false)
      originalCustomerList = [...customerList]
    }

    fetchCustomerList()
  })

  // 顧客の展開状態をトグルする関数
  function toggleCustomer(customerId: number): void {
    if (expandedCustomers.has(customerId)) {
      expandedCustomers.delete(customerId)
    } else {
      expandedCustomers.add(customerId)
    }
    expandedCustomers = new Set(expandedCustomers)
  }

  // 検索条件に基づいて顧客をフィルタリングする関数
  function filterCustomers() {
    if (!searchQuery) {
      customerList = [...originalCustomerList]
    } else {
      // あいまい検索
      customerList = originalCustomerList.filter((customer) => {
        const normalizedQuery = searchQuery.trim().toLowerCase()
        const normalizedCustomerName = customer.name.trim().toLowerCase()
        const isCustomerMatch = normalizedCustomerName.includes(normalizedQuery)
        const isSongMatch = customer.songlist.some((song) =>
          song.name.trim().toLowerCase().includes(normalizedQuery)
        )
        return isCustomerMatch || isSongMatch
      })
    }
  }
</script>

<div class="search-box">
  <input type="text" placeholder="検索..." bind:value={searchQuery} />
  <button on:click={() => filterCustomers()}>検索</button>
</div>

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
          <th>メモ</th>
        </tr>
      </thead>
      <tbody>
        {#each customerList as customer}
          <tr class="clickable" on:click={() => toggleCustomer(customer.id)}>
            <td>{customer.name}</td>
            <td>{customer.age}</td>
            <td>{customer.birthday}</td>
            <td>{customer.place}</td>
            <td>{customer.hobby}</td>
            <td>{customer.contact}</td>
            <td>{customer.memo}</td>
          </tr>
          <!-- 曲リストの表示/非表示 -->
          {#if expandedCustomers.has(customer.id)}
            <tr>
              <td colspan="6">
                <div class="song-list">
                  {#if customer.songlist.length === 0}
                    曲が登録されていません
                  {:else}
                    <table>
                      <thead>
                        <tr>
                          <th>曲名</th>
                          <th>メモ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {#each customer.songlist as song}
                          <tr>
                            <td>{song.name}</td>
                            <td>{song.memo}</td>
                          </tr>
                        {/each}
                      </tbody>
                    </table>
                  {/if}
                </div>
              </td>
            </tr>
          {/if}
        {/each}
      </tbody>
    </table>
  {:else}
    <p>No customers found.</p>
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

  .song-list {
    padding: 0.5em;
    background: #f9f9f9;
    border: 1px solid #ccc;
    color: black;
  }

  .song-list table {
    width: 100%;
    border-collapse: collapse;
  }

  .song-list th,
  .song-list td {
    border: 1px solid #ccc;
    padding: 0.5em;
  }

  .search-box input {
    font-size: 1.2em;
    padding: 0.5em;
    width: 60%;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .search-box button {
    font-size: 1.2em;
    padding: 0.5em 1.2em;
    border: none;
    background-color: #007bff;
    color: white;
    border-radius: 4px;
    cursor: pointer;
  }

  .search-box button:hover {
    background-color: #0056b3;
  }
</style>
