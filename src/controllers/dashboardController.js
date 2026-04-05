import {
  getCategoryTotals,
  getMonthlyTrends,
  getRecentTransactions,
  getSummary,
} from '../services/dashboardService.js';
import { catchAsync } from '../utils/catchAsync.js';

export const fetchSummary = catchAsync(async (req, res) => {
  const summary = await getSummary(req.query, req.user);

  res.status(200).json({
    success: true,
    message: 'Dashboard summary fetched successfully',
    data: summary,
  });
});

export const fetchCategoryTotals = catchAsync(async (req, res) => {
  const totals = await getCategoryTotals(req.query, req.user);

  res.status(200).json({
    success: true,
    message: 'Category totals fetched successfully',
    data: totals,
  });
});

export const fetchMonthlyTrends = catchAsync(async (req, res) => {
  const trends = await getMonthlyTrends(req.query, req.user);

  res.status(200).json({
    success: true,
    message: 'Monthly trends fetched successfully',
    data: trends,
  });
});

export const fetchRecentTransactions = catchAsync(async (req, res) => {
  const transactions = await getRecentTransactions(req.query, req.user);

  res.status(200).json({
    success: true,
    message: 'Recent transactions fetched successfully',
    data: transactions,
  });
});
