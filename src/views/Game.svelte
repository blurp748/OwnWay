<script>

  import Range from "../components/Range.svelte";
  import { onMount } from 'svelte';

  /*------------------------*/
  /*------ CONSTANTES ------*/
  /*------------------------*/

  let pnj = {
    pnjName: "Ifrit",
    description: "Hey ! you're finally awake ?",
    pngImg: "pnj.png",
    bgImg: "forest.jpg",
    choix : ["choix 1","choix 2","choix 3"],
  }

  onMount(async () => {
      console.log(import.meta.env.VITE_API_URL);
      // const response = await fetch(import.meta.env.API_URL);
      // let pnjResponse = await response.json();
      // pnj.pnjName = pnjResponse.pnjName;
      // pnj.description = pnjResponse.description;
      // pnj.pngImg = pnjResponse.pngImg;
      // pnj.bgImg = pnjResponse.bgImg;
      // pnj.choix = pnjResponse.choix;
    });

  let nourriture = 100;
  let vie = 100;
  let argent = 100;  
  $: styleNourriture = `--value: ${nourriture}; --thickness: 2px`;
  $: styleVie = `--value: ${vie}; --thickness: 2px`;
  $: styleArgent = `--value: ${argent}; --thickness: 2px`;

  let srcPnj = "src/assets/" + pnj.pngImg;
  let srcBackground = "src/assets/" + pnj.bgImg;
  $: bgImageBackground = `background-image: url("${srcBackground}");`;
  $: bgImagePnj = `background-image: url("${srcPnj}");`;

</script>

<div class="grid grid-cols-none min-h-screen">

    <!-- Stats -->
    <div class="bg-stone-800 grid grid-rows-2 items-end">

      <div class="grid grid-cols-3 justify-center w-screen">
        <div class="flex justify-center">
          {#if nourriture >= 70}
            <div class="radial-progress text-center text-xs text-green-500" style="{styleNourriture}">Nourriture</div>
          {:else if nourriture > 30}
            <div class="radial-progress text-center text-xs text-orange-500" style="{styleNourriture}">Nourriture</div>
          {:else}
            <div class="radial-progress text-center text-xs text-red-500" style="{styleNourriture}">Nourriture</div>
          {/if}
        </div>
        <div class="flex justify-center">
          {#if vie >= 70}
            <div class="radial-progress text-center text-xs text-green-500" style="{styleVie}">Vie</div>
          {:else if vie > 30}
            <div class="radial-progress text-center text-xs text-orange-500" style="{styleVie}">Vie</div>
          {:else}
            <div class="radial-progress text-center text-xs text-red-500" style="{styleVie}">Vie</div>
          {/if}
        </div>
        <div class="flex justify-center">
          {#if argent >= 70}
            <div class="radial-progress text-center text-xs text-green-500" style="{styleArgent}">Argent</div>
          {:else if argent > 30}
            <div class="radial-progress text-center text-xs text-orange-500" style="{styleArgent}">Argent</div>
          {:else}
            <div class="radial-progress text-center text-xs text-red-500" style="{styleArgent}">Argent</div>
          {/if}
        </div>
      </div>

      <Range/>

    </div>

    <!-- Card -->
    <div class="bg-orange-200 row-span-5 flex items-center justify-center" >
      <div class="bg-cover w-11/12 h-5/6" style={bgImageBackground}>
        <div class="bg-cover bg-no-repeat w-full h-full flex justify-center items-end" style={bgImagePnj}>
          <div class="card bg-stone-700 w-11/12 bg-opacity-80 -mb-6">
            <div class="card-body">
              <h2 class="card-title text-white">{pnj.pnjName}</h2>
              <p class="text-white">{pnj.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Choices -->
    <div class="bg-stone-800 flex items-center justify-center">
      <div class="w-full h-full grid grid-cols-1 content-center gap-5">
        {#each pnj.choix as choice}
          <div class="btn text-black bg-orange-200 border-t-black text-center">
            {choice}
          </div>
        {/each}
      </div>
    </div>

</div>