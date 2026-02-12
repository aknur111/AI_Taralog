# AI Taralog — Final Project (Web Technologies Backend)

> AI Taralog is a full-stack web application where users can register/login and create tarot readings.

The backend is built with Node.js, Express, and MongoDB Atlas. Readings are stored securely per user using JWT authentication.



## Tech Stack
- Node.js + Express
- MongoDB Atlas + Mongoose
- JWT Authentication
- bcrypt (password hashing)
- Joi (validation)
- Basic frontend: HTML in `views/`, static files in `public/`



## Project Features

### Core
- Register / Login with encrypted passwords (bcrypt)
- JWT authentication (protected endpoints)
- User profile management (GET/PUT)
- Readings CRUD (Create / List / Get by ID / Update / Delete)
- Validation with Joi
- Global error handling middleware
- Responsive pages served from `views/` with static assets in `public/`

### Planned / In Progress
- Tarot Cards API integration (fetch card data for spreads)
- AI interpretation service (generate reading interpretation)
- Optional: Role-Based Access Control (RBAC) and Email notifications
- Deployment URL + final screenshots



## Team Members & Responsibilities

### Salemkan Aknur(Backend Core & Security)
- Express server setup and modular structure
- MongoDB Atlas connection + environment variables
- User & Reading schemas (Mongoose)
- Auth endpoints (register/login), bcrypt hashing, JWT token generation
- JWT middleware (protect private endpoints)
- User profile endpoints (GET/PUT)
- Readings CRUD endpoints (owner/admin access rules)
- Validation (Joi) + global error handler
- README screenshots

### Penlova Evelina (Integrations & Frontend Enhancements)
- Tarot Cards external API integration (cards data)
- AI interpretation integration (LLM/AI service)
- Maps API integration (if used in UI)
- Frontend UI improvements (views/public)
- Optional: Email service integration
- Delpoyment



## Setup Instructions

### 1) Install Dependencies
> Run these commands inside the folder that contains `package.json` (in our project this is `src/`).

```bash
cd src
npm install
```

### 2) Create .env

Create a file src/.env and add (you can also see .env.example):

```
PORT=3000
MONGO_URI=mongodb+srv://<DB_USER>:<DB_PASSWORD>@<CLUSTER_URL>/ai_taralog?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=<YOUR_RANDOM_SECRET>

```

**Notes:**

- Use MongoDB Atlas (not localhost)

- If connection fails, make sure Atlas IP Access List allows your IP (for testing you can allow 0.0.0.0/0).

- If your network has IPv6/DNS issues, the project uses family: 4 in the DB connection to force IPv4.

### 3) Run the Project
```
npm run dev
```

*Server should start:*

```
MongoDB connected

Server running: http://localhost:3000
```

*Folder Structure*

```
src/
  app.js
  server.js
  config/
  controllers/
  middleware/
  models/
  routes/
  validators/
  views/
  public/
```

- views/ contains HTML pages (index/login/register/etc.)

- public/ contains static assets: css/ and js/

- routes/ + controllers/ handle API endpoints

- models/ contain MongoDB schemas (User, Reading)

- middleware/ contains auth, validation, and error middleware


## API Documentation
### Health Check (Public)

- GET /health

Returns { "status": "ok" }



### Auth (Public)

- POST /api/auth/register

Registers a new user (password is hashed with bcrypt)

Body:
```
{
  "username": "testuser",
  "email": "test@mail.com",
  "password": "123456"
}

```


- POST /api/auth/login


Authenticates user and returns JWT token

Body:
```
{
  "email": "test@mail.com",
  "password": "123456"
}
```

Response:
```
{ "token": "JWT_TOKEN_HERE" }
```

### User (Private - requires JWT)

Add header: Authorization: Bearer <TOKEN>

- GET /api/users/profile
Returns logged-in user profile (without password)

- PUT /api/users/profile
Updates logged-in user profile

Body example:
```
{
  "username": "newname",
  "email": "new@mail.com"
}
```

### Readings (Private - requires JWT)

Add header: Authorization: Bearer <TOKEN>

- POST /api/readings
Creates a new reading for the logged-in user

Body:
```
{
  "spreadType": "single",
  "question": "What should I focus on this week?"
}
```

- GET /api/readings

Returns all readings for the logged-in user

- GET /api/readings/:id

Returns a specific reading by ID (owner/admin only)

- PUT /api/readings/:id

Updates a reading (owner/admin only)


Body example:
```
{
  "question": "Updated question"
}
```

- DELETE /api/readings/:id

Deletes a reading (owner/admin only)

## Validation & Error Handling

Validation is implemented using Joi (e.g., password min length, email format).

Error responses include meaningful status codes:

- 400 for validation errors / bad request

- 401 for missing/invalid token

- 403 for forbidden access

- 404 for not found routes/resources

- 500 for unexpected server errors

## Screenshots

### Web Application

#### Main page
![main](./screenshots/main.png)

#### Tarot card spread
![taro](./screenshots/taro.png)

#### Waiting for AI response
![response_waiting](./screenshots/response_waiting.png)

#### AI interpretation
![response](./screenshots/response.png)

#### Question page
![question](./screenshots/question.png)

#### Reading history
![history](./screenshots/history.png)

#### History details
![data_in_history](./screenshots/data_in_history.png)

#### Admin: Users management
![users](./screenshots/users.png)

#### Admin: Statistics
![statistics](./screenshots/statistics.png)

#### Admin: Prompts management
![prompts](./screenshots/prompts.png)

---

### API tests (Postman)

#### Health check
![check_health](./screenshots/check_health.png)

#### Registration success
![registration_success](./screenshots/registration_success.png)

#### Registration: weak password (validation)
![registration_weak_password](./screenshots/registration_weak_password.png)

#### Registration: user already exists
![user_already_exists_error](./screenshots/user_already_exists_error.png)

#### Login
![log_in_user](./screenshots/log_in_user.png)

#### Get profile (authorized)
![get_user_me](./screenshots/get_user_me.png)

#### Get profile (without token)
![get_user_me_without_token](./screenshots/get_user_me_without_token.png)

#### Email: registration message
![email_message_registration](./screenshots/email_message_registration2.png)

#### Email: sending test
![email_sending_test](./screenshots/email_sending_test.png)

### Readings

#### Create reading (base)
![create_readings](./screenshots/create_readings.png)

#### Create taro reading
![create_readings_taro](./screenshots/create_readings_taro.png)

#### Create love reading
![create_readings_love](./screenshots/create_readings_love.png)

#### Create money reading
![create_reading_money](./screenshots/create_reading_money.png)

#### Create work reading
![create_readings_work](./screenshots/create_readings_work.png)

#### Create general question reading
![readings_general_question](./screenshots/readings_general_question.png)

#### Get all readings
![get_readings](./screenshots/get_readings.png)

#### Get reading by ID
![get_readings_by_id](./screenshots/get_readings_by_id.png)

#### Update reading
![update_the_readings](./screenshots/update_the_readings.png)

#### Delete reading
![delete_the_readings](./screenshots/delete_the_readings.png)



## Deployed URL

http://167.172.217.212:3000 

### License

This project is for educational purposes (Final Project).

### Authors
- Salemkan Aknur

- Penkova Evelina