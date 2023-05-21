import { call, NearBindgen, view, near } from "near-sdk-js";

const POINT_ONE = '100000000000000000000000';
class PostedMessage {
    premium: boolean;
    sender: string;
    text: string;

    constructor({ premium, sender, text }: PostedMessage) {
        this.premium = premium
        this.sender = sender
        this.text = text
    }
}


@NearBindgen({})
class GuestBook {

    messages: PostedMessage[] = [];

    @call({})
    addMessages({ text }: { text: string }) {
        const premium = near.attachedDeposit() >= BigInt(POINT_ONE)
        const sender = near.predecessorAccountId();

        const message = new PostedMessage({ premium, sender, text });
        this.messages.push(message)
    }

    @view({})
    getMessages({ from_index = 0, limit = 10 }: { from_index: number, limit: number }): PostedMessage[] {
        return this.messages.slice(from_index, from_index + limit);
    }


}