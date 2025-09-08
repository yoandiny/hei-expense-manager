import { Router } from 'express';
import { getSummary, getMonthlySummary, getBudgetAlerts } from '../controllers/summaryController';

const router = Router();

router.get('/', getSummary);
router.get('/monthly', getMonthlySummary);
router.get('/alerts', getBudgetAlerts);

export default router;