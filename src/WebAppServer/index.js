const express = require('express')

const EventEmitter = require('events')
const path = require('path')

module.exports = exports = class WebAppServer extends EventEmitter {
  constructor (config) {
    super()
    let port = config.port
    let optionsResponse = JSON.stringify({
      account: config.account,
      repository: config.repository,
      branch: config.branch
    })

    this.readyPromise = new Promise((resolve) => {
      this.once('opened', resolve)
    })

    this.emit('opening')
    this._express = express()
      .use(express.static(path.join(__dirname, 'build')))
      .use(express.static(path.join(__dirname, 'public')))
      .get('/init.json', (req, res) => {
        res.send(optionsResponse)
      })
      .listen(port, () => {
        console.log(`Spout listening on port ${port}`)
        this.emit('opened')
      })
  }

  async close () {
    await this.readyPromise
    this.emit('closing')
    this._express.close()
    this.emit('closed')
  }
}
