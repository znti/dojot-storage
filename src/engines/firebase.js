import firebase from 'firebase'

const DEBUG = (...messages) => {
	console.log('[STORAGE]', ...messages);
}

export default class Storage {
	constructor(configs) {
		DEBUG('Initializing storage with configs:', configs);
		if(firebase.apps.length > 0) {
			DEBUG('Firebase is already initialized');
		} else {
			DEBUG('Initializing firebase client');
			firebase.initializeApp(configs);
		}
		this.storage = firebase.storage();
	}

	post(data) {
		DEBUG('Posting data', data)

		let fileName = data.name;
		let fileSize = data.size;

		let fileId = firebase.firestore().collection('_none_').doc().id;

		let metadata = {
			customMetadata: {
				originalName: fileName,
			},
		}
	
		DEBUG('Uploading file', fileName, 'into ID', fileId);
		return this.storage.ref(fileId).put(data, metadata).then(snapshot => {
			DEBUG('Got snapshot', snapshot);
			return snapshot.ref.getDownloadURL().then((downloadURL) => {
				DEBUG('Retrieved downloadUrl', downloadURL);
				let uploadData = {
					id: fileId,
					name: fileName,
					downloadURL,
				}
				return Promise.resolve(uploadData);
			})
		});
	}

	get(id) {
		let fileRef = this.storage.ref(id);
		return fileRef.getMetadata().then(metadata => {
			return fileRef.getDownloadURL().then(downloadURL => {
				let fileData = {
					id,
					name: metadata.customMetadata.originalName,
					downloadURL,
				};
				return Promise.resolve(fileData);
			});
		});
	}

}
