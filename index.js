const http = require('http');
const Subject = require("rxjs/internal/Subject").Subject;
const tap = require("rxjs/operators/tap").tap;
const map = require("rxjs/operators/map").map;
const of = require("rxjs/observable/of").of;
const hostname = '127.0.0.1';
const port = 1337;

const routes = {};

addEndPoint = (url, epic) => {
	const requests$ = new Subject();
	epic(requests$).subscribe(({req, res}) => {
		res.end();
	});
	routes[url] = requests$;
}

addEndPoint("/", $requests =>
	$requests.pipe(
		tap(({req, res}) => res.write("welcome")),
	)
);


addEndPoint("/purchase", $requests =>
	$requests.pipe(
		tap(({req, res}) => res.write("purchase")),
	)
);

addEndPoint("/methods", $requests =>
	$requests.pipe(
		tap(({req, res}) => res.write("methods")),
	)
);


addEndPoint("/users", $requests =>
	$requests.pipe(
		tap(({req, res}) => {
			ajax("https://api.github.com/search/repositories?q=tetris+language:assembly&sort=stars&order=desc")
			res.write("create")
		}),
	)
);



http.createServer((req, res) => {
	if (routes.hasOwnProperty(req.url)) {
		routes[req.url].next({req: req, res: res});
	}

	//$requests.next({req: req, res: res});
	console.log(req.url);
}).listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});