// priority: 1000

class AttributeModifierController {

	public constructor(
		private readonly type: string,
		private readonly id: string,
		private readonly value: double,
		private readonly operation: AttributeModifierOperation_
	) { }

	public add(entity: LivingEntity_): void {
		AttributeHelper.addModifier(entity, this.type, this.id, this.value, this.operation);
	}

	public remove(entity: LivingEntity_): void {
		AttributeHelper.removeModifier(entity, this.type, this.id);
	}

	public withValue(value: double): AttributeModifierController {
		return new AttributeModifierController(this.type, this.id, value, this.operation);
	}

	public withOperation(operation: AttributeModifierOperation_): AttributeModifierController {
		return new AttributeModifierController(this.type, this.id, this.value, operation);
	}
}