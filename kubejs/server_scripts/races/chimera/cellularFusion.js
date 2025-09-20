/** @type {typeof import("net.neoforged.neoforge.event.entity.living.MobEffectEvent$Added").$MobEffectEvent$Added } */
let $MobEffectEvent$Added = Java.loadClass("net.neoforged.neoforge.event.entity.living.MobEffectEvent$Added")
NativeEvents.onEvent($MobEffectEvent$Added, event => {
	let entity = event.getEntity();
	if (!(entity instanceof $ServerPlayer)) return;
	if (!PlayerRaceHelper.isRace(entity, Races.CHIMERA)) return;
	// if (!SkillHelper.hasSkill(entity, ChimeraSkills.CELLULAR_FUSION)) return;


	let effect = event.getEffectInstance();
	let pets = PlayerHelper.getPetsFollowing(entity);
	if (pets.length == 0) return;
	pets.forEach(pet => {
		let effectCopy = new $MobEffectInstance(effect);
		pet.addEffect(effectCopy);
	})
});