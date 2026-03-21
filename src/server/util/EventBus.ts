// priority: 1000

interface EventBusSubscriber<T extends (...args: any[]) => void = () => void> {
	add(listener: T): void;
}

class EventBus<
	T extends (...args: any[]) => void = () => void
> implements EventBusSubscriber {
	private readonly listeners = new $LinkedHashSet<T>();

	public add(listener: T): void {
		this.listeners.add(listener);
	}

	public remove(listener: T): void {
		this.listeners.remove(listener);
	}

	public clear(): void {
		this.listeners.clear();
	}

	public emit(...args: Parameters<T>): void {
		this.listeners.forEach(l => {
			l(...args);
		});
	}
}