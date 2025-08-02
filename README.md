
---

# 🚖 Ride Booking API

## 🎯 Project Overview

The **Ride Booking API** is a fully featured, secure, and scalable backend system inspired by ride-sharing platforms like **Uber** or **Pathao**.

Built using **Express.js**, **Mongoose**, and **TypeScript**, it supports role-based access control for:

* 🧍 Riders: Request/cancel rides and track history
* 🚗 Drivers: Accept, update, and complete rides
* 🛡 Admins: Manage users, approve drivers, and oversee the system

---

## 📚 Table of Contents

* [Features](#-features)
* [Live Server](#-live-server)
* [Installation](#-installation)
* [Usage](#-usage)
* [API Endpoints](#-api-endpoints)
* [Project Structure](#-project-structure)
* [Environment Variables](#-environment-variables)
* [Example Requests](#-example-requests)
* [Troubleshooting](#-troubleshooting)
* [Contributors](#-contributors)
* [License](#-license)

---

## ✨ Features

* ✅ **JWT Authentication** (Admin, Rider, Driver)
* ✅ **Secure Password Hashing** with Bcrypt
* ✅ **Role-Based Access Control Middleware**
* ✅ **Ride Lifecycle**: Request → Accept → Pickup → Transit → Complete
* ✅ **Driver Availability & Earnings Tracking**
* ✅ **User Management** (block/unblock, approve/suspend drivers)
* ✅ **Ride History & Status Logging**
* ✅ **Clean Modular Architecture** with Scalability in Mind

---

## 🌐 Live Server

* **API Base URL**:
  `https://ride-booking-api.onrender.com/api/v1`

* **Test Endpoint**:
  `https://ride-booking-api.onrender.com/`

---

## 🧑‍💻 Installation

```bash
git clone https://github.com/yourusername/ride-booking-api.git
cd ride-booking-api
npm install
npm run dev
```

> ✅ Node.js ≥ 16.x and MongoDB required

---

## 🚀 Usage

Start development server:

```bash
npm run dev
```

Production build:

```bash
npm run build
npm start
```

Code linting and formatting:

```bash
npm run lint:check
npm run prettier:check
```

---

## 🔗 API Endpoints

### 🔐 Auth

| Method | Endpoint                |
| ------ | ----------------------- |
| POST   | `/auth/register`        |
| POST   | `/auth/verify-email`    |
| POST   | `/auth/login`           |
| POST   | `/auth/forget-password` |
| POST   | `/auth/change-password` |

---

### 👤 User (Admin)

| Method      | Endpoint                        |
| ----------- | ------------------------------- |
| GET         | `/user/profile`                 |
| GET         | `/user/admin/users`             |
| PATCH       | `/user/admin/users/block/:id`   |
| PATCH       | `/user/admin/users/unblock/:id` |
| GET         | `/user/admin/users/:id`         |
| GET / PATCH | `/user/admin/system/settings`   |

---

### 🧍 Rider

| Method | Endpoint             |
| ------ | -------------------- |
| POST   | `/rider/request`     |
| PATCH  | `/rider/:id/cancel`  |
| PATCH  | `/rider/:id/pay`     |
| GET    | `/rider/all-rides`   |
| GET    | `/rider/admin/rides` |

---

### 🚗 Driver

| Method | Endpoint                            |
| ------ | ----------------------------------- |
| POST   | `/driver/create-profile`            |
| PATCH  | `/driver/update-profile`            |
| PATCH  | `/driver/admin/drivers/approve/:id` |
| PATCH  | `/driver/admin/drivers/suspend/:id` |
| PATCH  | `/driver/availability`              |
| PATCH  | `/driver/rides/:id/accept`          |
| PATCH  | `/driver/rides/:id/reject`          |
| PATCH  | `/driver/rides/:id/status`          |
| GET    | `/driver/rides`                     |
| GET    | `/driver/profile`                   |
| GET    | `/driver/earnings`                  |

---

## 🗂 Project Structure

```
src/
├── app/
│   ├── builder/             # App builder & bootstrapping
│   ├── middlewares/         # Global middlewares
│   └── modules/             # Main feature modules
│       ├── auth/            # Auth and JWT logic
│       ├── driver/          # Driver workflows
│       ├── resetToken/      # Password reset token handling
│       ├── rider/           # Rider actions and rides
│       ├── systemsettings/  # Admin system configs
│       └── user/            # User & admin management
├── bd/                      # Database initialization/config
├── config/                  # Environment and app config
├── enums/                   # Application-wide enums
├── errors/                  # Custom error classes
├── helpers/                 # Helper utilities
├── middlewares/             # Role guards, error handling, auth checks
├── routes/                  # API routing logic
├── scripts/                 # Seeders or CLI tools
├── shared/                  # DTOs, shared constants
├── types/                   # Custom types and interfaces
├── util/                    # Utility functions, logging, formatting
├── app.ts                   # Express app instance
└── server.ts                # App entry point
```

---

## ⚙️ Environment Variables

`.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ride-booking
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
SUPER_ADMIN_EMAIL=superadmin@example.com
SUPER_ADMIN_PASSWORD=supersecurepassword
```

---

## 📌 Example Requests

### Register a Rider

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "rider@example.com",
  "password": "rider123",
  "role": "rider"
}
```

### Request a Ride (Rider)

```http
POST /api/v1/rider/request
Authorization: Bearer <JWT>

{
  "pickupLocation": { "lat": 23.8103, "lng": 90.4125 },
  "destinationLocation": { "lat": 23.7500, "lng": 90.3600 }
}
```

---

## 🧪 Testing & Documentation

* ✅ Tested thoroughly with **Postman**
* ✅ Endpoints return meaningful error codes and messages
* ✅ Recommended: Screen-recorded demo (\~5–10 mins)

---

## 🛠 Troubleshooting

| Problem                | Solution                                      |
| ---------------------- | --------------------------------------------- |
| MongoDB not connecting | Check your `MONGODB_URI` and DB status        |
| JWT expired            | Re-login to generate a new token              |
| Role denied            | Ensure you use correct Bearer token & headers |
| CORS error             | Enable CORS in Express config                 |

---

## 👨‍💻 Contributors

* **Your Name** – Backend Developer

---

## 🪪 License

Licensed under the **ISC License**.

---

