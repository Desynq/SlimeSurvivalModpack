// priority: 1000

type OnLoadListener = (server: MinecraftServer_) => void;

class OnLoadManager {

	public static INSTANCE = new OnLoadManager();

	private readonly playerKeyStates: Record<string, Record<string, boolean | undefined> | undefined> = {};

	private readonly onLoadListeners: OnLoadListener[] = [];

	private constructor() { }

	public onLoad(server: MinecraftServer_) {
		this.postOnLoad(server);
	}

	public addListener(listener: OnLoadListener): void {
		this.getOnLoadListeners().push(listener);
	}



	private getOnLoadListeners(): OnLoadListener[] {
		return this.onLoadListeners;
	}

	private postOnLoad(server: MinecraftServer_): void {
		for (const listener of this.getOnLoadListeners().slice()) {
			listener(server);
		}
	}
}