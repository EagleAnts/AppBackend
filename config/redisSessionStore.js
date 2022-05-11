const { createClient } = require("redis");
const redisClient = createClient({
  url: "redis://paritosh:Redis@12@redis-19154.c245.us-east-1-3.ec2.cloud.redislabs.com:19154",
});

/* abstract */ class SessionStore {
  findSession(networkID) {}
  saveSession(networkID, session) {}
  findConnectedSessions(networkID) {}
}

class RedisSessionStore extends SessionStore {
  /**
   *
   * @param {redisClient} redisClient
   */
  constructor(redisClient) {
    super();
    this.redisClient = redisClient;
    this.redisClient.connect();
    this.redisClient.on("ready", () => {
      console.log("Redis is Ready ✅");
    });

    this.redisClient.on("connect", () => {
      console.log("Redis Connection Successfull!");
    });

    this.redisClient.on("error", (err) => {
      console.log(err);
    });
  }

  async findSession(networkID, piID) {
    return (
      await this.redisClient.json.get(networkID, { path: `$.${piID}` })
    )[0];
  }

  async findConnectedSessions(networkID) {
    const clients = await this.redisClient.json.get(networkID);
    const connectedClients = Object.keys(clients).filter(
      (client) => clients[client].connected
    );
    return connectedClients;
  }
  async saveSession(networkID, { piID, username, raspiSID, connected }) {
    const networkDetails = (await this.redisClient.json.get(networkID)) || {};
    networkDetails[piID] = {
      username,
      raspiSID,
      blockchainSID: null,
      connected,
    };
    return await redisClient.json.set(networkID, "$", networkDetails);
  }

  async udpateSession(networkID, piID, path, newValue) {
    console.log("Updating Session");
    await redisClient.json.set(networkID, `$.${piID}.${path}`, newValue);
  }

  async clearSession(networkID, piID) {
    try {
      await this.redisClient.json.del(networkID, `$.${piID}`);
      return "User Session Cleared...";
    } catch (err) {
      return new Error(err);
    }
  }
}

const sessionStore = new RedisSessionStore(redisClient);

module.exports = sessionStore;
