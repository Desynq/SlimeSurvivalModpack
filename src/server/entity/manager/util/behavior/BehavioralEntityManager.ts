// priority: 99


abstract class BehavioralEntityManager<T extends LivingEntity_>
	extends EntityManager<T>
	implements IBehavioralEntityManager<T> {

	public readonly events = {
		tickAll: new EventBus<(server: MinecraftServer_, bosses: T[]) => void>(),
		killEntity: new EventBus<(boss: T, victim: LivingEntity_, event: LivingEntityDeathKubeEvent_) => void>(),
		playerDeath: new EventBus<(player: ServerPlayer_, event: LivingEntityDeathKubeEvent_) => void>(),
	};

	private readonly behaviors = new $LinkedHashSet<Behavior<this>>();

	protected abstract initBehaviors(): void;

	protected addBehaviors(...behaviors: Behavior<this>[]): void {
		for (const behavior of behaviors) {
			this.behaviors.add(behavior);
		}
	}

	private attachBehaviors(): void {
		this.behaviors.forEach(b => {
			b.attach(this);
		});
	}

	public override register(): this {
		this.initBehaviors();
		this.attachBehaviors();

		return super.register();
	}

	public override tickAll(server: MinecraftServer_, bosses: T[]): void {
		super.tickAll(server, bosses);
		this.events.tickAll.emit(server, bosses);
	}

	public override onKill(boss: T, victim: LivingEntity_, event: LivingEntityDeathKubeEvent_): void {
		super.onKill(boss, victim, event);
		this.events.killEntity.emit(boss, victim, event);
	}

	public override onGlobalPlayerDeath(player: ServerPlayer_, event: LivingEntityDeathKubeEvent_): void {
		super.onGlobalPlayerDeath(player, event);
		this.events.playerDeath.emit(player, event);
	}
}