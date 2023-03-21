export function parseUrlParams(url, pattern) {
    const paramNames = [];
    const paramValues = [];
  
    const regex = pattern
      .replace(/:[^\/]+/g, (match) => {
        paramNames.push(match.slice(1));
        return '([^\/]+)';
      })
      .replace(/\-\-/g, (match) => {
        return '\\'+match;
      })
      .replace(/\//g, '\\/');
  
    const matches = url.match(new RegExp(`^${regex}$`));
  
    if (!matches) {
      return null;
    }
  
    for (let i = 1; i < matches.length; i++) {
      paramValues.push(matches[i]);
    }
  
    const params = {};
    for (let i = 0; i < paramNames.length; i++) {
      params[paramNames[i]] = paramValues[i];
    }
  
    return params;
  }

 export function readRequestBody(request) {
    const contentType = request.headers.get('content-type');
    if (contentType.includes('application/json')) {
      return JSON.stringify(request.json());
    } else if (contentType.includes('application/text')) {
      return request.text();
    } else if (contentType.includes('text/html')) {
      return request.text();
    } else {
      // Perhaps some other type of data was submitted in the form
      // like an image, or some other binary data.
      return false;
    }
  }

export function fakeID(string){
   var a = btoa(string)
   a = a.substring(Math.floor(a.length/2) - 4, Math.floor(a.length/2) + 4)
   return a;
  }

export var main = {
  room: '{"room":"PCJD2017"}',
  subs: JSON.stringify(require("../static/subscription.json"))
}
  