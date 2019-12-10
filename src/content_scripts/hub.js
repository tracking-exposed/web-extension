class Hub {
  constructor(config = {}) {
    this.handlers = {};
    this.config = config;
    this.on("updateConfig", (_, config) => {
      this.config = { ...this.config, ...config };
      this.send("newConfig", this.config);
    });
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
      funcs.forEach(func => func(type, payload, this));
    }

    if (funcsStar) {
      funcsStar.forEach(func => func(type, payload, this));
    }
  }
}

export default Hub;
