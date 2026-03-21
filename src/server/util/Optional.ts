// priority: 1000


$Optional;

function unwrapOptional<T>(opt: Optional_<T>): T | null {
	return opt.present
		? opt.get()
		: null;
}