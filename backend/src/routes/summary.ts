    import { Router } from 'express';
    import { getSummary, getMonthlySummary, getBudgetAlerts, getTotalIncome } from '../controllers/summaryController';
    import {authMiddleware} from "../middleware/auth";


    const router = Router();

    router.get('/', authMiddleware,getSummary);
    router.get('/monthly',authMiddleware,getMonthlySummary);
    router.get('/alerts',authMiddleware,getBudgetAlerts);
    router.get('/income', authMiddleware, getTotalIncome);

    export default router;