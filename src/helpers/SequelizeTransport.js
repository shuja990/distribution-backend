const TransportStream = require('winston-transport');
const db = require('../models'); // Ensure this path is correct based on your project structure

class SequelizeTransport extends TransportStream {
  constructor(opts) {
    super(opts);
  }

  async log(info, callback) {
    setImmediate(() => {
      this.emit('logged', info);
    });

    const { level, message, timestamp } = info;

    try {
      await db.Log.create({ level, message, timestamp });
    } catch (error) {
      console.error('Error logging to database:', error);
    }

    callback();
  }
}

module.exports = SequelizeTransport;
