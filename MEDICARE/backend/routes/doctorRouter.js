// routes/doctorRouter.js
import express from "express";
import multer from "multer";
import os from "os";

import {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  toggleAvailability,
} from "../controllers/doctorController.js";

import doctorAuth from "../middlewares/doctorAuth.js";
import adminAuth from "../middlewares/adminAuth.js";

// Use the OS temp directory so uploads work cross-platform (Windows/Linux/macOS)
const upload = multer({ dest: os.tmpdir() });

const doctorRouter = express.Router();




doctorRouter.get("/", getDoctors);
doctorRouter.get("/me", doctorAuth, (req, res) => {
  const doctor = req.doctor.toObject();
  delete doctor.password;
  res.json({ success: true, data: doctor });
});
doctorRouter.get("/:id", getDoctorById);
doctorRouter.post("/", adminAuth, upload.single("image"), createDoctor);
doctorRouter.put(
  "/:id",
  doctorAuth,
  upload.single("image"),
  updateDoctor
);
doctorRouter.post(
  "/:id/toggle-availability",
  doctorAuth,
  toggleAvailability
);
doctorRouter.delete("/:id", adminAuth, deleteDoctor);

export default doctorRouter;
