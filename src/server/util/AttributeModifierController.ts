// priority: 1000

class AttributeModifierController {

	public constructor(
		private readonly type: string,
		private readonly id: string,
		private readonly value: double,
		private readonly operation: AttributeModifierOperation_
	) { }

	public get(entity: LivingEntity_): number {
		return AttributeHelper.getModifierValue(entity, this.type, this.id);
	}

	public has(entity: LivingEntity_): boolean {
		return AttributeHelper.hasModifier(entity, this.type, this.id);
	}

	/**
	 * Applies this attribute modifier to the entity.
	 * 
	 * If a modifier with the same `type` and `id` already exists, its `value` and `operation` are replaced.
	 */
	public add(entity: LivingEntity_): void {
		AttributeHelper.addModifier(entity, this.type, this.id, this.value, this.operation);
	}

	public remove(entity: LivingEntity_): void {
		AttributeHelper.removeModifier(entity, this.type, this.id);
	}

	public withValue(value: double, operation?: AttributeModifierOperation_): AttributeModifierController {
		const op = operation ?? this.operation;
		return new AttributeModifierController(this.type, this.id, value, op);
	}

	public withOperation(operation: AttributeModifierOperation_): AttributeModifierController {
		return this.withValue(this.value, operation);
	}

	public apply(entity: LivingEntity_, valueOverride?: number): void {
		const value = valueOverride ?? this.value;
		AttributeHelper.addModifier(entity, this.type, this.id, value, this.operation);
	}
}