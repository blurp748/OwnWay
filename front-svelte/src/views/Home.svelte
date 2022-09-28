<script>
    import { Link } from "svelte-navigator";
    import { userId } from "../store";

    let id;
    userId.subscribe(value => {
      id = value;
    });
    
    let msg = (id == -1) ? "Jouer" : "Continuer";
    
</script>

<div class="hero min-h-screen bg-stone-800">
    <div class="hero-content text-center text-neutral-content">
      <div class="max-w-md -mt-20">
        <h1 class="mb-5 text-orange-200 text-5xl font-bold py-6">OwnWay</h1>
        <nav>
          <Link to="/game">
            <button class="bg-orange-200 btn bnt-primary">{ msg }</button>
          </Link>
        </nav>
      </div>
    </div>
  </div>