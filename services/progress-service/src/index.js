import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import progressRoutes from "./routes/progress.routes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.json({ message: "Progress Service running" }));

app.use("/progress", progressRoutes);

const PORT = process.env.PORT || 4004;
app.listen(PORT, () => console.log(`📊 Progress Service on ${PORT}`));
