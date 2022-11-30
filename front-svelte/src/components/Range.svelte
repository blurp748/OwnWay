<script>
	export let neutrality;
</script>

<div class="grid items-end">
    <div>
        <input type="range" name="price" min="0" max="100" value={neutrality} class="w-screen h-2 bg-gradient-to-r from-red-600 to-blue-600 appearance-none" disabled />
      </div>
    <div class="flex justify-between">
        <p class="ml-2 text-white">Méchanceté</p>
        <p class="mr-2 text-white">Gentillesse</p>
    </div>
</div>