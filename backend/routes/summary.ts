import { Router } from 'express';
import { getSummary } from '../controllers/summaryController';

const router = Router();

// Obtenir un résumé des dépenses et revenus
router.get('/', getSummary);

export default router;