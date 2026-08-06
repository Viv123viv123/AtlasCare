// routes/services.js
import express from "express";
import multer from "multer";
import adminAuth from "../middlewares/adminAuth.js";
import {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";

const upload = multer({ dest: "/tmp" }); // same as your existing setup (or change to suit)

const serviceRouter = express.Router();

// Public routes
serviceRouter.get("/", getServices);
serviceRouter.get("/:id", getServiceById);

// Create service (multipart form; image field name is "image")
serviceRouter.post("/", adminAuth, upload.single("image"), createService);

// Update service (multipart form; image field name is "image")
serviceRouter.put("/:id", adminAuth, upload.single("image"), updateService);

// Delete
serviceRouter.delete("/:id", adminAuth, deleteService);

export default serviceRouter;
