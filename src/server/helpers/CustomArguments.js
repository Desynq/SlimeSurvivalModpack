const CustomArguments = {};

/**
 * @param {CommandExecutionContext_} context
 * @param {SuggestionsBuilder_} builder
 */
CustomArguments.suggestCachedPlayer = function(context, builder) {
	let server = context.source.server;
	PlayerUUIDUsernameBiMap
		.getUsernames(server)
		.filter(username =>
			PlayerHelper.isOnWhitelist(server, PlayerUUIDUsernameBiMap.getUUID(server, username))
		)
		.forEach(username => builder.suggest(username));
	return builder.buildFuture();
}