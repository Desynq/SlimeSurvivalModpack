// priority: 1

namespace FuranturSkill {

	export function onAttack(player: ServerPlayer_, victim: LivingEntity_, damage: float): void {
		if (!PlayerHelper.canHeal(player)) return;
		if (!isLifestealable(victim)) return;

		let furanturTier = SkillHelper.getSkillTier(player,
			DunestriderSkills.FURANTUR_1,
			DunestriderSkills.FURANTUR_2,
			DunestriderSkills.FURANTUR_3,
			DunestriderSkills.FURANTUR_4,
			DunestriderSkills.FURANTUR_5
		);
		if (furanturTier === 0) return;

		const stealPercent = getLifestealPercentage(furanturTier, damage);
		let healAmount = damage * stealPercent;

		const healthToAdd = Math.min(healAmount, player.maxHealth - player.health);
		player.setHealth(player.health + healthToAdd);
		healAmount -= healthToAdd;

		BloodclotSkill.applyOverheal(player, healAmount);
	}

	export function onEntityDeath(player: ServerPlayer_, victim: LivingEntity_): void {
		if (DunestriderSkills.FURANTUR_5.isLockedFor(player)) return;

		let victimMaxHealth = victim.getMaxHealth();
		let heal = victimMaxHealth * 0.20;
		player.setHealth(player.getHealth() + heal);
	}

	function isLifestealable(victim: LivingEntity_) {
		if (EntityHelper.isType(victim, "dummmmmmy:target_dummy") && victim.tickCount > 40) return false;
		return true;
	}

	function getLifestealPercentage(furanturTier: integer, damage: float): number {
		let stealPercent = 0;
		switch (furanturTier) {
			case 1:
				stealPercent = 0.025;
				break;
			case 2:
				stealPercent = 0.050;
				break;
			case 3:
				stealPercent = 0.075;
				break;
			case 4:
				stealPercent = 0.100;
				break;
			case 5:
				stealPercent = 0.150;
				break;
		}
		return stealPercent;
	}
}