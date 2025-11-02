// ignore: true
// @ts-nocheck
/** @type {typeof import("dev.latvian.mods.kubejs.item.FoodEatenKubeEvent").$FoodEatenKubeEvent } */
let $FoodEatenKubeEvent = Java.loadClass("dev.latvian.mods.kubejs.item.FoodEatenKubeEvent")

const BIG_EAT_MODIFIER_ID = $ResourceLocation.parse("slimesurvival:big_eat");

// @ts-nocheck
PlayerEvents.tick(e => {
	let player = e.player
	if (PlayerRaceHelper.getRace(player) != Races.SLUDGE) { return }
	let sat = player.foodData.saturationLevel;
	let value = player.absorptionAmount + sat;
	let playerhp = player.getMaxHealth()
	if ((playerhp * 0.5) < value) { return }
	if (sat > 0) {
		player.setAbsorptionAmount(value)
		player.getAttribute($Attributes.MAX_ABSORPTION)["removeModifier(net.minecraft.resources.ResourceLocation)"](BIG_EAT_MODIFIER_ID)
		player.getAttribute($Attributes.MAX_ABSORPTION).addTransientModifier(new $AttributeModifier(
			BIG_EAT_MODIFIER_ID,
			value,
			$AttributeModifier$Operation.ADD_VALUE
		));
		player.setSaturation(0)
	}
})
