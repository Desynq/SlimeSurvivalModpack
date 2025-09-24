


namespace RepairLeather {


	function repair(stack: ItemStack_, materialCost: integer) {
		const currentDamage = stack.getDamageValue();
		const maxDamage = stack.getMaxDamage();
		const newDamage = Math.max(0, Math.floor(currentDamage - maxDamage / materialCost));
		stack.setDamage(newDamage);
	}

	function createRepairRecipe(id: string, materialId: string, materialCost: integer) {
		// ServerEvents.recipes(event => {
		// 	// @ts-ignore
		// 	event.shapeless(id, [id, ingredientId]);
		// });
		// ItemEvents.crafted(id, event => {
		// 	const resultStack = event.getItem();
		// 	const ingredients = event.getInventory().getAllItems();
		// 	ingredients.forEach(ingredientStack => {
		// 		if (ingredientStack.id !== id) return;

		// 		ItemHelper.cloneComponents(ingredientStack, resultStack);
		// 		repair(resultStack, ingredientCost);
		// 	});
		// });
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

	createRepairRecipe("minecraft:leather_helmet", "minecraft:leather", 5);
	createRepairRecipe("minecraft:leather_chestplate", "minecraft:leather", 8);
	createRepairRecipe("minecraft:leather_leggings", "minecraft:leather", 7);
	createRepairRecipe("minecraft:leather_boots", "minecraft:leather", 4);
}