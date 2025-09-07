
ServerEvents.commandRegistry(event => {
	const { commands: Commands, arguments: Arguments } = event;









	function getRaceArgument() {
		return Commands.argument("race", Arguments.STRING.create(event))
			.suggests((context, builder) => {

			});
	}
});

const RaceCommand = {};

/**
 * 
 * @param {import("net.minecraft.server.level.ServerPlayer").$ServerPlayer$$Original} player 
 */
RaceCommand.canChangeRace = function(player) {
	
}