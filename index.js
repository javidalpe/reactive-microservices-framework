const http = require("http");
const Subject = require("rxjs/internal/Subject").Subject;
const tap = require("rxjs/operators/tap").tap;
const mergeMap = require("rxjs/operators/mergeMap").mergeMap;
const mapTo = require("rxjs/operators/mapTo").mapTo;
const request = require("universal-rxjs-ajax").request;

const hostname = "127.0.0.1";
const port = 1337;

const routes = {};

addEndPoint = (url, epic) => {
  const requests$ = new Subject();
  epic(requests$).subscribe(({ req, res }) => {
    res.end();
  });
  routes[url] = requests$;
};

addEndPoint("/", $requests =>
  $requests.pipe(tap(({ req, res }) => res.write("welcome")))
);

addEndPoint("/purchase", $requests =>
  $requests.pipe(tap(({ req, res }) => res.write("purchase")))
);

addEndPoint("/methods", $requests =>
  $requests.pipe(tap(({ req, res }) => res.write("methods")))
);

addEndPoint("/users", $requests =>
  $requests.pipe(
    mergeMap(({ req, res }) =>
      request({
        url: `https://api.github.com/search/users?q=javidalpe`
      }).pipe(
        tap(response => res.write(JSON.stringify(response.response.items))),
        mapTo({ req, res })
      )
    )
  )
);

http
  .createServer((req, res) => {
    if (routes.hasOwnProperty(req.url)) {
      routes[req.url].next({ req, res });
    } else {
      res.statusCode = 404;
      res.end();
    }

    // $requests.next({req: req, res: res});
    console.log(req.url);
  })
  .listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
