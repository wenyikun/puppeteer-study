var request = require('superagent');
 
// extend with Request#proxy()
require('superagent-proxy')(request);
 
// HTTP, HTTPS, or SOCKS proxy to use
var proxy = process.env.http_proxy || 'https://134.119.205.247:1080';
 
request
  .get(process.argv[2] || 'https://google.com/')
  .proxy(proxy)
  .end(onresponse);
 
function onresponse (err, res) {
  if (err) {
    console.log(err);
  } else {
    console.log(res.status, res.headers);
    console.log(res.body);
  }
}