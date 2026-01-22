# Basi Login System

This project is a Node.js + Ecpress API that implements the core authentication features for a company (Innovate Inc.). It provides endpoints for user registration and login, securely storing passwords and issuing JSON Web Tokens (JWTs). for authenticated users.

## Features:

- User registration with username, email, and password via POST /api/users/register.

- Password hashing using a Mongoose pre-save hook and bcrypt before storing in MongoDB.
​
- User login with email and password via POST /api/users/login.
​
- Credential validation with an isCorrectPassword instance method (or bcrypt.compare).
​
- JWT generation on successful login, with a payload containing non-sensitive user data like _id and username.
​
- Proper handling of invalid credentials with generic error responses (e.g., “Incorrect email or password.”).

## Stack and Dependencies:

- Runtime: Node.js, Express.
​
- Database: MongoDB Atlas, connected via Mongoose.
​
- Security: bcrypt for hashing passwords and jsonwebtoken for issuing JWTs.
​
- Configuration: dotenv for managing environment variables (MONGO_URI, JWT_SECRET, PORT).

## API Endpoints

Method	 Endpoint	             Description

POST	 /api/users/register	 Register a new user with a hashed password.
​
POST	 /api/users/login	     Validate credentials and return a signed JWT.
​
Both endpoints respond with user data excluding the password, and the login route rejects non-existent users or incorrect passwords with a 400 status and a generic message.
