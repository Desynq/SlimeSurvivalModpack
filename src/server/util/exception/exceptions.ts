// priority: 1001

class IllegalStateException extends Error {
	public constructor(message: string) {
		super(message);

		this.name = 'IllegalStateException';

		Object.setPrototypeOf(this, IllegalStateException.prototype);
	}
}