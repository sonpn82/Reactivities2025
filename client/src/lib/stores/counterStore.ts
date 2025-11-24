import {makeAutoObservable} from 'mobx'

export default class CounterStore {
  title = 'Counter store'
  count = 1
  events: string[] = [
    `Initial count is ${this.count}`
  ]

  constructor() {
    makeAutoObservable(this)
  }

  increment = (amount = 1) => {
    this.count += amount
    this.events.push(`Increment by ${amount} - count is now ${this.count}`)
  }
  decrement = (amount = 1) => {
    this.count -= amount
    this.events.push(`Decrement by ${amount} - count is now ${this.count}`)
  }

  get eventCount() {
    return this.events.length
  }

}