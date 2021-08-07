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
      const promise = Promise.resolve('success')
      return promise
        .then('1234')
        .then((val) => {
          expect(val).toBe('success')
        })
    })

    test('then onRejected参数非函数时会被忽略', () => {
      expect.assertions(1)
      const promise = Promise.reject('fail')
      return promise
        .catch('1234')
        .catch((val) => {
          expect(val).toBe('fail')
        })
    })


    test('promise状态为成功时，then 的onFulfilled 会被调用', () => {
      expect.assertions(2)
      const promise = Promise.resolve('succsee')
      return promise
        .then((val) => {
          expect(val).toBe('succsee')
          return 'success2'
        })
        .then(val => {
          expect(val).toBe('success2')
        })
    })
  })
})
