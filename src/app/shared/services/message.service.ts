import { Input } from "@angular/core";

export class MessageService {

    @Input()
    public msgs: Array<any> = [];

    showSuccess(msg) {
        this.msgs = [];
        this.msgs.push({id: 1, type: 'success', message: msg });
        return this.msgs;
    }
    showInfo(msg) {
        this.msgs = [];
        this.msgs.push({id: 1, type: 'info', message: msg });
        return this.msgs;
    }

    showWarn(msg) {
        this.msgs = [];
        this.msgs.push({id: 1, type: 'warning', message: msg });
        return this.msgs;
    }

    showError(msg) {
        this.msgs = [];
        this.msgs.push({id: 1, type: 'danger', message: msg });
        return this.msgs;
    }

    clear() {
        return this.msgs = [];
    }

    
}