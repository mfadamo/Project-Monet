/** JDU Monet
 * Created By Ibratabian17
 */
addEventListener('fetch', event => {
	event.respondWith(handleRequest(event.request))
  })
export default {
	async fetch(request, env, ctx) {

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
			resp = route.send("[pong]", 200);
		})
		route.post(request, "/subscription/v1/refresh", (data) => {
			resp = route.send(varjs.main.subs, 200);
			console.log(`[SUBS] Updating ${data.client} Subs`)
		})

		if(!resp)resp = route.send("API Not Found", 404);
		return resp;
	},
};

var route = require("./function/route");
var varjs = require("./function/var");
var GoogleDrive = require("./google/driveUtil");
let usage = 0;
console.log("[SERVER] Running")
