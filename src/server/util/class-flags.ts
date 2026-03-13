// priority: 1000


class Static {
	protected constructor() {
		throw new IllegalStateException('Cannot instantiate static classes');
	}
}