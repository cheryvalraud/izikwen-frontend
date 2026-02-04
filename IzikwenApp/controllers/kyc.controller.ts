import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

export async function createKYCSession(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const session = await stripe.identity.verificationSessions.create({
      type: "document",
      metadata: {
        userId: req.user!.id,
      },
    });

    res.json({
      clientSecret: session.client_secret,
    });
  } catch (err) {
    console.error("Stripe KYC error:", err);
    res.status(500).json({ error: "Failed to create KYC session" });
  }
}
