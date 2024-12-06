enum PromiseState {
  PENDING = "pending",
  FULFILLED = "fulfilled",
  REJECTED = "rejected",
}

type TPromiseResolve<T> = (value: T) => void;
type TPromiseReject<K> = (reason: K) => void;
type TPromiseExecutor<T, K> = (
  resolve: TPromiseResolve<T>,
  reject: TPromiseReject<K>,
) => void;
type TPromiseThenCallback<T> = (value: T | undefined) => void;
type TPromiseCatchCallback<K> = (reason: K | undefined) => void;
type TPromiseFinallyCallback = () => void;

class MyPromise<T, K> {
  private _state: PromiseState = PromiseState.PENDING;
  private _successCallbackHandlers: TPromiseThenCallback<T>[] = [];
  private _failureCallbackHandlers: TPromiseCatchCallback<K>[] = [];
  private _finallyCallbackHandler: TPromiseFinallyCallback | undefined =
    undefined;
  private _value: T | undefined = undefined;
  private _reason: K | undefined = undefined;
  private _promiseResolver(value: T) {
    if (this._state === PromiseState.FULFILLED) return;
    this._state = PromiseState.FULFILLED;
    this._value = value;
    this._successCallbackHandlers.forEach((cb) => cb(value));
    if (this._finallyCallbackHandler) this._finallyCallbackHandler();
  }

  private _promiseRejector(reason: K) {
    if (this._state === PromiseState.REJECTED) return;
    this._state = PromiseState.REJECTED;
    this._reason = reason;
    this._failureCallbackHandlers.forEach((cb) => cb(reason));
    if (this._finallyCallbackHandler) this._finallyCallbackHandler();
  }
  constructor(executor: TPromiseExecutor<T, K>) {
    executor(
      this._promiseResolver.bind(this),
      this._promiseRejector.bind(this),
    );
  }

  public then(handlerFunc: TPromiseThenCallback<T>) {
    if (this._state === PromiseState.FULFILLED) {
      handlerFunc(this._value);
    } else {
      this._successCallbackHandlers.push(handlerFunc);
    }
    return this;
  }

  // public then<U>(handlerFunc: (value: T | undefined) => U | MyPromise<U, K>): MyPromise<U, K> {
  //   return new MyPromise<U, K>((resolve, reject) => {
  //     if (this._state === PromiseState.FULFILLED) {
  //       const result = handlerFunc(this._value)
  //       if (result instanceof MyPromise) {
  //         result.then(resolve).catch(reject);
  //       } else {
  //         resolve(result);
  //       }
  //     } else {
  //       this._successCallbackHandlers.push((value) => {
  //         const result = handlerFunc(value);
  //         if (result instanceof MyPromise) {
  //           result.then(resolve).catch(reject);
  //         } else {
  //           resolve(result);
  //         }
  //       });
  //     }
  //   })
  // }

  public catch(handlerFunc: TPromiseCatchCallback<K>) {
    if (this._state === PromiseState.REJECTED) {
      handlerFunc(this._reason);
    } else {
      this._failureCallbackHandlers.push(handlerFunc);
    }
    return this;
  }

  public finally(handlerFunc: TPromiseFinallyCallback) {
    if (this._state !== PromiseState.PENDING) {
      return handlerFunc();
    }
    this._finallyCallbackHandler = handlerFunc;
  }
}
