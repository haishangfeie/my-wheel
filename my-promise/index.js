const isFun = val => typeof val === 'function'

const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

class MyPromise {
  constructor (handler) {
    if (!isFun(handler)) {
      throw new Error('创建promise实例 必须要传入函数 handler')
    }
    handler(this._resolve.bind(this), this._reject.bind(this))
  }

  _resolve (val) {
    const run = () => {
      if(this._status !== PENDING) {
        return
      }
      if(val instanceof MyPromise) {
        val.then()
      } else {

      }
    }
    setTimeout(() => {
      run()
    }, 0)
  }
}