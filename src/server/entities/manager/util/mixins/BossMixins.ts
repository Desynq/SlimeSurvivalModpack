// priority: 10

namespace EntityTraits {
	type EM = AbstractConstructor<EntityManager<any>>;

	export function CannotMount<TBase extends EM>(Base: TBase) {
		abstract class Mixin extends Base {
			public override onEntityMount(boss: LivingEntity_, event: EntityMountEvent_) {
				super.onEntityMount(boss, event);
				event.setCanceled(true);
			}
		};
		return Mixin;
	}
}