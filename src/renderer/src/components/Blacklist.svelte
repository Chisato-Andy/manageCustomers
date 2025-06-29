<script lang="ts">
  import type { CustomerType } from '../../../lib/type'
  import { onMount, afterUpdate } from 'svelte'

  const api = (window as any).api

  let customerList: CustomerType[] = []
  onMount(async () => {
    const fetchCustomerList = async () => {
      customerList = await api.selectCustomerWithBlacklist(true)
    }
    fetchCustomerList()
    console.log('blacklist')
  })

  function toggleIsBlack(id: number) {
    api.updateCustomerWithBlacklist(id).then(() => {
      const fetchCustomerList = async () => {
        customerList = await api.selectCustomerWithBlacklist(true)
      }
      fetchCustomerList()
    })
  }

  // スクロール
  let box
  afterUpdate(() => {
    if (customerList) scrollToBottom(box)
  })
  $: if (customerList && box) {
    scrollToBottom(box)
  }
  const scrollToBottom = async (node) => {
    node.scroll({ top: node.scrollHeight, behavior: 'smooth' })
  }
</script>

<h1 style="border-collapse: collapse;">ブラックリスト</h1>
<div class="box" bind:this={box}>
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
          <th></th>
        </tr>
      </thead>
      <tbody>
        {#each customerList as customer}
          <tr>
            <td>{customer.name}</td>
            <td>{customer.age}</td>
            <td>{customer.birthday}</td>
            <td>{customer.place}</td>
            <td>{customer.hobby}</td>
            <td>{customer.contact}</td>
            <td>{customer.memo}</td>
            <td>
              <button on:click={() => toggleIsBlack(customer.id)}>ブラックリストから削除</button>
            </td>
          </tr>
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

  button {
    padding: 0.5em;
    color: white;
    background-color: #007bff;
    border: none;
    cursor: pointer;
  }

  button:hover {
    background-color: #0056b3;
  }

  .box {
    height: 35em;
    overflow: auto;
    border-collapse: collapse;
  }
</style>
