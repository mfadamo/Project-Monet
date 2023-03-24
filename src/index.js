/** JDU Monet
 * Created By Ibratabian17
 */
addEventListener('fetch', event => {
	const url = new URL(event.request.url);
	const hostname = url.hostname;

	if (url.pathname.startsWith('/cdn/')) {
		event.respondWith(handleCDNRequest(url.pathname))
	} else {
		event.respondWith(handleRequest(event.request, event))
	}
})

async function handleRequest(request, event) {
	try {
		var resp;
		//JDMonet Api
		usage++;
		route.get(request, "/JDMonet/Api/:AppId", (data) => {
			data.usage = usage
			console.log(`[ROUTE] ${data.client} Using ${data.params.AppId} Trying To Open Stats`)
			resp = route.send(JSON.stringify(data), 200);
		})
		route.get(request, "/", (data) => {
			resp = route.send("JDU Monet Homepage", 200);
		})
		route.get(request, "/ping", (data) => {
			console.log(`[PING] Ask ${data.client} PONG!`)
			resp = route.send("[\"pong\"]", 200);
		})
		route.post(request, "/subscription/v1/refresh", (data) => {
			resp = route.send(varjs.main.subs, 200);
			console.log(`[SUBS] Updating ${data.client} Subs`)
		})

		if (!resp) resp = route.send("API Not Found \n Error Code : 404", 404);
		return resp;
	} catch (error) {
		// Log the error in the Cloudflare Workers dashboard
		console.error(error.stack)
		return new Response(`Internal Server Error \n Error Code: ${btoa(error)}`, { status: 500 })
	}
}

async function handleCDNRequest(pathname) {
	const filePath = pathname.toString().substring('/cdn/'.length);
	const fileId = await GoogleDrive.getFileId(settings.gdrive.folderID.cdn, filePath);
	const downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
	const token = await GoogleDrive.getAccessToken();

	// Fetch the file from Google Drive and return it as a stream
	const response = await fetch(downloadUrl, {
		cf: { cacheEverything: true },
		headers: { Authorization: `Bearer ${token}`, },
	});
	const stream = response.body;

	// Get the content type of the file
	const contentType = response.headers.get('Content-Type');

	// Return the response with the stream piped to the client
	return new Response(stream, {
		headers: { 'Content-Type': contentType },
	});
}

var settings = require("../settings.json");
var route = require("./function/route");
var varjs = require("./function/var");
var GoogleDrive = require("./google/driveUtil");
let usage = 0;
console.log("[SERVER] Running")