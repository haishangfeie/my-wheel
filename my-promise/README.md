## 参考
[Promise实现原理（附源码）](https://juejin.cn/post/6844903665686282253#heading-1)

## 目标
可以手写一个完整的promise

首先至少是可以看着笔记完成代码实现，并通过相关的单元测试

接着脱离笔记手写实现

## 笔记
Promise的实现是很复杂的，所以要手写函数就要记清楚实现的大致步骤，再一步一步的去实现

1. 实现Promise的状态和值改变

   promise 实例接收一个函数，函数有两个形参resolve和reject，函数执行时调用这两个形参中的一个来改变promise的状态，使其从执行中变成已完成或者已拒绝

2. 实现Promise 的then方法

   要准确实现，我需要了解then的特性：

   - then方法接收两个**可选** 参数， onFulfilled 、onRejected
     - 如果 `onFulfilled` 或 `onRejected` 不是函数，其必须被忽略
     - **onFulfilled 如果其是函数：**
       - 当 promise 状态变为成功时必须被调用，其第一个参数为 promise 成功状态传入的值（ resolve 执行时传入的值）
       - 在 promise 状态改变前其不可被调用
       - 其调用次数不可超过一次
     - **onRejected 如果其是函数：**
       - 当 promise 状态变为失败时必须被调用，其第一个参数为 promise 失败状态传入的值（ reject 执行时传入的值）
       - 在 `promise` 状态改变前其不可被调用
       - 其调用次数不可超过一次
   - then方法可以被一个promise对象多次调用
   - then方法必须返回一个新的promise对象
   - 值的传递以及错误捕获机制：
     - 如果 `onFulfilled` 或者 `onRejected` 返回一个值 `x` ，则运行下面的 `Promise` 解决过程：`[[Resolve]](promise2, x)`
       - 若 `x` 不为 `Promise` ，则使 `x` 直接作为新返回的 `Promise` 对象的值， 即新的`onFulfilled` 或者 `onRejected` 函数的参数.
       - 若 `x` 为 `Promise` ，这时后一个回调函数，就会等待该 `Promise` 对象(即 `x` )的状态发生变化，才会被调用，并且新的 `Promise` 状态和 `x` 的状态相同。
     - 如果 `onFulfilled` 或者`onRejected` 抛出一个异常 `e` ，则 `promise2` 必须变为失败`（Rejected）`，并返回失败的值 `e`
     - 如果`onFulfilled` 不是函数且 `promise1` 状态为成功`（Fulfilled）`， `promise2` 必须变为成功`（Fulfilled）`并返回 `promise1` 成功的值
     - 如果 `onRejected` 不是函数且 `promise1` 状态为失败`（Rejected）`，`promise2`必须变为失败`（Rejected）` 并返回 `promise1` 失败的值

   