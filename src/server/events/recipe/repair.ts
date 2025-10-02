


namespace RepairLeather {

	function repair(stack: ItemStack_, materialCost: integer) {
		const currentDamage = stack.getDamageValue();
		const maxDamage = stack.getMaxDamage();
		const newDamage = Math.max(0, Math.floor(currentDamage - maxDamage / materialCost));
		stack.setDamage(newDamage);
	}

	function createRepairRecipe(id: string, materialId: string, materialCost: integer) {
		const modifyResultId = id.split(":")[1] + "_repair";

		ServerEvents.recipes(event => {
			// @ts-ignore
			event.recipes.kubejs.shapeless(id, [id, materialId]).modifyResult(modifyResultId);
		});

		ServerEvents.modifyRecipeResult(modifyResultId, event => {
			// @ts-ignore
			const stack = event.grid.find(Ingredient.of(id));
			repair(stack, materialCost);
			event.success(stack);
		});
	}

	function createArmorRepairRecipe(partId: string, materialId: string, materialCost: [integer, integer, integer, integer]) {
		const parts = ["_helmet", "_chestplate", "_leggings", "_boots"];
		for (let i = 0; i < parts.length; i++) {
			createRepairRecipe(partId + parts[i], materialId, materialCost[i]);
		}
	}

	createArmorRepairRecipe("minecraft:leather", "minecraft:leather", [3, 6, 6, 3]);
	createArmorRepairRecipe("minecraft:netherite", "minecraft:netherite_scrap", [2, 4, 4, 2]);
}