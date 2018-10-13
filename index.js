const https = require('https');
const express = require('express')
const path = require('path')
const marked = require('marked')

let cache = {}

setInterval(()=>{
  for (key in cache) {
    delete cache[key]
  }
}, 1000*60*15/*15 minutes*/)

async function getGitHubContent({
  account,
  repository,
  branch,
  path
}) {
  let finalPath = typeof path === 'string' ? path : path.join('/')
  let requestPath = `https://raw.githubusercontent.com/${account}/${repository}/${branch}/${finalPath}`

  console.info('fetching: ' + requestPath, finalPath)

  return await (cache[requestPath] = cache[requestPath] || new Promise((resolve, rejects) => {
    https.get(requestPath, (res) => {
      let data = ''
      res.on('data', (chunk) => {
        data += chunk
      })

      res.on('end', () => {
        console.log({statusCode: res.statusCode, data})
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
    siteName: spoutData.siteName || 'spout.js',
    rootDirectory: spoutData.rootDirectory,
    rootDocPath: spoutData.rootDocPath,
    rootDocData: {}
  }
  
  async function handleResponse(req, res) {
    let requestedDoc = req.params.requestedDoc
    let docContent, docData
    
    if (!requestedDoc) {
      docContent = await getGitHubContent({
        account: options.githubAccount,
        repository: options.githubRepo,
        branch: options.githubBranch,
        path: [settings.rootDocPath]
      })
      
      docData = settings.rootDocData
    } else {
      docContent = await getGitHubContent({
        account: options.githubAccount,
        repository: options.githubRepo,
        branch: options.githubBranch,
        path: [settings.rootDirectory, `${requestedDoc}.md`]
      })

      docData = JSON.parse(await getGitHubContent({
        account: options.githubAccount,
        repository: options.githubRepo,
        branch: options.githubBranch,
        path: [settings.rootDirectory, `${requestedDoc}.json`]
      }))
    }
    
    docData.content = docContent
    docData.markdown = markd(docContent)
    
    res.render('pages/doc', docData)
  }
  
  express()
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/:requestedDoc', handleResponse)
    .listen(options.port, () => console.log(`Listening on ${ options.port }`))
})()
