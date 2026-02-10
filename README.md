# Workout Tracker

A full-stack web application for creating and managing workout routines. Built with Node.js, Express, MongoDB, and EJS.

---

## Features

- User authentication with JWT and bcrypt
- Role-based access control (user and admin)
- Create, edit, and delete workout routines
- Profile picture upload with Cloudinary
- Responsive design with Tailwind CSS
- MongoDB data relationships (users have workouts)

---

## Technologies

**Backend:** Node.js, Express, MongoDB, Mongoose  
**Authentication:** JWT, bcrypt  
**File Upload:** Cloudinary, Multer  
**Frontend:** EJS, Tailwind CSS

---

## Quick Start

1. **Clone and install**

Clone and install the github repo.

2. **Configure environment variables**

Create a `.env` file:

```env
MONGOOSE_URI=your_mongodb_connection_string
SECRET_TOKEN=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

3. **Seed the database**

Update the user ID in `src/utils/seed.js` with your own user ID, then run:

```bash
npm run seed
```

4. **Start the application**

```bash
npm start
```

Navigate to `http://localhost:3000`

---

## Project Structure

```
src/
├── config/          # Cloudinary configuration
├── controllers/     # Business logic (auth, users, workouts)
├── middleware/      # Authentication and authorization
├── models/          # MongoDB schemas (User, Workout)
├── routes/          # Express routes
├── utils/           # Database seed script
└── app.js           # Application entry point

views/
├── auth/            # Login and register pages
├── users/           # User profile and admin pages
├── workouts/        # Workout management pages
├── includes/        # Navigation partials
└── home.ejs         # Landing page
```

---

## Main Routes

### Public Routes

| Method | Route       | Description  |
| ------ | ----------- | ------------ |
| GET    | `/`         | Home page    |
| GET    | `/register` | Registration |
| GET    | `/login`    | Login        |

### Protected Routes (Authentication Required)

| Method | Route                      | Description       |
| ------ | -------------------------- | ----------------- |
| GET    | `/workouts`                | View all workouts |
| POST   | `/api/workouts`            | Create workout    |
| GET    | `/workouts/:id/edit`       | Edit workout      |
| POST   | `/api/workouts/:id/delete` | Delete workout    |
| GET    | `/profile/:id`             | User profile      |
| POST   | `/api/users/:id/edit`      | Update profile    |

### Admin Routes

| Method | Route                   | Description      |
| ------ | ----------------------- | ---------------- |
| GET    | `/users`                | View all users   |
| POST   | `/api/users/:id/role`   | Change user role |
| POST   | `/api/users/:id/delete` | Delete user      |

---

## User Roles

### User (Default)

- Create and manage their own workouts
- Edit their own profile
- Delete their own account

### Admin

- All user permissions
- View all users
- Change user roles
- Delete any user or workout

**To create an admin:** Register a user, then manually change the `role` field to `"admin"` in MongoDB.

---

## Database Models

### User

```javascript
{
  name: String,
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  role: String (user/admin),
  profilePicture: String,
  profilePictureId: String,
  workouts: [ObjectId]
}
```

### Workout

```javascript
{
  name: String,
  description: String,
  exercises: [String],
  duration: Number,
  difficulty: String (beginner/intermediate/advanced),
  createdBy: ObjectId
}
```

---

## Database Seeding

The seed script populates the database with 5 sample workouts.

**Before running:**

1. Register a user account
2. Copy your user's `_id` from MongoDB
3. Update `createdBy` in `src/utils/seed.js`

**Run:**

```bash
npm run seed
```

---

## Security

- Passwords hashed with bcrypt
- JWT tokens stored in HTTP-only cookies
- Role-based authorization middleware
- Input validation with Mongoose
- Protected routes requiring authentication

---

## NPM Scripts

```bash
npm start    # Start the application
npm run seed # Seed the database
```
