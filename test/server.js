const { createServer } = require("http")
const { parse } = require("url")
const { exists, statSync, readFile } = require("fs")

const path = require("path")

const port = process.argv[2] || 8888
const basePath = process.argv[3] || ""

createServer(function(request, response) {
  const uri = parse(request.url).pathname
  let filename = path.join(process.cwd(), basePath, uri)

  exists(filename, function(fileExists) {
    if (!fileExists) {
      response.writeHead(404, { "Content-Type": "text/plain" })
      response.write("404 Not Found\n")
      response.end()
      return
    }

    if (statSync(filename).isDirectory()) filename += "/index.html"

    readFile(filename, "binary", function(err, file) {
      if (err) {
        response.writeHead(500, { "Content-Type": "text/plain" })
        response.write(`${err}\n`)
        response.end()
        return
      }

      response.writeHead(200)
      response.write(file, "binary")
      response.end()
    })
  })
}).listen(parseInt(port, 10))

console.log(
  `Static file server running at\n  => http://localhost:${port}/\nCTRL + C to shutdown`
)
