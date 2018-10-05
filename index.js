const https = require('https');
const express = require('express')
const path = require('path')

let cache = {}

async function getGitHubContent({
  account,
  repository,
  branch,
  path
}) {
  let finalPath = typeof path === 'string' ? path : path.join('/')
  let requestPath = `https://raw.githubusercontent.com/${account}/${repository}/${branch}/${finalPath}`

  console.info('fetching: ' + requestPath)

  return await (cache[requestPath] = cache[requestPath] || new Promise((resolve, rejects) => {
    https.get(requestPath, (res) => {
      let data = ''
      res.on('data', (chunk) => {
        data += chunk
      })

      res.on('end', () => {
        resolve(data)
      })
    }).on('error', (err) => {
      rejects(err)
    })
  }))
}


(async () => {
  let options = {
    port: process.env.PORT || 5000,

    githubAccount: process.env.ACCOUNT || 'brooswit',
    githubRepo: process.env.REPO || 'spout.js',
    githubBranch: process.env.BRANCH || 'master'
  }

  let spoutData = JSON.parse(await getGitHubContent({
    account: options.githubAccount,
    repository: options.githubRepo,
    branch: options.githubBranch,
    path: ['spout.json']
  }))

  let settings = {
    siteName: spoutData.settings.siteName || 'spout.js',
    rootDocKey: spoutData.settings.rootDocKey || 'root'
  };

  let docs = spoutData.docs;

  for (key in docs) {
    docs[key].content = await getGitHubContent({
      account: options.githubAccount,
      repository: options.githubRepo,
      branch: options.githubBranch,
      path: [docs[key].path]
    })
  }
  console.log({docs})

  express()
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', (req, res) => {
      res.render('pages/directory', state)
    })
    .get('/:targetDocKey', (req, res) => {
      res.render('pages/directory', {options, doc: docs[req.params.targetDocKey]});
    })
    .listen(options.port, () => console.log(`Listening on ${ options.port }`));
})();
