import express from "express";
import kycRoutes from "./kyc.routes";

const app = express();

app.use("/api/kyc", kycRoutes);
