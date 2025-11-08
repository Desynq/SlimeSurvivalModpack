

namespace MystStageOneEvents {

	const arenaAABB = $AABB.ofSize([-116, 20, 17], 24, 24, 24);

	ServerEvents.tick(event => {
		const server = event.server;
		const level = MystHelper.getLevel(server);
	});

	function pigstep(level: ServerLevel_): void {

	}
}