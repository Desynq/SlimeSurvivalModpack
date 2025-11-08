// priority: 2

class Summonable {

	public constructor(
		public readonly name: string,
		public readonly id: string,
		private readonly nbt: Record<string, any>
	) { }

	public getNode() {
		return $Commands.literal(this.name)
			.executes(context => {
				this.spawn(context.source.level as ServerLevel_, context.source.position);
				return 1;
			})
			// @ts-ignore
			.then($Commands.argument("amount", $IntegerArgumentType.integer())
				.executes(context => {
					// @ts-ignore
					for (let i = 0; i < $IntegerArgumentType.getInteger(context, "amount"); i++) {
						this.spawn(context.source.level as ServerLevel_, context.source.position);
					}
					return 1;
				})
			);
	}

	public spawn(level: ServerLevel_, position: Vec3_, randomizeProperties: boolean = false): Entity_ {
		const rk = $ResourceKey.create($Registries.ENTITY_TYPE, this.id);
		const type = level.registryAccess().registryOrThrow($Registries.ENTITY_TYPE).getHolderOrThrow(rk);
		const source = level.getServer().createCommandSourceStack().withLevel(level);
		const tag: CompoundTag_ = $TagParser.parseTag(JSON.stringify(this.nbt));

		const entity = $SummonCommand.createEntity(source, type as any, position as any, tag, randomizeProperties);
		return entity;
	}
}