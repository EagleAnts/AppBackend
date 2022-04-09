// const { default: mongoose } = require("mongoose");

// /* abstract */ class SessionStore {
//   findSession(id) {}
//   saveSession(id, session) {}
//   findAllSessions() {}
// }

// const mapSession = ([userID, username, connected]) =>
//   userID ? { userID, username, connected: connected === "true" } : undefined;

// class MongoDBSessionStore extends SessionStore {
//   /**
//    *
//    * @param {mongoose.Collection} collection
//    */

//   constructor(collection) {
//     super();
//     this.collection = collection;
//   }

//   findSession(id) {
//     return this.collection.find({ id });
//   }

//   saveSession(id, { userID, username, connected }) {
//     this.redisClient
//       .multi()
//       .hset(
//         `session:${id}`,
//         "userID",
//         userID,
//         "username",
//         username,
//         "connected",
//         connected
//       )
//       .expire(`session:${id}`, SESSION_TTL)
//       .exec();
//   }

//   async findAllSessions() {
//     const keys = new Set();
//     let nextIndex = 0;
//     do {
//       const [nextIndexAsStr, results] = await this.redisClient.scan(
//         nextIndex,
//         "MATCH",
//         "session:*",
//         "COUNT",
//         "100"
//       );
//       nextIndex = parseInt(nextIndexAsStr, 10);
//       results.forEach((s) => keys.add(s));
//     } while (nextIndex !== 0);
//     const commands = [];
//     keys.forEach((key) => {
//       commands.push(["hmget", key, "userID", "username", "connected"]);
//     });
//     return this.redisClient
//       .multi(commands)
//       .exec()
//       .then((results) => {
//         return results
//           .map(([err, session]) => (err ? undefined : mapSession(session)))
//           .filter((v) => !!v);
//       });
//   }
// }
// module.exports = { MongoDBSessionStore };
