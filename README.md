Here is a comprehensive and professional `README.md` for your **Ride Booking API** project:

---

# 🚖 Ride Booking API

## 🎯 Project Overview

A secure, scalable, and modular backend **REST API** built with **Express.js**, **Mongoose**, and **TypeScript** for a **ride booking system** similar to Uber or Pathao.

Supports role-based access control for **Admins**, **Riders**, and **Drivers**, covering everything from ride lifecycle management to driver approval workflows and user account control.

---

## 📚 Table of Contents

* [Features](#-features)
* [API Base URL](#-api-base-url)
* [Installation](#-installation)
* [Usage](#-usage)
* [API Endpoints](#-api-endpoints)

  * [Auth](#auth)
  * [User (Admin)](#user-admin)
  * [Rider](#rider)
  * [Driver](#driver)
* [Project Structure](#-project-structure)
* [Environment Variables](#-environment-variables)
* [Example Requests](#-example-requests)
* [Troubleshooting](#-troubleshooting)
* [Contributors](#-contributors)
* [License](#-license)

---

## ✨ Features

* 🔐 JWT-based authentication with `admin`, `rider`, and `driver` roles
* 🔒 Role-based route protection and middleware
* 🧍 Rider functionality: ride request, cancel, ride history
* 🚕 Driver functionality: accept/reject rides, set status, update ride, view earnings
* 🛡 Admin panel: manage users, approve/suspend drivers, system settings
* 📦 Modular codebase with validation, logging, and error handling
* 📜 Full ride lifecycle tracking and status transitions
* 🧠 Built-in logic for user blocks, driver approval, and ride cancellation rules

---

## 🌍 API Base URL

```
https://ride-booking-api.onrender.com/api/v1
```

---

## 🧑‍💻 Installation

```bash
git clone https://github.com/yourusername/ride-booking-api.git
cd ride-booking-api
npm install
npm run dev
```

> Requires Node.js ≥ 16.x and MongoDB

---

## 🚀 Usage

Run the development server:

```bash
npm run dev
```

Build and start production:

```bash
npm run build
npm start
```

Linting and formatting:

```bash
npm run lint:check
npm run prettier:check
```

---

## 🔗 API Endpoints

### ✅ Auth

| Method | Endpoint                | Description                 |
| ------ | ----------------------- | --------------------------- |
| POST   | `/auth/register`        | Register user               |
| POST   | `/auth/verify-email`    | Email verification          |
| POST   | `/auth/login`           | Login with role-based token |
| POST   | `/auth/forget-password` | Request password reset      |
| POST   | `/auth/change-password` | Change password             |

---

### 👤 User (Admin)

| Method | Endpoint                        | Description              |
| ------ | ------------------------------- | ------------------------ |
| GET    | `/user/profile`                 | Get current user profile |
| GET    | `/user/admin/users`             | View all users           |
| PATCH  | `/user/admin/users/block/:id`   | Block a user             |
| PATCH  | `/user/admin/users/unblock/:id` | Unblock a user           |
| GET    | `/user/admin/users/:id`         | Get user by ID           |
| GET    | `/user/admin/system/settings`   | System settings (view)   |
| PATCH  | `/user/admin/system/settings`   | Update settings          |

---

### 🧍 Rider

| Method | Endpoint             | Description             |
| ------ | -------------------- | ----------------------- |
| POST   | `/rider/request`     | Request a ride          |
| PATCH  | `/rider/:id/cancel`  | Cancel a ride           |
| PATCH  | `/rider/:id/pay`     | Pay for ride            |
| GET    | `/rider/all-rides`   | Rider's ride history    |
| GET    | `/rider/admin/rides` | Admin view of all rides |

---

### 🚗 Driver

| Method | Endpoint                            | Description             |
| ------ | ----------------------------------- | ----------------------- |
| POST   | `/driver/create-profile`            | Driver profile creation |
| PATCH  | `/driver/update-profile`            | Update profile          |
| PATCH  | `/driver/admin/drivers/approve/:id` | Approve driver          |
| PATCH  | `/driver/admin/drivers/suspend/:id` | Suspend driver          |
| PATCH  | `/driver/availability`              | Set online/offline      |
| PATCH  | `/driver/rides/:id/accept`          | Accept ride             |
| PATCH  | `/driver/rides/:id/reject`          | Reject ride             |
| PATCH  | `/driver/rides/:id/status`          | Update ride status      |
| GET    | `/driver/rides`                     | View assigned rides     |
| GET    | `/driver/profile`                   | View driver profile     |
| GET    | `/driver/earnings`                  | View earnings history   |

---

## 🗂 Project Structure

```
src/
├── modules/
│   ├── auth/          # Auth logic & controllers
│   ├── user/          # Admin and user management
│   ├── driver/        # Driver workflows and profiles
│   ├── rider/         # Rider actions and ride logic
├── middlewares/       # Role guards, error handlers
├── config/            # Env, DB, logging
├── utils/             # Helpers, validators
├── app.ts             # App setup
├── server.ts          # App entry point
```

---

## ⚙️ Environment Variables

Create a `.env` file:

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
{
  "email": "rider@example.com",
  "password": "pass123",
  "role": "rider"
}
```

### Request Ride

```http
POST /api/v1/rider/request
Authorization: Bearer <token>
{
  "pickupLocation": { "lat": 23.8103, "lng": 90.4125 },
  "destinationLocation": { "lat": 23.7500, "lng": 90.3600 }
}
```

---

## 🧪 Testing & Documentation

* ✅ Use [Postman](https://www.postman.com/) to test endpoints
* ✅ Document response codes and edge cases
* ✅ Record a **5–10 min** walkthrough video covering:

  * Project intro
  * Folder structure
  * Auth and roles
  * Core ride workflows
  * Admin controls
  * Postman demonstration

---

## 🛠 Troubleshooting

* **CORS issues?** Enable it in Express middleware.
* **MongoDB errors?** Ensure local/Atlas DB is connected and accessible.
* **Token expired?** Regenerate by re-logging in.

---

## 👨‍💻 Contributors

* \[Your Name] - Developer, System Architect

---

## 🪪 License

This project is licensed under the **ISC License**.

---

Would you like me to generate the Postman collection, OpenAPI (Swagger) YAML, or the script to create the super admin account automatically?
