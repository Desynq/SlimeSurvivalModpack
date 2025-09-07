
class Race {
	private readonly _raceId: string;
	private readonly _isDefault: boolean;

	constructor(raceId: string, isDefault?: boolean) {
		this._raceId = raceId;
		this._isDefault = isDefault ?? false;
	}

	public getRaceId() {
		return this._raceId;
	}

	public isDefault() {
		return this._isDefault;
	}
}