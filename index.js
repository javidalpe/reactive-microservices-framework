const express = require("express");
const Subject = require("rxjs/internal/Subject").Subject;
const tap = require("rxjs/operators/tap").tap;
const mergeMap = require("rxjs/operators/mergeMap").mergeMap;
const filter = require("rxjs/operators/filter").filter;
const mapTo = require("rxjs/operators/mapTo").mapTo;
const request = require("universal-rxjs-ajax").request;

const observableMiddleware = epics => {
  const requests$ = new Subject();
  epics.forEach(e => e(requests$).subscribe(({ req, res }) => {console.log("epico")}));
  return (req, res, next) => {
    requests$.next({ req, res });
    next();
  };
};

const welcomeEndpoint = $requests =>
  $requests.pipe(
    filter(({ req }) => (req.url === "/")),
    tap(({ req, res }) => res.send("welcome"))
  );

const userEndpoint = $requests =>
	$requests.pipe(
		filter(({ req }) => (req.url === "/user")),
		tap(({ req, res }) => res.send("user"))
	);

const searchEndpoint = $requests =>
	$requests.pipe(
		filter(({ req }) => (req.url === "/search")),
		mergeMap(({ req, res }) =>
			request({
				url: `https://api.github.com/search/users?q=javidalpe   `
			}).pipe(
				tap(response => res.send(JSON.stringify(response.response.items))),
				mapTo({ req, res })
			)
		)
	);

const app = express();
app.use(observableMiddleware([welcomeEndpoint, userEndpoint, searchEndpoint]));
app.listen(3000, function() {
  console.log("Example app listening on http://localhost:3000!");
});
