let cache = {}

export default async function getGitHubContent ({
  account = 'ACCOUNT-REQUIRED',
  repository = 'REPOSITORY-REQUIRED',
  branch = 'BRANCH-REQUIRED',
  path = []
}) {
  let finalPath = typeof path === 'string' ? path : path.join('/')
  let requestPath = `https://raw.githubusercontent.com/${account}/${repository}/${branch}/${finalPath}`

  cache[requestPath] = cache[requestPath] || new Promise((resolve) => {
    var xmlHttp = new XMLHttpRequest()
    xmlHttp.onreadystatechange = () => {
      if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
        resolve(xmlHttp.responseText)
      }
    }
    xmlHttp.open('GET', requestPath, true)
    xmlHttp.send(null)
  })

  let response = await cache[requestPath]
  return response
}
