function RaceError(message) {
	Error.call(this, message || "Invalid race value!");
	this.name = "RaceError";
	this.message = message || "Invalid race value!";
	if (Error.captureStackTrace) {
		Error.captureStackTrace(this, RaceError);
	} else {
		this.stack = (new Error(message)).stack;
	}
}

RaceError.prototype = Object.create(Error.prototype);
RaceError.prototype.constructor = RaceError;