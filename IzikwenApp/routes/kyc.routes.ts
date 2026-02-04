import { Router } from "express";
import { createKYCSession } from "../controllers/kyc.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.post("/create-session", requireAuth, createKYCSession);

export default router;
