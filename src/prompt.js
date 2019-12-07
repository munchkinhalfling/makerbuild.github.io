import {TemplateElement} from 'template-element';

class Prompt extends TemplateElement {
    template = `
<dialog id="dlg">
    <span class="dlg-header">{{message}}</span>
    <input id="response" type="text" @keypress="inputKeyPressed">
    <button id="close" @click="close">OK</button>
</dialog>
    `
    styles = `
span.dlg-header {
    font-weight: bold;
    display: block;
}
button.close {
    border: none;
    border-radius: 12px;
    background-color: blue;
    display: block;
    float: right;
}
    `
    constructor() {
        super();
        this.addElementProperty('response', 'input#response');
        this.addElementProperty('internalDialog', 'dialog#dlg');
        this.addObservable('message');
        this.addObservable('value');
        this.addObservable('modal')
    }
    afterRenderCallback() {
        this.response.value = !isUndefinedString(this.value)? this.value : '';
    }
    close() {
        this.internalDialog.close();
        this.dispatchEvent(new Event('closed'));
    }
    show() {
        if(this.hasAttribute('modal')) this.internalDialog.showModal();
        else this.internalDialog.show();
    }
    inputKeyPressed(e) {
        if(e.key == "Enter") this.close();
    }
}
function isUndefinedString(str) {
    return str == undefined || str == null || str == void(0) || str == 'undefined';
}
customElements.define('cust-prompt', Prompt);