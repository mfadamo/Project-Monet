/** JDU Monet
 * Created By Ibratabian17
 */
async function handleRequest(request, event, resp, state = '') {
	//Start Of JS
	usage++;
	route.get(request, "/JDMonet/stats", (data) => {
		data.usage = usage
		resp = route.send(JSON.stringify(data), 200);
	})
	route.get(request, "/status/v1/ping", (data) => {
		console.log(`[PING] Ask ${data.client} PONG!`)
		resp = route.send(`{}`, 200);
	})
	route.get(request, "/", (data) => {
		resp = route.send("JDU Monet Homepage", 200);

	})

	//Handle API
	route.get(request, "/carousel/:version/pages/party", (data) => {
		state = 'FETCH'
		resp = {
			url: `${hostname}/cdn/database/carousel.json`,
			options: {
				method: "GET"
			}
		};
		console.log(`[CAROUSEL] Updating ${data.client} By Fetching CDN`)
	})
	route.get(request, "/v2/spaces/:SpaceID/entities", (data) => {
		resp = route.send(varjs.main.entities, 200, {"Content-Type": "application/json"});
	})
	route.get(request, "/:version/applications/:appId/configuration", (data) => {
		resp = route.send(varjs.main.config, 200);
	})
	route.get(request, "/:version/users/:user", (data) => {
		var auth = data.headers.get("Authorization");
		var sessionid = data.headers.get("Ubi-SessionId");
		state = 'FETCH'
		resp = {
			url: `https://public-ubiservices.ubi.com/v3/users/${data.params.user}`,
			options: {
				method: "GET",
				headers: {
					"User-Agent": "UbiServices_SDK_HTTP_Client_4.2.9_PC32_ansi_static",
					Accept: "*/*",
					Authorization: auth,
					"Content-Type": "application/json",
					"ubi-appbuildid": "BUILDID_259645",
					"Ubi-AppId": data.headers.get("Ubi-AppID"),
					"Ubi-localeCode": "en-us",
					"Ubi-Populations": "US_EMPTY_VALUE",
					"Ubi-SessionId": sessionid
				}
			}
		};
	})
	route.get(request, "/songdb/:version/songs", (data) => {
		state = 'FETCH'
		resp = {
			url: `${hostname}/cdn/database/songdb.json`,
			options: {
				method: "GET"
			}
		};
	})
	route.get(request, "/packages/:version/sku-packages", (data) => {
		state = 'FETCH'
		resp = {
			url: `${hostname}/cdn/database/sku-packages.json`,
			options: {
				method: "GET"
			}
		};
	})
	route.get(request, "/packages/:version/sku-constants", (data) => {
		state = 'FETCH'
		resp = {
			url: `${hostname}/cdn/database/sku-constants.json`,
			options: {
				method: "GET"
			}
		};
	})

	route.post(request, "/subscription/v1/refresh", (data) => {
		resp = route.send(varjs.main.subs, 200);
		console.log(`[SUBS] Updating ${data.client} Subs`)
	})


	//End Of API
	if (state == "REDIRECT") return Response.redirect(resp.url, 301);
	if (state == "FETCH") return fetch(resp.url, resp.options)
	if (!resp) resp = route.send("API Not Found \n Error Code : 404", 404);
	return resp;
}

async function handleCDNRequest(pathname, request) {
	const filePath = pathname.toString().substring('/cdn/'.length);
	const fileId = await GoogleDrive.getFileId(settings.gdrive.folderID.cdn, filePath);
	const downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
	const token = await GoogleDrive.getAccessToken();

	// Fetch the file from Google Drive and return it as a stream
	const response = await fetch(downloadUrl, {
		cf: { cacheEverything: true },
		headers: { Authorization: `Bearer ${token}`,},
	});
	// Return the response with the stream piped to the client
	return new Response(response.body, {
	  headers: { "Content-Type": response.headers.get("Content-Type") },
	  size: 2097152 
	});
}

addEventListener('fetch', event => {
	const url = new URL(event.request.url);
	hostname = url.hostname ? `${url.protocol}//${url.hostname}` : `${url.protocol}//127.0.0.1`;
	if (url.pathname.startsWith('/cdn/')) {
		event.respondWith(handleCDNRequest(url.pathname, event.request).catch(error => {
			console.error(error.stack)
			return new Response(`CDN Failed to obtain file ${url.pathname} \n Error Code: ${btoa(error)}`, { status: 500 })
		}))
	} else {
		event.respondWith(handleRequest(event.request, event).catch(error => {
			console.error(error.stack)
			return new Response(`Internal Server Error \n Error Code: ${btoa(error)}`, { status: 500 })
		}))
	}
})


var settings = require("../settings.json");
var route = require("./function/route");
var varjs = require("./function/var");
var GoogleDrive = require("./google/driveUtil");
let usage = 0;
var hostname;
console.log("[SERVER] Running")