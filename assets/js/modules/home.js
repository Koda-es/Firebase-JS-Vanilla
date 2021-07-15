export default class Home {

    constructor(firebase, html) {
        this.firebase = firebase;
        this.html = html;

        this._getDocuments();

        this._loadDom();
    }

    _loadDom = () => {
        this._querySelectors();

        this._addEventListeners();
    }

    _querySelectors = () => {

        this.containerDiv = document.querySelector(".container");

        this.documentsRow = this.containerDiv.querySelector("#documentsRow");
        this.newDocumentForm = this.containerDiv.querySelector("#newDocumentForm");
        this.newDocumentButton = this.newDocumentForm.querySelector("#newDocumentButton");

        this.titleInput = this.newDocumentForm.querySelector('input[name="title"]');
        this.descriptionInput = this.newDocumentForm.querySelector('textarea[name="description"]');
        this.refInput = this.newDocumentForm.querySelector('input[name="ref"]');

        this.deleteButtons = this.documentsRow.querySelectorAll('button.delete-button');
        this.updateButtons = this.documentsRow.querySelectorAll('button.update-button');
    }


    _storeOrUpdate = async (event) => {
        event.preventDefault();

            this.newDocumentButton.disabled = true;

            await (!this.refInput.value) 
                ? this._storeNewDocument()
                : this._updateDocument()

            this.newDocumentButton.disabled = false;
    }


    _addEventListeners() {
        this.newDocumentForm.addEventListener('submit', this._storeOrUpdate);

        this.deleteButtons.forEach(deleteButton => 
            deleteButton.addEventListener('click', (_) => this._deleteDocument(deleteButton.dataset.ref))
        );

        this.updateButtons.forEach(updateButton => 
            updateButton.addEventListener('click', (_) => this._setDocumentToUpdate(updateButton.dataset.ref))
        );
    }

    _addNewDocumentCard = ({ documentRef, title, description }, position) => {

        const titleHtml = this.html.generateSubTitle(title);
        const descriptionHtml = this.html.generateText(description);

        const contentDiv = this.html.generateDiv({
            'content': titleHtml + descriptionHtml,
            'className': 'card-content'
        });

        const deleteButton = this.html.generateButton({
            'content': 'Delete',
            'className': 'inline-block delete-button',
            'dataSet': 'data-ref',
            'dataSetValue': documentRef
        });

        const updateButton = this.html.generateButton({
            'content': 'Update',
            'className': 'inline-block update-button',
            'dataSet': 'data-ref',
            'dataSetValue': documentRef
        });

        const actionButtonsDiv = this.html.generateDiv({
            'content': deleteButton + updateButton
        });
        
        const newDocumentCardHtml = this.html.generateDiv({
            'content' : contentDiv + actionButtonsDiv, 
            'className': 'card card-row',
            'id': `document-${documentRef}`
        });
    
        this.documentsRow.insertAdjacentHTML(position, newDocumentCardHtml);
    }

    _getDocuments = async () => {
        const documents = await this.firebase.getAll(
            { 'collection': 'documents' }
        );

        documents.forEach((document) => this._addNewDocumentCard(document, 'beforeend'));

        this._loadDom();
    };

    _resetForm = () => {
        this.titleInput.value = '';
        this.descriptionInput.value = '';
        this.refInput.value = '';
    }

    _generateDataObject = () => {
        const titleValue = this.titleInput.value;
        const descriptionValue = this.descriptionInput.value;

        if (!titleValue || !descriptionValue) return false;

        return {
            'title': titleValue,
            'description': descriptionValue,
        };
    }
    
    _storeNewDocument = async () => {

        const newDocument = this._generateDataObject();

        if (!newDocument) return;

        const resp = await this.firebase.store(
            { 'collection': 'documents', 'data': newDocument }
        );

        if (resp && resp.id) {
            this._addNewDocumentCard({ ...newDocument, documentRef: resp.id }, 'afterbegin');

            this._resetForm();

            this._loadDom();
        }
    };

    _findDocumentCard = (documentRef) => {
        return this.documentsRow.querySelector(`div#document-${documentRef}`);
    }

    _deleteDocument = async (documentRef) => {

        const resp = await this.firebase.delete(
            { 'collection': 'documents', 'documentRef': documentRef }
        );

        if (resp === 'success') {
            const documentCard = this._findDocumentCard(documentRef);
    
            documentCard.remove();
        }
    }

    _setDocumentToUpdate = async (documentRef) => {
        const documentCard = this._findDocumentCard(documentRef);

        this.titleInput.value = documentCard.querySelector('h2').innerHTML;
        this.descriptionInput.value = documentCard.querySelector('p').innerHTML;
        this.refInput.value = documentRef;

        this.newDocumentButton.innerHTML = 'Update document';
    }

    _updateDocumentCard = ({ title, description, documentRef }) => {
        const titleHtml = this.html.generateSubTitle(title);
        const descriptionHtml = this.html.generateText(description);

        const documentCard = this._findDocumentCard(documentRef);
        const cardContent = documentCard.querySelector('.card-content');

        cardContent.innerHTML = titleHtml + descriptionHtml;
    }

    _updateDocument = async () => {

        const updatedDocument = this._generateDataObject();

        if (!updatedDocument) return;

        const refValue = this.refInput.value;

        const resp = await this.firebase.update(
            { 'collection': 'documents', 'document': refValue, 'data': updatedDocument }
        );

        if (resp === 'success') {
            this._updateDocumentCard({ ...updatedDocument, documentRef: refValue });

            this._resetForm();

            this.newDocumentButton.innerHTML = 'Add document';
        }
    }
}
