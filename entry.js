const Server = require("./server/server")
const secret = require("./secret.json")
let server = new Server(secret)