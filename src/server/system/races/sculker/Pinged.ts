

namespace Sculker.Pinged {

	export function getEcholocationPingDuration(sculker: ServerPlayer_): integer {
		if (SculkerSkills.ECHO_1.isUnlockedFor(sculker)) {
			return 40;
		}

		return 20;
	}
}