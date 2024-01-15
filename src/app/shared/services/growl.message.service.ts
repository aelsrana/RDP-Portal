import { Message } from 'primeng/primeng';

export class GrowlMessageService {

    msgs: Message[] = [];

   showSuccess(msg) {
        this.msgs = [];
        this.msgs.push({severity:'success', summary:'success', detail: msg});
        return this.msgs;
    }
    showInfo(msg) {
        this.msgs = [];
        this.msgs.push({severity:'info', summary:'info', detail: msg});
        return this.msgs;
    }

    showWarn(msg) {
        this.msgs = [];
        this.msgs.push({severity:'warn', summary:'warning', detail: msg});
        return this.msgs;
    }

    showError(msg) {
        this.msgs = [];
        this.msgs.push({severity:'error', summary:'error', detail: msg});
        return this.msgs;
    }

    clear() {
        return this.msgs = [];
    }
}