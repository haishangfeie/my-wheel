const isFun = val => typeof val === 'function'

const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

class MyPromise {
  constructor (handler) {
    if (!isFun) {
      throw new Error('创建promise 实例必须提供handler函数')
    }
    handler(this._resolve.bind(this), this._reject.bind(this))
  }

  _resolve (val) {
    const run = () => {
      if (this._status !== 'PENDING') {
        return
      }
      this._value = val
      this._status = FULFILLED
      let cb
      while (cb = this._fulfilledList.shift()) {
        cb(val)
      }
    }
    setTimeout(() => {
      run()
    }, 0)
  }

  _reject (err) {
    const run = () => {
      if (this._status !== 'PENDING') {
        return
      }
      this._value = err
      this._status = REJECTED
      let cb
      while (cb = this._rejectedList.shift()) {
        cb(err)
      }
    }
    setTimeout(() => {
      run()
    }, 0)
  }

  then (onFulfilled, onRejected) {
    return new MyPromise((onFulfilledNext, onRejectedNext) => {
      const fulfilled = (val) => {
        // if(val )
      }
      const rejected = () => {

      }
      switch (this._status) {
        case PENDING:
          this._fulfilledList.push(fulfilled)
          this._rejectedList.push(rejected)
          break
        case FULFILLED:
          fulfilled(this._value)
          break
        case REJECTED:
          rejected(this._value)
        default:
          break
      }
    })
  }
}