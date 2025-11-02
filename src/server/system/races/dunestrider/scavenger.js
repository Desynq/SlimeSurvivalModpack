

const BAD_FOOD_TYPES = [
	'minecraft:rotten_flesh',
	'rottencreatures:magma_rotten_flesh',
	'rottencreatures:frozen_rotten_flesh',
	'minecraft:spider_eye',
	'minecraft:chicken',
	'minecraft:pufferfish'
]

//NativeEvents.onEvent($PlayerEatEffectEvent, event => {
//	let player = event.getEntity();
//	if (!(player instanceof $ServerPlayer)) return;
//	if (!(PlayerRaceHelper.isRace(player, Races.DUNESTRIDER))) return;
//	if (!(SkillHelper.hasSkill(player, DunestriderSkills.SCAVENGER))) return;
//	let item = event.getStack();
//	if (bad_food_types.includes(item.getId())) {
//		event.setCanceled(true);1
//	}


//});



// (function() {
// 	/**
// 	 *
// 	 * @param {string} id
// 	 * @param {integer} duration
// 	 */
// 	function addCooldown(id, duration) {
// 		let item = $BuiltInRegistries.ITEM.get(id)
// 		ItemEvents.foodEaten(id, event => {
// 			let player = event.getEntity();
// 			if (!(player instanceof $ServerPlayer)) return;

// 			player.getCooldowns().addCooldown(item, duration);
// 		});
// 		// stops player from finishing eating animation if the food is on cooldown
// 		ItemEvents.rightClicked(id, event => {
// 			let player = event.getEntity();
// 			if (!(player instanceof $ServerPlayer)) return;

// 			if (!player.getCooldowns().isOnCooldown(item)) return;
// 			event.cancel();
// 		});
// 	}

// 	/** @type {string[]} */
// 	let cooldownedFoods = [
// 		"minecraft:cooked_beef",
// 		"minecraft:cooked_chicken",
// 		"minecraft:cooked_porkchop",
// 		"minecraft:cooked_cod",
// 		"minecraft:cooked_salmon",
// 		"minecraft:cooked_rabbit",
// 		"minecraft:cooked_mutton",
// 	];

// 	cooldownedFoods.forEach(x => addCooldown(x, 200));
// })();

// ItemEvents.rightClicked(event => {
// 	event.cancel();
// })