export default class Html {
    constructor() {

    }

    generateSubTitle(content, className = '') {
        return `<h2 class="${className}">${content}</h2>`;
    }

    generateText(content, className = '' ) {
        return `<p class="${className}">${content}</p>`;
    }

    generateButton({content, className = '', dataSet = '', dataSetValue = '' }) {
        return `<button class="${className}" ${dataSet}="${dataSetValue}">${content}</button>`;
    }

    generateDiv({content, className = '', id = ''}) {
        return `<div class="${className}" id="${id}">${content}</div>`;
    }
}