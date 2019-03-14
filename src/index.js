import Mock from './engines/mock';
import Firebase from './engines/firebase';

export default class Storage {

	post(data) {
		return this.storage.post(data);
	}

	get(id) {
		return this.storage.get(id);
	}

	list() {
		return this.storage.list();
	}

	constructor(configs) {

		console.log('Initializing storage with configs:', configs);

		let storageEngineName = configs && configs.engine;
		let storageEngine;

		switch(storageEngineName) {
			case 'firebase':
				console.log('Initializing with firebase');
				storageEngine = new Firebase(configs.configs);
				break;

			default:
				console.log('Initializing with mockstorage');
				storageEngine = new Mock();
				break;
		}

		this.storage = storageEngine;
		console.log('Loaded engine:', this.storage);

	}
}
