import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from '../generated/prisma/.js'

import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/user.js"
import categoryRoutes from "./routes/categories";
import summaryRoutes from "./routes/summary";

dotenv.config();
const app = express()
const prisma = new PrismaClient()

app.use(cors());
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use('/api/categories', categoryRoutes);
app.use('/api/summary', summaryRoutes);


app.get("/", (req, res) => {
    res.send("Backend Expense Tracker API is running!")
})

// test à la connexion DB
app.get("/users", async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
});


app.get('/', (req, res) => {
    res.send('API Personal Expense Tracker fonctionne !');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log(`✅ Server running on http://localhost:${PORT}`);
})
