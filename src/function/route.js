var varjs = require("./var.js")

export async function get(req, path, func) {
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
            try {
                const result = await func(data);
                if (result instanceof Promise) {
                    // If `func` is an asynchronous function, wait for it to complete
                    await result.catch((err) => console.error(err));
                }
            } catch (err) {
                console.error(err);
            }
        }
    }
}

export async function post(req, path, func) {
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
            try {
                const result = await func(data);
                if (result instanceof Promise) {
                    // If `func` is an asynchronous function, wait for it to complete
                    await result.catch((err) => console.error(err));
                }
            } catch (err) {
                console.error(err);
            }
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

export function cdn(hostname, path, method = 'GET') {
	return {
			url: `${hostname}/cdn/${path}`,
			options: {
				method: method
			}
	}

}
