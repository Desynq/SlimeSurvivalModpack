// priority: 1000

interface RaceSwitchResult {
	success: boolean;
	code: "CANNOT_SWITCH_RACE" | "ALREADY_THIS_RACE" | "SUCCESS";
}

class PlayerRaceHelper {

	/**
	 * @returns The player's current race or the default race if they have no set race
	 */
	public static getRace(player: ServerPlayer_): Race {
		const raceId = player.server.persistentData.getCompound("player_races").getString(player.stringUUID);
		const race = Races.fromId(raceId) ?? Races.defaultRace();
		return race;
	}

	/**
	 * @deprecated
	 */
	public static getRaceWrapper(player: ServerPlayer_) {
		switch (PlayerRaceHelper.getRace(player)) {
			case Races.CHIMERA:
				return new ChimeraPlayer(player);
			case Races.FARLANDER:
				return new FarlanderPlayer(player);
			case Races.DUNESTRIDER:
				return new DunestriderPlayer(player);
			default:
				return null;
		}
	}

	public static setRace(player: ServerPlayer_, race: Race) {
		ServerDataHelper.modifyCompoundTag(player.server, "player_races", (map) => {
			map.putString(player.stringUUID, race.getRaceId());
		});
		new RaceChangeEvent(player, race);
	}

	public static isRace(player: ServerPlayer_, race: Race) {
		return this.getRace(player) === race;
	}

	public static hasRace(player: ServerPlayer_) {
		const race = this.getRace(player);
		return race !== undefined && race !== Races.defaultRace();
	}

	public static canSwitchRaceFrom(player: ServerPlayer_, currentRace: Race): RaceSwitchResult {
		if (currentRace !== Races.defaultRace()) {
			return { success: false, code: "CANNOT_SWITCH_RACE" };
		}
		return { success: true, code: "SUCCESS" };
	}

	public static chooseRace(player: ServerPlayer_, chosenRace: Race, setByOperator: boolean = false): RaceSwitchResult {
		const currentRace = this.getRace(player);
		let canSwitchResult = PlayerRaceHelper.canSwitchRaceFrom(player, currentRace);
		if (!setByOperator && !canSwitchResult.success) {
			return canSwitchResult;
		}

		if (!setByOperator && currentRace === chosenRace) {
			return { success: false, code: "ALREADY_THIS_RACE" };
		}

		this.setRace(player, chosenRace);
		return { success: true, code: "SUCCESS" };
	}
}