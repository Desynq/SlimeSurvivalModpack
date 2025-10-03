


namespace RepairLeather {

	function repair(stack: ItemStack_, repairPercentage: float) {
		if (repairPercentage > 1) throw new Error(`Repair percentage of ${repairPercentage} is > 1 for item: ${stack.id}`);
		const currentDamage = stack.getDamageValue();
		const maxDamage = stack.getMaxDamage();
		const repairAmount = Math.ceil(maxDamage * repairPercentage);
		const newDamage = Math.max(0, currentDamage - repairAmount);
		stack.setDamage(newDamage);
	}

	function createRepairRecipe(id: string, materialId: string, repairPercentage: float) {
		const modifyResultId = id.split(":")[1] + "_repair";

		ServerEvents.recipes(event => {
			// @ts-ignore
			event.recipes.kubejs.shapeless(id, [id, materialId]).modifyResult(modifyResultId);
		});

		ServerEvents.modifyRecipeResult(modifyResultId, event => {
			// @ts-ignore
			const stack = event.grid.find(Ingredient.of(id));
			repair(stack, repairPercentage);
			event.success(stack);
		});
	}

	const VANILLA_COSTS = [5, 8, 7, 4];
	const CHESTPLATE_COST = 8;

	function getRepairFraction(pieceCost: integer, chestplateRepairFraction: float): float {
		return (CHESTPLATE_COST / pieceCost) * chestplateRepairFraction;
	}

	function createArmorRepairRecipe(partId: string, materialId: string, chestplateRepairFraction: float) {
		let pieceCost = [5, 8, 7, 4];
		pieceCost.map(x => Math.trunc(x * (1 - chestplateRepairFraction)));
		const parts = ["_helmet", "_chestplate", "_leggings", "_boots"];
		for (let i = 0; i < parts.length; i++) {
			const scaledPercentage = getRepairFraction(pieceCost[i], chestplateRepairFraction);
			createRepairRecipe(partId + parts[i], materialId, scaledPercentage);
		}
	}

	createArmorRepairRecipe("minecraft:leather", "minecraft:leather", 1 / 4);
	createArmorRepairRecipe("minecraft:iron", "minecraft:iron_ingot", 1 / 8);
	createArmorRepairRecipe("minecraft:diamond", "minecraft:diamond", 1 / 4);
	createArmorRepairRecipe("minecraft:netherite", "minecraft:netherite_scrap", 1 / 3);
}