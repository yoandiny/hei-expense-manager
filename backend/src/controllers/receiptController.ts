import { Request, Response } from "express";
import path from "path";
import fs from "fs/promises";
import prisma from "../PrismaClient";
import jwt from "jsonwebtoken";

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

export const downloadReceipt = async (req: Request, res: Response) => {
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
    res.setHeader("Content-Disposition", `attachment; filename="${path.basename(filePath)}"`);
    console.log("📄 Envoi du fichier :", filePath);
    console.log("📄 Content-Type :", contentType);
    res.sendFile(filePath);
  } catch (error) {
    console.error("❌ Download receipt error:", error);
    res.status(500).json({ error: "Failed to download receipt" });
  }
};

export const viewReceipt = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const tokenFromQuery = req.query.token as string | undefined;

    if (!tokenFromQuery) {
      console.log("❌ Aucun token fourni en query");
      return res.status(401).json({ message: "No token provided" });
    }

    let userId: number;
    try {
      const decoded = jwt.verify(tokenFromQuery, process.env.JWT_SECRET!) as { userId: number };
      userId = decoded.userId;
      console.log("✅ Token valide — userId :", userId);
    } catch (err) {
      console.log("❌ Token invalide :", err);
      return res.status(401).json({ message: "Invalid token" });
    }

    const expense = await prisma.expense.findFirst({
      where: { id: Number(id), userId },
      select: { receiptPath: true },
    });

    if (!expense || !expense.receiptPath) {
      console.log("❌ Reçu non trouvé pour l'ID :", id);
      return res.status(404).json({ error: "Receipt not found" });
    }

    const filePath = path.resolve(expense.receiptPath);
    try {
      await fs.access(filePath);
    } catch (err) {
      console.log("❌ Fichier non trouvé :", filePath);
      return res.status(404).json({ error: "File not found on server" });
    }

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
    console.error("❌ Erreur serveur viewReceipt :", error);
    res.status(500).json({ error: "Failed to view receipt" });
  }
};