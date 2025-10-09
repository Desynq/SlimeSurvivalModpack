
namespace SludgeEvents {

	NativeEvents.onEvent($LivingEntityUseItemEvent$Start, event => {
		Phagocytosis.onUseItemStart(event);
	});
}