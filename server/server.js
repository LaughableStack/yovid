const http = require("http")
const fs = require("fs")
const siteMap = require("./sitemap.json")
const api = require("./api")

let baseDir = "./pages/"

module.exports = class webServer {
    constructor(config) {
        this.server = http.createServer((req, res) => {this.handler(req,res)})
        this.server.listen(config.port)
        this.api = api(config.dbURL)
    }
    async handleCall(addressComponents, req, res) {
        let reqStream = [];
        req.on('data', (chunkData) => {
          reqStream.push(chunkData.toString())
        });
        req.on('end', async () => {
            let data = JSON.parse(reqStream);
            let output = JSON.stringify(await this.api[addressComponents[1]](data));
            console.log(output)
            res.writeHead(200, {'Content-Type': "application/json"})
            res.write(output)
            res.end()
        });
    }
    async handler(req,res) {
        var ref = siteMap;
        let addressComponents = req.url.split("/").slice(1)
        if (addressComponents[0] == "api") return await this.handleCall(addressComponents, req, res)
        for (var layer of addressComponents) {
            ref = ref[layer]
        }
        res.writeHead(200, {'Content-Type': ref.type});
        let content = fs.readFileSync(baseDir+ref.ref);
        res.write(content)
        res.end()
    }
}