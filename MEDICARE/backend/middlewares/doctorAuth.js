import { getAuth } from "@clerk/express";
import { clerkClient } from "@clerk/clerk-sdk-node";
import Doctor from "../models/Doctor.js";

export default async function doctorAuth(req, res, next) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Doctor authentication required" });
    }

    const clerkUser = await clerkClient.users.getUser(userId);
    const doctor = await Doctor.findOne({
      $or: [{ clerkUserId: userId }, { email: clerkUser.emailAddresses?.[0]?.emailAddress?.toLowerCase() }],
    }).select("-password");

    if (!doctor) {
      return res.status(403).json({ success: false, message: "Clerk user is not linked to a doctor" });
    }

    if (clerkUser.publicMetadata?.role && clerkUser.publicMetadata.role !== "doctor") {
      return res.status(403).json({ success: false, message: "Clerk user is not authorized as a doctor" });
    }

    if (!clerkUser.publicMetadata?.role) {
      await clerkClient.users.updateUser(userId, {
        publicMetadata: { ...clerkUser.publicMetadata, role: "doctor" },
      });
    }

    if (doctor.clerkUserId !== userId) {
      doctor.clerkUserId = userId;
      await doctor.save();
    }

    req.doctor = doctor;
    next();
  } catch (err) {
    console.error("Doctor Clerk verification failed:", err);
    return res.status(401).json({ success: false, message: "Invalid Clerk session" });
  }
}
