# Pixelwand Backend Assessment

This is a complete authentication api app for users to register, login and includes sample protected route and includes refresh token mechanism.

## Installation

Use npm to install the project

```bash
git clone https://github.com/sak-90/pixelwand_backend_assessment.git
```

Replace .env.example with .env and mention MONGO_DB_URL and PORT for the server to operate on.

```bash
npm install
nodemon server.js
```
To run test 
```bash
npm test
```
This will run the tests written using mocha.

## API routes

```http
POST /user/register
POST /user/login
POST /user/logout
POST /user/refresh-auth-token
GET /user/auth-sample-test
```
## License

[MIT](https://choosealicense.com/licenses/mit/)
