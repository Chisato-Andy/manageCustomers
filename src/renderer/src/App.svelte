<script lang="ts">
  import { Router, Route, Link } from 'svelte-routing'
  import CustomerOverview from './components/CustomerOverview.svelte'
  import CustomerRegistration from './components/CustomerRegistration.svelte'
  import SongRegistration from './components/SongRegistration.svelte'
  import Blacklist from './components/Blacklist.svelte'
</script>

<Router>
  <div class="button-container">
    <Link to="/">
      <button>初期画面</button>
    </Link>

    <Link to="/customer-registration">
      <button>顧客登録</button>
    </Link>

    <Link to="/song-registration">
      <button>曲登録</button>
    </Link>

    <Link to="/blacklist">
      <button>ブラックリスト</button>
    </Link>
  </div>

  <div class="route-container">
    <Route path="/" component={CustomerOverview} />
    <Route path="/customer-registration" component={CustomerRegistration} />
    <Route path="/song-registration" component={SongRegistration} />
    <Route path="/blacklist" component={Blacklist} />
  </div>
</Router>

<style>
  .route-container {
    margin-top: 100px; /* コンテンツの上にスペースを追加 */
  }
</style>
