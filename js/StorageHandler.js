export class StorageHandler {
	constructor() {
		return new Proxy(this, this);
	}
	get(target, prop) {
		try {
			return JSON.parse(localStorage.getItem(prop));
		} catch (e) {
			console.warn("Unable to load value from localstorage");
			return null;
		}
	}

	set(target, prop, value) {
		try {
			localStorage.setItem(prop, JSON.stringify(value));
			return true;
		} catch (e) {
			console.warn("Unable to store value to localstorage");
			return false;
		}
	}
}
