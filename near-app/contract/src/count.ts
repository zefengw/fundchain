import { call, near, NearBindgen, view } from "near-sdk-js";

@NearBindgen({})
class Counter {
    val: number = 0

    @view({})
    getNum(): number {
        return this.val
    }

    @call({})
    increment() {
        this.val = this.val + 1
        near.log(`Increased number to ${this.val}`)
    }

    @call({})
    decrement() {
        this.val = this.val - 1
        near.log(`Decreased number to ${this.val}`)
    }

    @call({})
    reset() {
        this.val = 0
        near.log(`Reset counter to zero`)
    }
}