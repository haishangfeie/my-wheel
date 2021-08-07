import { describe, expect, jest, test } from '@jest/globals'
import MyPromise from '.'

describe('测试MyPromise', () => {
  test('promise的handler函数会立即执行', () => {
    const handler = jest.fn((resolve, reject) => {
      resolve(1)
    })
    new MyPromise(handler)
    expect(handler).toHaveBeenCalled()
  })
  describe('测试MyPromise then方法', () => {
    test('then 方法可以被多次调用', (done) => {
      const fn = jest.fn()
      const promise = new MyPromise((resolve, reject) => {
        resolve(1)
      })
      promise.then(() => {
        fn()
      })
      promise.then(() => {
        fn()
      })
      promise.then(() => {
        fn()
        expect(fn.mock.calls.length).toBe(3)
        done()
      })
    })

    test('then onFulfilled参数非函数时会被忽略', () => {
      expect.assertions(1)
      const promise = MyPromise.resolve('success')
      return promise
        // .then('1234')
        .then((val) => {
          expect(val).toBe('success')
        })
    })

    test('then onRejected参数非函数时会被忽略', () => {
      expect.assertions(1)
      const promise = MyPromise.reject('fail')
      return promise
        .catch('1234')
        .catch((val) => {
          expect(val).toBe('fail')
        })
    })


    test('promise状态为成功时，then 的onFulfilled 会被调用', () => {
      expect.assertions(2)
      const promise = MyPromise.resolve('succsee')
      return promise
        .then((val) => {
          expect(val).toBe('succsee')
          return 'success2'
        })
        .then(val => {
          expect(val).toBe('success2')
        })
    })

    test('在promise状态改变前，then 的 onFulfilled 不可以被调用', (done) => {
      jest.useFakeTimers()
      expect.assertions(2)

      const promise = new MyPromise((resovle, reject) => {
        setTimeout(() => {
          resovle(1)
        }, 3000)
      })
      const fn = jest.fn()

      jest.advanceTimersByTime(1000)
      expect(fn.mock.calls.length).toBe(0)

      jest.advanceTimersByTime(2100)

      promise.then(() => {
        fn()
        expect(fn.mock.calls.length).toBe(1)
        done()
      })

      jest.useRealTimers()
    })
  })
})
