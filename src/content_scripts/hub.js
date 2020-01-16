class Hub {
  constructor(config = {}) {
    this.handlers = {};
    this.config = config;
    this.on("updateConfig", (_, config) => {
      this.config = { ...this.config, ...config };
      this.send("setConfig", this.config);
    });
  }

  on(type, handler) {
    if (!this.handlers[type]) {
      this.handlers[type] = [];
    }
    this.handlers[type].push(handler);
  }

  send(type, payload) {
    const funcsStar = this.handlers["*"];
    if (funcsStar) {
      funcsStar.forEach(func => func(type, payload, this));
    }

    const funcs = this.handlers[type];
    if (funcs) {
      funcs.forEach(func => func(type, payload, this));
    }
  }
}

export default Hub;
