/** @type {typeof import("net.minecraft.world.entity.TamableAnimal").$TamableAnimal } */
let $TamableAnimal = Java.loadClass("net.minecraft.world.entity.TamableAnimal")
/** @type {typeof import("net.neoforged.neoforge.event.tick.EntityTickEvent$Post").$EntityTickEvent$Post } */
let $EntityTickEvent$Post = Java.loadClass("net.neoforged.neoforge.event.tick.EntityTickEvent$Post")

const LionsShare = {};

LionsShare.MODIFIER_ID = $ResourceLocation.parse("slimesurvival:lions_share");

/**
 * 
 * @param {import("net.neoforged.neoforge.event.tick.EntityTickEvent$Post").$EntityTickEvent$Post$$Original} event 
 */
LionsShare.tamableTick = function(event) {
	const pet = event.entity;
	if (!(pet instanceof $TamableAnimal)) {
		return;
	}

	const owner = pet.getOwner();
	if (!(owner instanceof $ServerPlayer)) {
		return;
	}

	if (!SkillHelper.hasSkill(owner, ChimeraSkills.THE_LIONS_SHARE)) {
		return;
	}

	const wasFullHealth = pet.health >= pet.maxHealth;
	AttributeHelper.removeModifier(pet, $Attributes.MAX_HEALTH, LionsShare.MODIFIER_ID);
	const maxHealthDiff = owner.maxHealth - pet.maxHealth;
	if (maxHealthDiff <= 0) {
		return;
	}

	AttributeHelper.addModifier(pet, $Attributes.MAX_HEALTH, LionsShare.MODIFIER_ID, maxHealthDiff, $AttributeModifier$Operation.ADD_VALUE);
	if (wasFullHealth) {
		pet.setHealth(pet.maxHealth);
	}
}





NativeEvents.onEvent($EntityTickEvent$Post, event => LionsShare.tamableTick(event));