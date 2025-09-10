import { Request, Response } from "express";
import path from "path";
import fs from "fs/promises";
import prisma from "../PrismaClient";
import jwt from "jsonwebtoken"; // ← Ajouté pour vérifier le token

// Upload d'un reçu
export const uploadReceipt = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (!userId) {
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    }

    const expense = await prisma.expense.findFirst({
      where: { id: Number(id), userId },
    });

    if (!expense) {
      return res.status(404).json({ error: "Expense not found or not authorized" });
    }

    const receiptPath = req.file.path.replace(/\\/g, "/");

    await prisma.expense.update({
      where: { id: Number(id) },
      data: { receiptPath },
    });

    res.json({
      message: "✅ Receipt uploaded successfully",
      receiptPath,
    });
  } catch (error) {
    console.error("❌ Upload receipt error:", error);
    res.status(500).json({ error: "Failed to upload receipt" });
  }
};

// Télécharger un reçu — ✅ Accepte token en query
export const downloadReceipt = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let userId: number | undefined;

    // Récupère le token du header OU de la query
    const authHeader = req.headers.authorization;
    const tokenFromQuery = req.query.token as string | undefined;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
      userId = decoded.id;
    } else if (tokenFromQuery) {
      const decoded = jwt.verify(tokenFromQuery, process.env.JWT_SECRET!) as { id: number };
      userId = decoded.id;
    } else {
      return res.status(401).json({ message: "No token provided" });
    }

    const expense = await prisma.expense.findFirst({
      where: { id: Number(id), userId },
      select: { receiptPath: true },
    });

    if (!expense || !expense.receiptPath) {
      return res.status(404).json({ error: "Receipt not found" });
    }

    const filePath = path.resolve(expense.receiptPath);
    await fs.access(filePath);

    let contentType = "application/octet-stream";
    if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) {
      contentType = "image/jpeg";
    } else if (filePath.endsWith(".png")) {
      contentType = "image/png";
    } else if (filePath.endsWith(".pdf")) {
      contentType = "application/pdf";
    }

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${path.basename(filePath)}"`);
    res.sendFile(filePath);
  } catch (error) {
    console.error("❌ Download receipt error:", error);
    res.status(500).json({ error: "Failed to download receipt" });
  }
};

// Voir un reçu — ✅ Accepte token en query
export const viewReceipt = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let userId: number | undefined;

    const authHeader = req.headers.authorization;
    const tokenFromQuery = req.query.token as string | undefined;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
      userId = decoded.id;
    } else if (tokenFromQuery) {
      const decoded = jwt.verify(tokenFromQuery, process.env.JWT_SECRET!) as { id: number };
      userId = decoded.id;
    } else {
      return res.status(401).json({ message: "No token provided" });
    }

    const expense = await prisma.expense.findFirst({
      where: { id: Number(id), userId },
      select: { receiptPath: true },
    });

    if (!expense || !expense.receiptPath) {
      return res.status(404).json({ error: "Receipt not found" });
    }

    const filePath = path.resolve(expense.receiptPath);
    await fs.access(filePath);

    let contentType = "application/octet-stream";
    if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) {
      contentType = "image/jpeg";
    } else if (filePath.endsWith(".png")) {
      contentType = "image/png";
    } else if (filePath.endsWith(".pdf")) {
      contentType = "application/pdf";
    }

    res.setHeader("Content-Type", contentType);
    res.sendFile(filePath);
  } catch (error) {
    console.error("❌ View receipt error:", error);
    res.status(500).json({ error: "Failed to view receipt" });
  }
};