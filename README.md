# MEDICARE Project

[MEDICARE Frontend Website](https://atlas-care-alpha.vercel.app), a healthcare service booking application with a separate [Admin Dashboard Portal](https://atlascare-admin.vercel.app) and an Express/MongoDB backend ([Backend API](https://atlascare-backend-pol4.onrender.com)).

## Project Structure

- `backend/` — Node.js + Express API server
- `frontend/` — User-facing React + Vite application
- `admin/` — Admin dashboard React + Vite application

## Key Features

- Patient appointment booking
- Doctor management and availability toggling
- Service management and service appointment booking
- Stripe online payments
- Clerk authentication for secure user sessions
- Cloudinary image uploads for doctor/service assets
- MongoDB database with Mongoose models

## Backend Overview

The backend is located in `backend/` and exposes APIs for:

- `/api/doctors`
  - `GET /` list doctors
  - `GET /:id` get doctor by id
  - `POST /` create doctor (image upload via multipart)
  - `PUT /:id` update doctor (protected)
  - `POST /:id/toggle-availability` toggle doctor availability (protected)
  - `POST /login` doctor login

- `/api/appointments`
  - `GET /` list appointments
  - `GET /confirm` confirm Stripe payment
  - `GET /stats/summary` appointment summary stats
  - `POST /` create appointment (Clerk auth required)
  - `GET /me` list current patient appointments (Clerk auth required)
  - `GET /doctor/:doctorId` appointments for a doctor
  - `POST /:id/cancel` cancel an appointment
  - `PUT /:id` update an appointment
  - `GET /paitents/count` patient count

- `/api/services`
  - `GET /` list services
  - `GET /:id` get service by id
  - `POST /` create service (image upload via multipart)
  - `PUT /:id` update service
  - `DELETE /:id` delete service

- `/api/service-appointments`
  - `GET /` list service appointments
  - `GET /confirm` confirm Stripe service payment
  - `GET /stats/summary` service appointment stats
  - `POST /` create service appointment (Clerk auth required)
  - `GET /me` list current patient service appointments (Clerk auth required)
  - `GET /:id` get service appointment by id
  - `PUT /:id` update service appointment
  - `POST /:id/cancel` cancel service appointment

## Environment Variables

Create a `.env` file in `backend/` with at least the following variables:

```env
MONGODB_URI=<your MongoDB connection string>
STRIPE_SECRET_KEY=<your Stripe secret key>
FRONTEND_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=<cloudinary cloud name>
CLOUDINARY_API_KEY=<cloudinary api key>
CLOUDINARY_API_SECRET=<cloudinary api secret>
MAJOR_ADMIN_ID=<optional admin identifier used by appointment fallback>
```

Also configure Clerk in both `frontend/` and `admin/` projects via Vite env:

- `VITE_CLERK_PUBLISHABLE_KEY=<your Clerk publishable key>`

If needed, add any additional Clerk variables required by your app.

## Getting Started

### Backend

```bash
cd backend
npm install
npm run dev
```

The backend listens on `http://localhost:4000` by default.

### User Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` by default.

### Admin Frontend

```bash
cd admin
npm install
npm run dev
```

The admin dashboard runs on `http://localhost:5174` by default.

## Notes

- The backend uses `cors` with approved origins for the frontend and admin apps.
- File uploads are handled with `multer` and forwarded to Cloudinary.
- Stripe payment sessions are created for online appointments and service appointments.
- Clerk middleware secures the patient-facing appointment creation and `/me` routes.

## Recommended Workflow

1. Start MongoDB or connect to Atlas.
2. Create `.env` in `backend/`.
3. Start the backend server.
4. Start `frontend` and `admin` clients.
5. Use the frontend to book appointments and the admin UI to manage doctors/services.

## Useful Commands

- `npm run dev` — start the app in development mode
- `npm run build` — build the frontend or admin app for production
- `npm run preview` — preview the production build locally
- `npm run lint` — run ESLint checks in frontend/admin

## Directory Notes

- `backend/controllers/` — business logic for appointments, doctors, services, and service appointments
- `backend/models/` — Mongoose schemas
- `backend/routes/` — API route definitions
- `backend/config/` — database configuration
- `backend/utils/` — Cloudinary helper functions
- `frontend/src/` — user-facing React application
- `admin/src/` — admin dashboard React application

## Contact

If you need to extend this project, update the route definitions and controller logic in `backend/`, and add or adjust pages in `frontend/src/pages/` and `admin/src/pages/`.
