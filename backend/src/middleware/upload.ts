import multer from "multer";
import path from "path";

// Dossier de stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/receipts/"); // ← Crée ce dossier à la racine du backend
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// Filtre les fichiers
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: any) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG, and PDF files are allowed!"), false);
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter,
});