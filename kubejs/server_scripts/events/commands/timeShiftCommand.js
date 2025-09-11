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
	 * @param {CommandSourceStack} source
	 * @param {integer} targetTimeOfDay 
	 */
	function shiftTime(source, targetTimeOfDay) {
		const totalDayTime = source.level.getDayTime();
		const currentTimeOfDay = totalDayTime % TIME_IN_DAY;
		const newDayTime = totalDayTime + (targetTimeOfDay - currentTimeOfDay);

		source.level.setDayTime(newDayTime);
		source.sendSuccess(Text.white(`Shifted the time to ${newDayTime}`), true);
		return 1;
	}
});