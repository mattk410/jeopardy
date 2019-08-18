class Message {

    constructor(json) {
        if (_.isEmpty(json)) {
            let message = JSON.parse(json);
            this._type = message.type;
            this._message = message.value;
        }
        else {
            this._type = null;
            this._message = null
        }
    }

    get message() {
        return this._message;
    }

    set message(value) {
        this._message = value;
    }

    get type() {
        return this._type;
    }

    set type(value) {
        this._type = value;
    }

    getMessageObject() {
        return {type: this._type, value: this._message};
    }

    toJSON() {
        return JSON.stringify(this.getMessageObject());
    }


    log(inBoundOutbound) {
        console.log("============================")
        console.log("MSG")
        console.log(inBoundOutbound);
        console.log(this.getMessageObject());
        console.log("============================");
    }
}

export default class {Message};