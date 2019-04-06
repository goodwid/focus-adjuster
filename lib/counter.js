class Counter {
  constructor(options = {}) {
    const { min = 0, max = 100, initialValue = 50, rollover = false } = options;
    let error;
    if(initialValue < min) error = 'Initial value cannot be less than the minimum value.';
    if(initialValue > max) error = 'Initial value cannot be greater than the maximum value.';
    if(min >= max) error = 'Minimum value must be less than the maximum value';
    if(error) throw new Error(error);
    this.ROLLOVER = rollover;
    this.value = initialValue;
    this.MIN = min;
    this.MAX = max;
  }
  increment() {
    if(this.value === this.MAX)
      return this.value = this.ROLLOVER ? this.MIN : this.MAX;
    return ++this.value;
  }
  decrement() {
    if(this.value === this.MIN)
      return this.value = this.ROLLOVER ? this.MAX : this.MIN;
    return --this.value;
  }
  get() {
    return this.value;
  }
  set(value) {
    this.value = value;
  }
}

module.exports = Counter;