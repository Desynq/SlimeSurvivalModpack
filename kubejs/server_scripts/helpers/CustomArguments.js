const CustomArguments = {};


CustomArguments.cachedPlayerArgument = $Commands.argument("target", $StringArgumentType.string())
		.suggests((context, builder) => CustomArguments.suggestCachedPlayer(context, builder));


/**
 * @param {$CommandContext_<$CommandSourceStack_>} context
 * @param {$SuggestionsBuilder_} builder
 */
CustomArguments.suggestCachedPlayer = function(context, builder) {
	PlayerUuidUsernameBiMap.getUsernames(context.source.server).forEach(username => builder.suggest(username));
	return builder.buildFuture();
}