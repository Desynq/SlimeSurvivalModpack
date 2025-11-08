/** @type {typeof import("net.minecraft.commands.arguments.TimeArgument").$TimeArgument } */
let $TimeArgument = Java.loadClass("net.minecraft.commands.arguments.TimeArgument")

ServerEvents.commandRegistry(event => {

	const timeNode = event.dispatcher.getRoot().getChild("time");
	if (timeNode == null) {
		return;
	}

	const timeShiftCommand = $Commands.literal("shift")
		.then($Commands.argument("time", $IntegerArgumentType.integer(0, TIME_IN_DAY - 1))
			.executes(context => shiftTime(
				context.source,
				$IntegerArgumentType.getInteger(context, "time")
			))
		);

	timeNode.addChild(timeShiftCommand.build());

	/**
	 * 
	 * @param {CommandSourceStack_} source
	 * @param {integer} targetTimeOfDay 
	 */
	function shiftTime(source, targetTimeOfDay) {
		const newDayTime = TimeHelper.shiftTime(source.server, targetTimeOfDay);
		source.sendSuccess(Text.white(`Shifted the time to ${newDayTime}`), true);
		return 1;
	}
});