import firebase from 'firebase'

export default class Storage {
	constructor(configs) {
		console.log('Initializing storage with configs:', configs);
		if(firebase.apps.length > 0) {
			console.log('Firebase is already initialized');
		} else {
			console.log('Initializing firebase client');
			firebase.initializeApp(configs);
		}
		this.storage = firebase.storage();
	}

	post(data) {
		let fileName = data.name;
		let fileSize = data.size;

		let fileId = firebase.firestore().collection('_none_').doc().id;

		let metadata = {
			customMetadata: {
				originalName: fileName,
			},
		}
	
		console.log('Uploading file', fileName, '!under ID', fileId);
		return this.storage.ref(fileId).put(data, metadata).then(snapshot => {
			console.log('Got snapshot', snapshot);
			return snapshot.ref.getDownloadURL().then((downloadURL) => {
				console.log('Retrieved downloadUrl', downloadURL);
				let uploadData = {
					fileId,
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
