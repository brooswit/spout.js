const WebAppServer = require('./WebAppServer')
const webAppServer = new WebAppServer({
  account: process.env.SPOUT_GITHUB_ACCOUNT || 'brooswit',
  repository: process.env.SPOUT_GITHUB_REPOSITORY || 'spout.js',
  branch: process.env.SPOUT_GITHUB_BRANCH || 'master',
  port: process.env.SPOUT_WEBAPP_PORT || 5000
})
