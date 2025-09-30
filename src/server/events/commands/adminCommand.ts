

namespace AdminCommand {

	function giveVoidCore(player: ServerPlayer_) {
		const comps = `item_name='{"color":"dark_purple","text":"The Void Core"}'`
			+ `,curios:attribute_modifiers=[`
			+ `{type:"minecraft:generic.gravity",amount:-0.75,operation:"add_multiplied_total",id:"slimesurvival:void_core",slot:"necklace"}`
			+ `,{type:"minecraft:generic.fall_damage_multiplier",amount:-1,operation:"add_multiplied_total",id:"slimesurvival:void_core",slot:"necklace"}`
			+ `,{type:"minecraft:generic.movement_speed",amount:0.5,operation:"add_multiplied_total",id:"slimesurvival:void_core",slot:"necklace"}`
			+ `]`
			+ `,max_stack_size=1`;

		CommandHelper.runCommandSilent(player.server,
			`give ${player.username} cataclysm:void_eye[${comps}]`
		);
	}

	function giveCursedHand(player: ServerPlayer_) {
		const comps = `item_name='{"color":"dark_aqua","text":"Cursed Hand"}'`
			+ `,custom_data={id:cursed_hand}`
			+ ``;
		CommandHelper.runCommandSilent(player.server,
			`give ${player.username} mutantmonsters:endersoul_hand[${comps}]`
		);
	}

	function giveCursedAthame(player: ServerPlayer_) {
		const comps = `item_name='{"color":"dark_aqua","text":"Cursed Athame"}'`
			+ `,custom_data={id:cursed_athame}`
			+ `,attribute_modifiers=[`
			+ `{type:"minecraft:generic.attack_damage",amount:5,operation:"add_value",id:"slimesurvival:cursed_athame",slot:"mainhand"}`
			+ `,{type:"minecraft:generic.attack_speed",amount:2147483647,operation:"add_value",id:"slimesurvival:cursed_athame",slot:"mainhand"}`
			+ `]`;
		CommandHelper.runCommandSilent(player.server,
			`give ${player.username} cataclysm:athame[${comps}]`
		);
	}

	function giveVoidHand(player: ServerPlayer_) {
		const attributeModifiers = JSON.stringify({
			modifiers: [
				{
					id: "slimesurvival:void_hand",
					type: "minecraft:generic.max_health",
					amount: 0.25,
					operation: "add_multiplied_total",
					slot: "offhand"
				}
			]
		});
		CommandHelper.runCommandSilent(player.server,
			`give ${player.username} mutantmonsters:endersoul_hand[item_name='{"color":"dark_purple","text":"Void Hand"}',custom_data={id:void_hand},attribute_modifiers=${attributeModifiers}]`
		);
	}

	/**
	 * 
	 * @param {ServerPlayer_} player 
	 * @param {import("net.minecraft.world.item.Item").$Item$$Original} item 
	 * @param {import("net.minecraft.core.component.DataComponentPatch").$DataComponentPatch$$Original} components
	 */
	function giveItem(player, item, components) {
		const stack = new $ItemStack(item);
		stack.applyComponentsAndValidate(components);
		// @ts-ignore
		const inventoryFull = !player.getInventory().add(stack);
		if (inventoryFull && stack.isEmpty()) {
			/** @type {import("net.minecraft.world.entity.item.ItemEntity").$ItemEntity$$Original} */
			const itemEntity = player.drop(stack, false);
			if (itemEntity != null) {
				itemEntity.makeFakeItem();
			}

			player.containerMenu.broadcastChanges();
		}
		else {
			const itemEntity = player.drop(stack, false);
		}
	}


	/**
	 * 
	 * @param {import("net.minecraft.server.level.ServerLevel").$ServerLevel$$Original} level 
	 * @param {import("net.minecraft.world.phys.Vec3").$Vec3$$Original} position 
	 */
	function summonVoidman(level, position) {
		const dimension = level.dimension.toString();
		const x = position.x();
		const y = position.y();
		const z = position.z();
		const nbt = {
			Tags: ["boss", "boss.voidman"],
			PersistenceRequired: true,
			AngerTime: 2147483647,
			Health: 1000,
			attributes: [
				{
					id: "minecraft:generic.max_health",
					base: 1000
				},
				{
					id: "minecraft:generic.attack_damage",
					base: 10
				}
			],
			CustomName: '{"color":"dark_purple","text":"The Voidman"}'
		};
		CommandHelper.runCommandSilent(level.server, `execute in ${dimension} run summon mutantmonsters:mutant_enderman ${x} ${y} ${z} ${JSON.stringify(nbt)}`, true);
	}

	ServerEvents.commandRegistry(event => {
		const nodes = {};

		nodes["/admin"] = $Commands.literal("admin");

		nodes["/admin summon"] = $Commands.literal("summon")
			// @ts-ignore
			.then($Commands.literal("voidman")
				.executes(context => {
					summonVoidman(context.source.level, context.source.position);
					return 1;
				})
			);

		SummonableRegistry.forEach(s => {
			nodes["/admin summon"].then(s.getNode());
		});

		nodes["/admin give"] = $Commands.literal("give")
			// @ts-ignore
			.then($Commands.literal("void_core")
				.executes(context => {
					giveVoidCore(context.getSource().getPlayer());
					return 1;
				})
			)
			// @ts-ignore
			.then($Commands.literal("cursed_hand")
				.executes(context => {
					giveCursedHand(context.getSource().getPlayer());
					return 1;
				})
			)
			// @ts-ignore
			.then($Commands.literal("cursed_athame")
				.executes(context => {
					giveCursedAthame(context.getSource().getPlayer());
					return 1;
				})
			)
			// @ts-ignore
			.then($Commands.literal("void_hand")
				.executes(context => {
					giveVoidHand(context.getSource().getPlayer());
					return 1;
				})
			);

		nodes["/admin"]
			// @ts-ignore
			.then(nodes["/admin summon"])
			// @ts-ignore
			.then(nodes["/admin give"]);

		// @ts-ignore
		event.register(nodes["/admin"]);
	});
}