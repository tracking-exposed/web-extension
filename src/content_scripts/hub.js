class Hub {
  constructor() {
    this.handlers = {};
  }

  on(type, handler) {
    if (!this.handlers[type]) {
      this.handlers[type] = [];
    }
    this.handlers[type].push(handler);
  }

  send(type, payload) {
    const funcs = this.handlers[type];
    const funcsStar = this.handlers["*"];
    if (funcs) {
      funcs.forEach(func => func(type, payload));
    }

    if (funcsStar) {
      funcsStar.forEach(func => func(type, payload));
    }
  }
}

export default Hub;
