// priority: 1000

class FTBTeamsHelper {

	public getTeammateStringUUIDs(player: ServerPlayer_): string[] {
		const api = $FTBTeamsAPI.api();
		if (!api.isManagerLoaded()) return [];

		const maybeTeam = api.getManager().getTeamForPlayer(player);
		if (maybeTeam.isEmpty()) return [];

		const team = maybeTeam.get();
		const stringUUIDs: string[] = [];
		team.getMembers().forEach(uuid => stringUUIDs.push(uuid.toString()));
		return stringUUIDs;
	}
}