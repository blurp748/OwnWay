<script>
    import { useNavigate } from "svelte-navigator";

    const navigate = useNavigate();

    let id = localStorage.getItem("userId");
    let msg = id == null ? "Jouer" : "Continuer";

    function goGame(){
      navigate('/game');
    }
    
</script>

<div class="hero min-h-screen bg-stone-800">
    <div class="hero-content text-center text-neutral-content">
      <div class="max-w-md -mt-20">
        <h1 class="mb-5 text-orange-200 text-5xl font-bold py-6">OwnWay</h1>
        <nav>
          <button on:click={goGame} class="bg-orange-200 btn bnt-primary">{ msg }</button>
        </nav>
      </div>
    </div>
  </div>