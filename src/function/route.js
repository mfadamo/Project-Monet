var varjs = require("./var.js")

export function get(req, path, func) {
    if (req.method === 'GET') {
        const { pathname } = new URL(req.url);
        var data = {
            url: pathname,
            method: req.method,
            client: varjs.fakeID(req.headers.get("Cf-Connecting-Ip"))
        }
        if (path == pathname || varjs.parseUrlParams(pathname, path)) {
            if (varjs.parseUrlParams(pathname, path)) {
                data.params = varjs.parseUrlParams(pathname, path)
            }
            func(data)
        }
    }
}
export function post(req, path, func) {
    if (req.method === 'POST') {
        const { pathname } = new URL(req.url);
        var data = {
            url: pathname,
            method: req.method,
            client: varjs.fakeID(req.headers.get("Cf-Connecting-Ip"))
        }
        if (path == pathname || varjs.parseUrlParams(pathname, path)) {
            if (varjs.parseUrlParams(pathname, path)) {
                data.params = varjs.parseUrlParams(pathname, path)
            }
            func(data)
        }
    }
}

export function send(string, statusCode){
    return new Response(string, {status: statusCode});
}