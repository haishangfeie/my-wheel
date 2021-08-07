const isFun = val => typeof val === 'function'

const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

export default class MyPromise {
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
        cb(err)
      }
    }
    setTimeout(run, 0)
  }

  then (onFulfilled, onRejected) {
    const promise2 = new MyPromise((resolve, reject) => {
      const fulfilled = (val) => {
        if (!isFun(onFulfilled)) {
          resolve(val)
        } else {
          try {
            const res = onFulfilled(val)
            if (res instanceof MyPromise) {
              res.then(resolve, reject)
            } else {
              resolve(res)
            }
          } catch (error) {
            reject(error)
          }
        }
      }
      const rejected = (err) => {
        if (!isFun(onRejected)) {
          reject(err)
        } else {
          try {
            const res = onRejected(err)

            if (res instanceof MyPromise) {
              res.then(resolve, reject)
            } else {
              resolve(res)
            }
          } catch (error) {
            reject(error)
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
    return promise2
  }

  catch (onRejected) {
    return this.then(void 0, onRejected)
  }

  finally (cb) {
    return this.then(
      value => MyPromise.resolve(cb()).then(() => value),
      reason => MyPromise.resolve(cb()).then(() => { throw reason })
    )
  }

  static resolve (value) {
    if (value instanceof MyPromise) {
      return value
    }
    return new MyPromise(resolve => {
      resolve(value)
    })
  }

  static reject (value) {
    if (value instanceof MyPromise) {
      return value
    }
    return new MyPromise((resolve, reject) => {
      reject(value)
    })
  }

  static all (promiseList) {
    return new MyPromise((resolve, reject) => {
      let count = 0
      let values = []
      for (let [index, promiseItem] of promiseList.entries()) {
        this.resolve(promiseItem)
          .then((res) => {
            values[index] = res
            count++

            if (promiseList.length === count) {
              resolve(values)
            }
          })
          .catch(err => {
            reject(err)
          })
      }
    })
  }

  static race (promiseList) {
    return new Promise((resolve, reject) => {
      for (let promiseItem of promiseList) {
        this.resolve(promiseItem)
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      }
    })
  }
}