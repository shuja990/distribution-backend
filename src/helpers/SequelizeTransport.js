const TransportStream = require('winston-transport');
const { Log } = require('../models'); // Ensure this path is correct based on your project structure

class SequelizeTransport extends TransportStream {
  constructor(opts) {
    super(opts);
  }

  async log(info, callback) {
    setImmediate(() => {
      this.emit('logged', info);
    });

    const { level, message, timestamp } = info;

    await Log.create({ level, message, timestamp });


    callback();
  }
}

module.exports = SequelizeTransport;
