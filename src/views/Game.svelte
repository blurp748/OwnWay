<script>

import Range from "../components/Range.svelte";

  /*------------------------*/
  /*------ CONSTANTES ------*/
  /*------------------------*/

  const nourriture = 100;
  const vie = 30;
  const argent = 50;
  const src = "src/assets/pnj.jpg";

  $: styleNourriture = `--value: ${nourriture}; --thickness: 2px`;
  $: styleVie = `--value: ${vie}; --thickness: 2px`;
  $: styleArgent = `--value: ${argent}; --thickness: 2px`;
  $: bgImage = `background-image: url("${src}");`;
</script>

<div class="grid grid-cols-none min-h-screen">

    <div class="bg-slate-200 grid grid-rows-2 items-end">

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

    <div class="row-span-5 bg-cover flex justify-center items-end" style={bgImage}>
      <div class="card glass w-11/12 h-1/5 mb-2">
        <div class="card-body text-center">
          <p>Hey ! you're finally awake ?</p>
        </div>
      </div>
    </div>

    <div class="row-span-3">03</div>
</div>