#W2D3 - CRUD With Express

## We'll be covering

- Request/Response Cycle
- Why Express
- REST and HTTP protocol
- Demo

## Requests

### Client / Server request process

- Communication is one way

  - The server cannot ask the client for anything

- part of the request

  - method
  - url

- request has 2 parts
  - header
  - body

![Request/Response](./pictures/http_request.png)

## Why Express?

### Without Express

Without Express we would have to code at a much lower level. For example, we would have to decode the request and extract the url pattern using some regex and if statements.

Express handle all the basic functionalities for us and make our life much easier.

You already experiment with node http module and it was way more work. [Node HTTP](https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/)

### What is Express?

- Express is a Web framework for NodeJS
  - Routing
  - Layer on top of node HTTP server
  - Middleware
  - Template Engine(ejs)

## Resources

Resources for our movie quotes App

- quotes
- comments

## CRUD Operation

For each resource, we want to:

- create => creating a new resource
- read => getting a resource
- update => changing a resource
- delete => deleting a resource

## REST

Representational State Transfer

REST is a pattern, a convention to organize our url structure

- It should use http verbs to expres what the request wants to accomplish
- Resource information must be part of the url
- It uses common data formats (JSON for API)
- Communication is stateless
- Each request must pass all information needed to fulfill the request

### http methods

What language does a client use to makes request to the server ? http

http protocol gives us verbs

- Create => Create a new ressource => Post
- Read => Get a resource => Get
- Update => Change a resource => Put
- Delete => Delete a resource => Delete

### Scoping information

- collections vs single entity
- which one?

### Common Data Format

In the case of an API, what do we expect when we do

GET users => a list of users

```
[
  {id: 1,
  first_name: 'Clark',
  last_name: 'Ken',
  ...},
  {id: 2,
  first_name: 'Bruce',
  last_name: 'Wayne',
  ...},
]
```

### Communication is stateless

- The server doesn't remember the identity of the client that makes a request.
- Does not remember the state on the server

#### Why stateless

If the server maintains information about the clients it needs to use memory. When the server needs to handle thousands of client, you need to add more servers. However, how do you communicate the state of all the clients between servers?

Because servers does not maintain state information on clients, each request must pass all information needed to fulfill the request

### End Points

By following REST principles, it allows us to design our end points:

| Action                                | http verb | end point                |
| ------------------------------------- | --------- | ------------------------ |
| List all quotes                       | GET       | get '/quotes'            |
| Get a specific quote                  | GET       | get '/quotes/:id'        |
| Display the new form                  | GET       | get '/quotes/new         |
| Create a new quote                    | POST      | post '/quotes            |
| Display the form for updating a quote | GET       | get '/quotes/:id/update' |
| Update the quotes                     | PUT       | put '/quotes/:id         |
| Deleting a specific user              | DELETE    | delete '/quotes:id'      |

#### Nested Resources

You may need to access a nested resources. For example, you need to create a new comment.

| Action               | http verb | end point                  |
| -------------------- | --------- | -------------------------- |
| Create a new comment | POST      | post '/quotes/:id/comments |

## Demo

- creating the end points
- using method override
