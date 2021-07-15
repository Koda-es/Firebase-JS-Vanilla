export default class Firebase {

    constructor() {
        this.initializeFirebase();
    }

    initializeFirebase = () => {
        const firebaseConfig = {
            apiKey: '',
            authDomain: '',
            projectId: '',
            storageBucket: '',
            messagingSenderId: '',
            appId: '',
        };
        
        firebase.initializeApp(firebaseConfig);
        
        this.db = firebase.firestore();
    }

    getOne = async ({ collection, document }) => {

        return await this.db.collection(collection).doc(document).get()
            .then((data) => _generateDocumentObject(data))
            .catch((error) => console.error('Error', error));
    }
    
    getAll = async ({ collection }) => {

        return await this.db.collection(collection).get()
            .then((documents) => this._extractDocumentsData(documents))
            .catch((error) => console.error('Error', error));
    }

    store = async ({ collection, data }) => {

        return await this.db.collection(collection).add(data)
            .then((data) => data)
            .catch((error) => console.error('Error', error));
    }

    update = async ({ collection, document, data }) => {

        return await this.db.collection(collection).doc(document).set(data)
            .then((data) => 'success')
            .catch((error) => console.error('Error', error));
    }

    delete = async ({ collection, documentRef }) => {
        return await this.db.collection(collection).doc(documentRef).delete()
            .then((data) => 'success')
            .catch((error) => console.error('Error', error));
    }
    
    // Helpers

    _generateDocumentObject = (document) => {
        return { ...document.data(), documentRef: document.id };
    }

    _extractDocumentsData = (documents) => {
        let documentsArray = [];
    
        documents.forEach(document => documentsArray = [...documentsArray, this._generateDocumentObject(document) ]);
    
        return documentsArray;
    }
}