# reactive-microservices-framework
A exploratory project to build a simple reactive microservices framework in node

## Philosophy
The today's world is async, parallel, interderminist. 

Your microservice calls your fraud service while other call in parallel is checking the stock microservice. Just before it ends, the user cancel the purchase.

The classic approach of async programming in Node (async/await, promisis) do
 not fit modern problems of task cancelation, join parallel processing, event throttling,... It requieres a lot of code and it's hard to test.
 
With reactive programming, you can see a microservice like a big operator. It recieves a stream of HTTP requets, perform actions with the request and it returns a stream of HTTP responses.
 
## The solution
 
(Actual Proposal)

Describe each microservice endpoint as a function which takes a stream of {request, response} and returns a stream of {request, response}. Requests in, responses out.
 
Signature:
 
 ```
 function (request: Observable<{req, res}>): Observable<{req, res}>;
 ```
 
 Example:
 
```javascript
const pingEndpoint = $requests =>
	$requests.pipe(
		filter(({req}) => (req.url === "/ping")),
		tap(({res}) => res.send("pong"))
	);
```

## Usage

This project is only compatible with [Express](https://expressjs.com/).

1. Install the package. Not available yet.
1. Import all your endpoints into a single array.
	```javascript
	const endpoints = [pingEndpoint, userEndpoint, searchEndpoint];
	``` 
1. Given a Express app, use ```observableMiddleware()``` to attach all your endpoints as a middleware.
	```javascript
	const app = express();
	app.use(observableMiddleware(endpoints));
	``` 
 
### Testing (WIP)
RxJS comes with a TestScheduler that is used to virtualize time, making writing deterministic tests easier and much faster since time is virtual--you don't have to wait for real time to pass.

In RxJS v6 there is a new testScheduler.run(callback) helper that provides several new convienences on top of the previous TestScheduler behavior. 
 
 
### License

MIT