<script>
    import { Link } from "svelte-navigator";

    const src = "src/assets/frame_open.png";

    $: bgImage = `background-image: url("${src}");`;
</script>

<div class="hero min-h-screen bg-cover bg-no-repeat bg-center" style="{bgImage}">
    <div class="hero-content text-center text-neutral-content">
      <div class="max-w-md -mt-20">
        <h1 class="mb-5 text-5xl font-bold py-6">OwnWay</h1>
        <nav>
          <Link to="/game">
            <button class="btn bnt-primary">Play</button>
          </Link>
        </nav>
      </div>
    </div>
  </div>