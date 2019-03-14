export default class Storage {
	constructor(configs) {
		this.storage = [];
	}

	listen(callback) {
		this.listener = callback;
	}

	post(data) {
		return new Promise((resolve, reject) => {
			let id = 'id' + Object.keys(this.storage).length;
			let newEntry = {
				...data,
				id,
			}
			this.storage[id] = newEntry;

			this._mockDelay().then(() => {
				typeof(this.listener) === 'function' && this.listener(newEntry);
				resolve(id)
			});
		});
	}

	get(id) {
		return new Promise((resolve, reject) => {
			let data = this.storage.find(entry => entry.id === id);

			this._mockDelay().then(() => {
				resolve(data)
			});
		});
	}

	list() {
		return new Promise((resolve, reject) => {
			let data = this.storage;

			this._mockDelay().then(() => {
				resolve(data)
			});
		});
	}

	_mockDelay() {
		const minMsDelay = 200;
		const maxMsDelay = 1000;

		return new Promise((resolve) => {
			let delayMs = minMsDelay + Math.random()*(maxMsDelay - minMsDelay);
			setTimeout(() => resolve(), delayMs);
		});
	}

}
