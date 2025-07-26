const session = require("express-session");

class PrismaSessionStore extends session.Store {
  constructor(prisma, options = {}) {
    super();
    this.prisma = prisma;
    this.options = {
      ttl: options.ttl || 14 * 24 * 60 * 60, // if options.ttl exists,put it.If not,put default TTL: 14 days ( 1,209,600 seconds)
    };
  }

  // 🧠 Retrieve session from database using session ID
  async get(sid, callback) {
    try {
      const sessionRecord = await this.prisma.session.findUnique({
        where: { sid },
      });

      if (!sessionRecord || sessionRecord.expires < new Date()) {
        return callback(null, null); // session expired or not found
      }

      return callback(null, sessionRecord.data);
    } catch (err) {
      return callback(err);
    }
  }

  // 💾 Save or update a session in the database
  async set(sid, sessionData, callback) {
    try {
      const expires = new Date(Date.now() + this.options.ttl * 1000); // convert ttl to milliseconds

      await this.prisma.session.upsert({
        where: { sid },
        update: { data: sessionData, expires },
        create: { sid, data: sessionData, expires },
      });

      callback(null);
    } catch (err) {
      callback(err);
    }
  }

  // ❌ Delete a session from the database
  async destroy(sid, callback) {
  this.prisma.session.delete({
    where: { sid },
  }).then(() => {
    if (typeof callback === 'function') callback(null);
  }).catch((err) => {
    if (typeof callback === 'function') callback(err);
  });
}
}

module.exports = PrismaSessionStore;
