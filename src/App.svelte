<script>
  import { Router, Route, Link } from "svelte-navigator";
  import Game from "./views/Game.svelte";
  import Home from "./views/Home.svelte";
</script>

<Router>
  <main>
    <Route path="/">
      <Home />
    </Route>

    <Route path="game">
      <Game />
    </Route>
  </main>
</Router>
