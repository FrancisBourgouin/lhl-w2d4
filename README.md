# W7D3 - Lecture - CRUD with Express

## Covered in this lecture

- Request and response cycles between client and server
- HTTP protocol: http statelessness, http verbs
- Express, a nodejs Web framework
- REST

[Full Content of the lecture](./content.md)

## Demo

We created a movie quotes app demonstrating the use of Express with RESTful routes.

1. created a register route

   -GET: display the register form

- POST:

- extract the user info from the form with req.body
- create a user in the database with those info
- set the user id in the cookies
- redirect to another page

2. pass the username in templateVars

- For each ejs that are using a variable called username
- the username must be passed in the templateVars of all the end points

### To run the app

- npm install
- npm run local
