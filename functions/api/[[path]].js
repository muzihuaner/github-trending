export async function onRequest(context) {
  const { request } = context
  const url = new URL(request.url)
  const path = url.pathname.replace(/^\/api/, '')
  const targetUrl = `https://api.ossinsight.io${path}${url.search}`

  const init = {
    method: request.method,
    headers: {},
  }

  const forwardHeaders = ['content-type', 'accept', 'authorization', 'user-agent', 'referer']
  for (const key of forwardHeaders) {
    const val = request.headers.get(key)
    if (val) init.headers[key] = val
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = request.body
  }

  const response = await fetch(targetUrl, init)

  const respHeaders = new Headers(response.headers)
  respHeaders.set('access-control-allow-origin', '*')

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: respHeaders,
  })
}
