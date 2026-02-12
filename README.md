# AI Taralog — Final Project (Web Technologies Backend)

> AI Taralog is a full-stack web application where users can register/login and create tarot readings.

The backend is built with Node.js, Express, and MongoDB Atlas. Readings are stored securely per user using JWT authentication.



## Tech Stack
- Node.js + Express
- MongoDB Atlas + Mongoose
- JWT Authentication
- bcrypt (password hashing)
- Joi (validation)
- React + TypeScript + Vite (frontend)
- Tailwind CSS + Framer Motion (UI/animations)
- xAI Grok API (AI interpretations)
- Tarot API (card data)



## External APIs & Integrations

### Tarot Cards API

We use the free **[Tarot API](https://tarotapi.dev/)** to fetch tarot card data.

| Endpoint | Description |
|----------|-------------|
| `GET https://tarotapi.dev/api/v1/cards` | Returns all 78 tarot cards with names, meanings (upright/reversed), and descriptions |
| `GET https://tarotapi.dev/api/v1/cards/random?n=5` | Returns N random cards for a spread |

**Card data structure:**
```json
{
  "name": "The Magician",
  "name_short": "ar01",
  "type": "major",
  "meaning_up": "Skill, diplomacy, address...",
  "meaning_rev": "Physician, Magus, mental disease...",
  "desc": "A youthful figure in the robe of a magician..."
}
```

Card images are fetched from **Sacred Texts** archive:
```
https://sacred-texts.com/tarot/pkt/img/{name_short}.jpg
```

### xAI Grok API (AI Interpretation)

We use **[xAI Grok](https://x.ai/)** for generating personalized tarot interpretations.

**Integration:** `@ai-sdk/xai` library (Vercel AI SDK)

**Model:** `grok-4.1-reasoning`

**Environment variable:** `XAI_API_KEY`

**How it works:**

1. **System prompts** are stored in MongoDB (`Prompt` collection) and loaded by reading type (taro, love, money, work, general)

2. **Context Builder** (`services/contextBuilder.service.js`) constructs user message with:
   - User data: name, gender, birth date/place/time
   - Language preference (Russian/English)
   - Question (if applicable)
   - Cards with positions (for tarot spread)
   - Partner data (for love readings)

3. **Grok API Service** (`services/grokApi.service.js`) sends request:
```javascript
const result = await generateText({
  model: this.xai('grok-4.1-reasoning'),
  system: systemPrompt,   
  prompt: userMessage,   
});
```

**Tarot Spread Layout (Five Card Cross):**
```
        [Past]
[You Now]  [Future]
       [Present]
        [Advice]
```

### Admin Statistics

Statistics endpoint (`GET /api/admin/stats`) aggregates data from Users and Readings collections.

**Metrics calculated:**

| Metric | Description |
|--------|-------------|
| `totalUsers` | Total registered users |
| `totalReadings` | Total readings created |
| `genderStats` | Users distribution by gender (male/female/other) |
| `ageGroups` | Users distribution by age (18-24, 25-34, 35-44, 45-54, 55+) |
| `readingTypes` | Total requests per type (taro, love, money, work, general) |
| `uniqueUsersByType` | Unique users count per reading type |
| `readingsByGender` | Readings distribution by user gender |
| `readingsByAge` | Readings distribution by user age group |
| `dailyReadings` | Daily activity for last 30 days |

**Age calculation:**
```javascript
const getAge = (birthDate) => {
  const birth = new Date(birthDate);
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
};
```

**Response example:**
```json
{
  "totalUsers": 150,
  "totalReadings": 523,
  "genderStats": { "male": 45, "female": 98, "other": 7 },
  "ageGroups": { "18-24": 52, "25-34": 67, "35-44": 21, "45-54": 8, "55+": 2 },
  "readingTypes": { "taro": 234, "love": 156, "money": 78, "work": 45, "general": 10 },
  "uniqueUsersByType": { "taro": 89, "love": 72, "money": 45, "work": 30, "general": 8 },
  "readingsByGender": { "male": 156, "female": 345, "other": 22 },
  "readingsByAge": { "18-24": 198, "25-34": 234, "35-44": 67, "45-54": 20, "55+": 4 },
  "dailyReadings": { "2026-02-10": 15, "2026-02-11": 23, "2026-02-12": 18 }
}
```



## Project Features

### Core
- Register / Login with encrypted passwords (bcrypt)
- JWT authentication (protected endpoints)
- User profile management (GET/PUT)
- Readings CRUD (Create / List / Get by ID / Update / Delete)
- Validation with Joi
- Global error handling middleware
- Responsive pages served from `views/` with static assets in `public/`

### Integrations (Implemented)
- Tarot Cards API integration (tarotapi.dev) — fetch 78 cards data for spreads
- xAI Grok API integration — AI-powered personalized interpretations
- Email notifications (Nodemailer) — welcome email on registration
- Role-Based Access Control (RBAC) — admin panel for prompts, users, statistics



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

### Penkova Evelina (Integrations & Frontend)
- Tarot Cards API integration (tarotapi.dev — 78 cards with images)
- xAI Grok API integration (@ai-sdk/xai — AI interpretations)
- Context Builder service (user data, cards, partner info)
- Prompt management system (MongoDB storage, admin CRUD)
- Admin panel (users management, statistics, prompts editor)
- React + TypeScript frontend (Vite, Tailwind CSS, Framer Motion)
- Responsive UI with magical theme and animations
- Multi-language support (Russian/English)
- Deployment (Docker, DigitalOcean)



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
XAI_API_KEY=<YOUR_XAI_API_KEY>

# Optional: Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<YOUR_EMAIL>
SMTP_PASS=<YOUR_APP_PASSWORD>
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