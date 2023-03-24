var varjs = require("./var.js")

export function get(req, path, func) {
    if (req.method === 'GET') {
        const correctedUrl = req.url.replace(/\/{2,}/g, "/");
        const { pathname } = new URL(correctedUrl);
        var data = {
            url: pathname,
            method: req.method,
            client: varjs.fakeID(req.headers.get("Cf-Connecting-Ip")),
            headers: req.headers
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
        const correctedUrl = req.url.replace(/\/{2,}/g, "/");
        const { pathname } = new URL(correctedUrl);
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

export function send(data, statusCode, headers = {}, isFetch = false) {
    if (isFetch) {
        return new Response(fetch(data));
    } else {
        return new Response(data, { status: statusCode, headers: headers});
    }
}
