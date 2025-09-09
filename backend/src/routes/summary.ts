    import { Router } from 'express';
    import { getSummary, getMonthlySummary, getBudgetAlerts } from '../controllers/summaryController';
    import {authMiddleware} from "../middleware/auth";

    const router = Router();

    router.get('/', authMiddleware,getSummary);
    router.get('/monthly',authMiddleware,getMonthlySummary);
    router.get('/alerts',authMiddleware,getBudgetAlerts);

    export default router;