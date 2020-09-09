# ESE2020 Scaffolding Backend

## TODO	
- links to readinglist?
- readinglist
	- [tsconfig](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)
	- [alternative example repo](https://github.com/maximegris/typescript-express-sequelize)

This part of the repository serves as a template for common problems you will face as a backend developer during your project. It is by no means complete but should give you a broad overview over the frameworks, libraries and technologies used:

- [typescript](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-oop.html)
- [express](https://expressjs.com/de/)
- [sequelize](https://sequelize.org/master/index.html)
- [jwt](https://jwt.io/)
- [bcrypt](https://www.npmjs.com/package/bcrypt)

We tried to show you different approaches how your backend may be structured, however you are free to follow your own principles.
Notice the differences between the [UserController](./src/controllers/user.controller.ts) and e.g. [TodoItemController](./src/controllers/todoitem.controller.ts). 

1. The logic is split up:
	- authorizing a request is done via middleware
	- logic e.g. creating/authentication is done via [UserService](./src/services/user.service.ts)
2. The controller itself is structured as a class.

Note that the `UserController`-approach is more suited for bigger architectures and for typescript applications. You may choose any aproach you wish, but make sure your code is well structured.

## Start
- clone this repository
- navigate to the backend folder `cd ese2020-project-scaffolding/backend`
- run `npm install`
- run `npm start`
- open your browser with the url [http://localhost:3000](http://localhost:3000/)
- to run the server with nodemon you can run `npm run dev` in your console (in the backend folder)

## Jump straight to example for

- [middleware](./middlewares/checkAuth.ts)
- Login: 
	- [service](./services/user.service.ts)
	- [controller](./controllers/user.controller.ts)
- Registration:
	- [service](./services/user.service.ts)
	- [controller](./controllers/user.controller.ts)
- [crud](./controllers/todolist.controller.ts)
- [typescript config](./tsconfig.json)
- [routing](./controllers)
- [API construction](./server.ts)

## Endpoints
Some endpoints can be called in a [browser](http://localhost:3000), others have to be called by a REST Client. [Here](./postman_collection) you can find a collection that contains all requests, which you can import with Postman. [Postman](https://www.postman.com/) is a REST Client.

### `/todoitem`
#### POST

<details>
	<summary>Request</summary>

```json
	{
		"name": "string",
		"done": "boolean",
		"todoListId":"number"
	}
```

</details>


<details>
	<summary>Response</summary>

	Code: 200
	Body:

```json
{
	"todoItemId": "number",
	"name": "string",
	"done": "boolean",
	"todoListId":"number"
}
```
</details>

#### DELETE `/:id`
Status: 200

### `/todolist`
#### POST
<details>
	<summary>Request</summary>

	Code: 200
	Body:
```json
{
	"name":"string"
}

```
</details>
<details>
	<summary>Response</summary>

	Code: 200
	Body:
```json
{
	"todoListId": "number",
	"name":"string"
}

```
</details>

#### DELETE `/:id`
Status: 200

#### GET
<details>
	<summary>Response</summary>

	Code: 200
	Body:
```json
{
	"todoListId": "number",
	"name":"string",
	"todoItems":"TodoItem[]"
}
```
</details>

### `/user`
#### POST `/register`
<details>
	<summary>Request</summary>

	Code: 200
	Body:
```json
{
	"userName":"string",
	"password":"stiring"
}

```
</details>
<details>
	<summary>Response</summary>

	Code: 200
	Body:
```json
{
	"userId": "number",
	"userName":"string",
	"password":"string(hashed)"
}

```
</details>

#### POST `/login`
<details>
	<summary>Request</summary>

	Code: 200
	Body:
```json
{
	"userName":"string",
	"password":"string"
}

```
</details>
<details>
	<summary>Response</summary>

	Code: 200 || 403
	Body:
```json
{
	"user": {
		"userId":"string",
		"userName":"string",
		"password":"stirng(hashed)"
	},
	"token":"string"
}

```
</details>

#### GET
<details>
	<summary>Response</summary>

	Code: 200
	Body:
```json
[
	{
		"userId":"string",
		"userName":"string",
		"password":"stirng(hashed)"
	},
	{
		"userId":"string",
		"userName":"string",
		"password":"stirng(hashed)"
	},
	...
]

```
</details>

### `/secured`
#### GET
	
	Request

	Header: Authorization: Bearer  + <token>

<details>
	<summary>Response</summary>

	Code: 200 | 403
	Body:
```json
{
	"message":"string"
}

```
</details>

### `/`
<details>
	<summary>Response</summary>

	Code: 200
	Body:
```text
<h1>Welcome to the ESE-2020 Course</h1><span style=\"font-size:100px;\">&#127881;</span>
```
</details>