# reactive-microservices-framework
A exploratory project to build a simple reactive microservices framework in node

## Philosophy
The today's world is async, parallel, interderminist. 

Your microservice call your fraud service while other call in parallel is checking the stock microservice. Just before it ends, user cancel the purchase.

The classic approach of async programming in Node (async/await, promisis) do
 not fit modern problems of task cancelation, joining jobs, event throttling,... It requieres a lot of code and it's hard to test.
 
 With reactive programming, you can see a microservice like a big operator. It recieves a stream of HTTP requets, perform actions with the request and it returns a stream of HTTP responses.
 
 ## The solution
 
 (Proposal) Describe each microservice endpoint as an operator that operate on an Observable of ({req, res}) events and return an Observable of ({req, res}) event.
 
 Signature:
 
 ```
 function (request: Observable<{req, res}>): Observable<{req, res}>;
 ```
 
 Example:
 
```javascript
const purchaseEndPoint = request$ => request$.pipe(
	filter(request => request.req.method === 'GET' && request.req.url === '/purchase'),
	delay(1000)
	do(request => request.res.write('Hello World!'))
);
```
 
 ### License
 
 MIT