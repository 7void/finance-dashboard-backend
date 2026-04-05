import express from 'express';
import {
  fetchCategoryTotals,
  fetchMonthlyTrends,
  fetchRecentTransactions,
  fetchSummary,
} from '../controllers/dashboardController.js';
import { ROLES } from '../constants/roles.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { dashboardQuerySchema } from '../validators/recordValidators.js';

const router = express.Router();

router.use(authenticate, authorize(ROLES.ANALYST, ROLES.ADMIN));

router.get('/summary', validate(dashboardQuerySchema), fetchSummary);
router.get('/categories', validate(dashboardQuerySchema), fetchCategoryTotals);
router.get('/monthly-trends', validate(dashboardQuerySchema), fetchMonthlyTrends);
router.get('/recent', validate(dashboardQuerySchema), fetchRecentTransactions);

export default router;
