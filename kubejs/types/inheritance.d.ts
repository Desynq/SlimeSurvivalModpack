declare module "net.minecraft.world.entity.Entity" {
	interface $Entity extends $AttachmentHolder {
		attackable(...args: any[]): any;
	}
}

declare module "net.minecraft.world.entity.LivingEntity" {
	interface $LivingEntity extends $Entity {
		eat(...args: any[]): any;
		swing(...args: any[]): any;
		moveTo(...args: any[]): any;
		startRiding(...args: any[]): any;
		restoreFrom(...args: any[]): any;
		teleportTo(...args: any[]): any;
		playSound(...args: any[]): any;
		push(...args: any[]): any;
		onSyncedDataUpdated(...args: any[]): any;
		attack(...args: any[]): any;
		rayTraceEntity(...args: any[]): any;
		attackable(...args: any[]): any;
		self(...args: any[]): any;
	}
}

// Patch Player overrides
declare module "net.minecraft.world.entity.player.Player" {
	interface $Player extends $LivingEntity {
		eat(...args: any[]): any;
		swing(...args: any[]): any;
		moveTo(...args: any[]): any;
		startRiding(...args: any[]): any;
		restoreFrom(...args: any[]): any;
		teleportTo(...args: any[]): any;
		playSound(...args: any[]): any;
		push(...args: any[]): any;
		onSyncedDataUpdated(...args: any[]): any;
		attack(...args: any[]): any;
		rayTraceEntity(...args: any[]): any;
		attackable(...args: any[]): any;
		self(...args: any[]): any;
	}
}

// Patch ServerPlayer overrides
declare module "net.minecraft.server.level.ServerPlayer" {
	interface $ServerPlayer extends $Player {
		eat(...args: any[]): any;
		swing(...args: any[]): any;
		moveTo(...args: any[]): any;
		startRiding(...args: any[]): any;
		restoreFrom(...args: any[]): any;
		teleportTo(...args: any[]): any;
		playSound(...args: any[]): any;
		push(...args: any[]): any;
		onSyncedDataUpdated(...args: any[]): any;
		attack(...args: any[]): any;
		rayTraceEntity(...args: any[]): any;
		attackable(...args: any[]): any;
		self(...args: any[]): any;

		drop(...args: any[]): any;
		awardStat(...args: any[]): any;
		notify(...args: any[]): any;
		sendData(...args: any[]): any;
		mouseItem: any;
	}
}

declare module "net.minecraft.world.entity.TamableAnimal" {
	interface $TamableAnimal extends $Animal {
		self(...args: any[]): any;
		lookAt(...args: any[]): any;
	}
};

declare module "net.minecraft.network.chat.MutableComponent" {
	interface $MutableComponent extends $Component$$Type {
		color(...args: any[]): any;
		bold: any;
		italic: any;
		underlined: any;
		strikethrough: any;
		obfuscated: any;
		insertion: any;
		font: any;
		click: any;
		hover: any;
	}
}