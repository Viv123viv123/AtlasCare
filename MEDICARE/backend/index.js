import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { connectDB } from './config/db.js';

// ⭐ ADD CLERK MIDDLEWARE
import { clerkMiddleware } from "@clerk/express";
import appointmentRouter from './routes/appointmentRouter.js';
import doctorRouter from './routes/doctorRouter.js';
import serviceRouter from './routes/serviceRoutes.js';
import serviceAppointmentRouter from './routes/serviceAppointmentRouter.js'; 
import webhookRouter from './routes/webhookRouter.js';

const app = express();
const port = process.env.PORT || 4000;

// ⭐ IMPORTANT: ALLOW BOTH LOCAL AND PRODUCTION VERCEL ORIGINS
const allowedOrigins = [
  "http://localhost:5173",                 // Local User Frontend
  "http://localhost:5174",                 // Local Admin Dashboard
  "http://127.0.0.1:5173",                 // Local alternative loopback
  "http://127.0.0.1:5174",                 // Local alternative loopback
  "https://atlas-care-alpha.vercel.app",   // Production User Frontend
  "https://atlascare-admin.vercel.app"     // Production Admin Dashboard
];

app.use(
  cors({
    origin: function (origin, callback) {
        // allow server-to-server & tools like Postman (no origin)
        if (!origin) return callback(null, true);

        // Allow any localhost origin during development (different ports / loopbacks)
        const isLocalhost = /^(https?:\/\/)?(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
        if (process.env.NODE_ENV !== 'production' && isLocalhost) {
          console.log(`CORS: allowing localhost origin ${origin}`);
          return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }

        console.warn(`CORS: blocked origin ${origin}`);
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true, // ✅ REQUIRED for cookies / Clerk
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "stripe-signature"],
  })
);


// ⭐ Use Clerk middleware globally (does NOT protect routes)
app.use(clerkMiddleware());

// ⭐ Stripe Webhook Route (MUST use express.raw BEFORE express.json)
app.use("/api/webhook", express.raw({ type: "application/json" }), webhookRouter);

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

// Database Connection
connectDB();

// Static uploads folder


// Routes (unchanged)
app.use("/api/appointments", appointmentRouter);
app.use("/api/doctors", doctorRouter);
app.use("/api/services", serviceRouter);
app.use("/api/service-appointments", serviceAppointmentRouter);

// Test route
app.get('/', (req, res) => {
    res.send('API Working ');
});

app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`);
});
