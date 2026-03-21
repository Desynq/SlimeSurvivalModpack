// priority: 100


abstract class Behavior<
	M extends object
> {

	protected manager!: M;

	public attach(manager: M): void {
		this.manager = manager;
		this.register();
	}

	protected abstract register(): void;
}

interface IBehavioralEntityManager<T extends LivingEntity_> {
	readonly events: Readonly<{
		tickAll: EventBusSubscriber<(server: MinecraftServer_, bosses: T[]) => void>;
		killEntity: EventBusSubscriber<(boss: T, victim: LivingEntity_, event: LivingEntityDeathKubeEvent_) => void>;
		playerDeath: EventBusSubscriber<(player: ServerPlayer_, event: LivingEntityDeathKubeEvent_) => void>;
	}>;
}

