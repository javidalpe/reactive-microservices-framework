const http = require('http');
const Subject = require("rxjs/internal/Subject").Subject;
const tap = require("rxjs/operators/tap").tap;
const map = require("rxjs/operators/map").map;
const of = require("rxjs/observable/of").of;
const hostname = '127.0.0.1';
const port = 1337;

const $requests = new Subject();

const endpoint = $requests =>
	$requests.pipe(
		tap(({req, res}) => res.write("hola")),
	);

endpoint($requests).subscribe(({req, res}) => {
	res.end();
});

http.createServer((req, res) => {
	$requests.next({ req: req, res: res });
	console.log(req.url);
}).listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});