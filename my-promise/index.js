const isFun = val => typeof val === 'function'

const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

class MyPromise {
  constructor (handler) {
    if (!isFun(handler)) {
      throw new Error('创建MyPromise 实例必须提供handler函数')
    }
    this._value = void 0
    this._status = PENDING
    this._fulfilledQueue = []
    this._rejectedQueue = []

    try {
      handler(this._resolve.bind(this), this._reject.bind(this))
    } catch (error) {
      this._reject(error)
    }
  }

  _resolve (val) {
    if (this._status !== PENDING) {
      return
    }
    const run = () => {
      this._status = FULFILLED
      this.value = val

      let cb
      while (cb = this._fulfilledQueue.shift()) {
        cb(val)
      }
    }
    setTimeout(run, 0)
  }

  _reject (err) {
    if (this._status !== PENDING) {
      return
    }
    const run = () => {
      this._status = REJECTED
      this.value = err

      let cb
      while (cb = this._rejectedQueue.shift()) {
        cb(val)
      }
    }
    setTimeout(run, 0)
  }
  then (onFulfilled, onRejected) {
    return new MyPromise((onFulfilledNext, onRejectedNext) => {
      const fulfilled = (val) => {
        if (!isFun(onFulfilled)) {
          onFulfilledNext(val)
        } else {
          try {
            const res = onFulfilled(val)
            if (res instanceof MyPromise) {
              res.then(onFulfilledNext, onRejectedNext)
            } else {
              onFulfilledNext(res)
            }
          } catch (error) {
            onRejected(error)
          }
        }
      }
      const rejected = (err) => {
        if (!isFun(onRejected)) {
          onRejectedNext(err)
        } else {
          try {
            const res = onRejected(err)

            if (res instanceof MyPromise) {
              res.then(onFulfilledNext, onRejectedNext)
            } else {
              onRejectedNext(err)
            }
          } catch (error) {
            onRejectedNext(error)
          }
        }
      }

      switch (this._status) {
        case PENDING:
          this._fulfilledQueue.push(fulfilled)
          this._rejectedQueue.push(rejected)
          break
        case FULFILLED:
          fulfilled(this._value)
          break
        case REJECTED:
          rejected(this._value)
          break

        default:
          break
      }
    })
  }
}