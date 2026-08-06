import { getAuth } from "@clerk/express";
import { clerkClient } from "@clerk/clerk-sdk-node";

export default async function adminAuth(req, res, next) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    const clerkUser = await clerkClient.users.getUser(userId);
    const role = clerkUser?.publicMetadata?.role;
    const isAdmin = role === "admin" || role === "super-admin";

    if (!isAdmin) {
      return res.status(403).json({ success: false, message: "Admin access required" });
    }

    req.admin = {
      userId,
      role,
      clerkUser,
    };

    next();
  } catch (err) {
    console.error("Admin Clerk verification failed:", err);
    return res.status(401).json({ success: false, message: "Invalid Clerk session" });
  }
}
