<script>

  import Range from "../components/Range.svelte";
  import DataService from '../services/DataService';
  import { useNavigate } from "svelte-navigator";
  import { DrumstickIcon, HeartIcon, DollarIcon } from 'svelte-uicons';
  import { userId } from "../store";

  /*------------------------*/
  /*------ CONSTANTES ------*/
  /*------------------------*/

  const navigate = useNavigate();

  let card = {};
  let isWin = true;
  card.choices = []; // in order to disable #each error on template 
  card.bgImage = ``;
  card.pnjImage = ``;

  let player = {};
  let id;

  userId.subscribe(value => {
    id = value;
  });

  if(id != -1){
    DataService.postConnection(id).then((response) =>{
      card = response.data.card;
      player = response.data.player;
    });
  }else{
    DataService.getConnection().then((response) =>{
      userId.subscribe(value => {
        localStorage.setItem("userId",response.data.player.player_id);
        id = response.data.player.player_id;
      });
      card = response.data.card
    });

    player = {
      nourriture: 100,
      vie: 100,
      argent: 100,
      neutrality: 50,
      step: 0
    };
  }
 
  $: styleNourriture = `--value: ${player.nourriture}; --thickness: 2px`;
  $: styleVie = `--value: ${player.vie}; --thickness: 2px`;
  $: styleArgent = `--value: ${player.argent}; --thickness: 2px`;
  $: bgImageBackground = `background-image: url("src/assets/background/${card.bgImage}.png");`;
  $: bgImagePnj = `background-image: url("src/assets/pnj/${card.pnjImage}.png");`;

  /*------------------------*/
  /*------- FONCTIONS ------*/
  /*------------------------*/

  function checkPlayerStat(){
  
    if(player.nourriture > 100){
      player.nourriture = 100;
    }else if(player.nourriture <= 0){
      isWin = false;
      endGame()
    }

    if(player.vie > 100){
      player.vie = 100;
    }else if(player.vie <= 0){
      isWin = false;
      endGame()
    }

    if(player.argent > 100){
      player.argent = 100;
    }else if(player.argent <= 0){
      isWin = false;
      endGame()
    }

    if(player.neutrality > 100) player.neutrality = 100;
    if(player.neutrality < 0) player.neutrality = 0;

  }

  function endGame(){

      DataService.deletePlayer(id).then((response) =>{
          localStorage.setItem("userId","-1");
          let modal = document.getElementById("modal");
          // @ts-ignore
          modal.checked = true;
      });
  }

  function goHome() {
    navigate('/');
  }

  function next(choice,nb){
    
    player.nourriture += choice.nourriture;
    player.vie += choice.vie;
    player.argent += choice.argent;
    player.neutrality += choice.neutrality;
    player.step += 1;

    checkPlayerStat();

    DataService.postNext(player,nb,id).then((response) =>{
        console.log(response);
        if(response.data.finish){
          endGame();
        }else{
          card = response.data.card;
        }
    });
  }

</script>

<div class="grid grid-cols-none min-h-screen">

    <!-- Stats -->
    <div class="bg-stone-800 grid">

      <div class="grid grid-cols-3 items-end w-screen">
        <div class="flex justify-center">
          {#if player.nourriture >= 70}
            <div class="radial-progress text-center text-xs text-orange-200" style="{styleNourriture}"><DrumstickIcon size="32"/></div>
          {:else if player.nourriture > 30}
            <div class="radial-progress text-center text-xs text-orange-500" style="{styleNourriture}"><DrumstickIcon size="32"/></div>
          {:else}
            <div class="radial-progress text-center text-xs text-red-500" style="{styleNourriture}"><DrumstickIcon size="32"/></div>
          {/if}
        </div>
        <div class="flex justify-center">
          {#if player.vie >= 70}
            <div class="radial-progress text-center text-xs text-orange-200" style="{styleVie}"><HeartIcon size="32"/></div>
          {:else if player.vie > 30}
            <div class="radial-progress text-center text-xs text-orange-500" style="{styleVie}"><HeartIcon size="32"/></div>
          {:else}
            <div class="radial-progress text-center text-xs text-red-500" style="{styleVie}"><HeartIcon size="32"/></div>
          {/if}
        </div>
        <div class="flex justify-center">
          {#if player.argent >= 70}
            <div class="radial-progress text-center text-xs text-orange-200" style="{styleArgent}"><DollarIcon size="32"/></div>
          {:else if player.argent > 30}
            <div class="radial-progress text-center text-xs text-orange-500" style="{styleArgent}"><DollarIcon size="32"/></div>
          {:else}
            <div class="radial-progress text-center text-xs text-red-500" style="{styleArgent}"><DollarIcon size="32"/></div>
          {/if}
        </div>
      </div>

      <Range neutrality={player.neutrality}/>

    </div>

    <!-- Put this part before </body> tag -->
    <input type="checkbox" id="modal" class="modal-toggle" />
    <div class="modal">
      <div class="modal-box bg-orange-200 ">
        {#if isWin}
          <h3 class="font-bold text-lg animate-[wiggle_1s_ease-in-out_infinite]">Tu as gagné !</h3>
        {:else}
          <h3 class="font-bold text-lg">Tu as perdu !</h3>
        {/if}
        <div class="modal-action">
          <label for="modal" class="btn" on:click={goHome}>Retourner à l'accueil</label>
        </div>
      </div>
    </div>

    <!-- Card -->
    <div class="bg-orange-200 row-span-5 flex items-center justify-center" >
      <div class="bg-cover w-11/12 h-5/6" style={bgImageBackground}>
        <div class="bg-contain bg-no-repeat w-full h-full flex justify-center items-end bg-center" style={bgImagePnj}>
          <div class="card bg-stone-700 w-11/12 bg-opacity-80 -mb-6">
            <div class="card-body">
              <h2 class="card-title text-white">{card.pnjName}</h2>
              <p class="text-white">{card.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Choices -->
    <div class="bg-stone-800 flex items-center justify-center">
      <div class="w-full h-full grid grid-cols-1 content-center gap-5">
        {#each card.choices as choice,i}
          <div on:click={() => next(choice,i)} class="btn text-black bg-orange-200 border-t-black text-center">
            {choice.description}
          </div>
        {/each}
      </div>
    </div>

</div>