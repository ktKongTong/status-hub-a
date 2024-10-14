export class Lazy<T> {
  private _value: T | undefined
  private readonly _fn : () => T
  constructor(func: () => T) {
    this._fn = func
  }

  private initialized() {
    return this._value != undefined
  }

  private init() {
    if(this._value == undefined) {
      this._value = this._fn()
    }
  }
  get value():T {
    if(!this.initialized()) {
      this.init()
    }
    return this.value as T
  }
}