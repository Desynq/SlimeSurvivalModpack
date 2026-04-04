


EntityEventsExt.onTick(({ entity, server }) => {
	if (!entity.monster) return;

	CommandHelper.runCommandSilent(server,
		`execute as ${entity.username} if entity @s[team=] run team join monsters @s`
	);
});