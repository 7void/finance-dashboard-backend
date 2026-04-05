import { Record } from '../models/Record.js';
import { buildRecordMatch } from './recordService.js';

export const getSummary = async (query, currentUser) => {
  const match = buildRecordMatch(query, currentUser);

  const [totals] = await Record.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalIncome: {
          $sum: {
            $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0],
          },
        },
        totalExpenses: {
          $sum: {
            $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0],
          },
        },
      },
    },
  ]);

  const totalIncome = totals?.totalIncome || 0;
  const totalExpenses = totals?.totalExpenses || 0;

  return {
    totalIncome,
    totalExpenses,
    netBalance: totalIncome - totalExpenses,
  };
};

export const getCategoryTotals = async (query, currentUser) => {
  const match = buildRecordMatch(query, currentUser);

  return Record.aggregate([
    { $match: match },
    {
      $group: {
        _id: {
          category: '$category',
          type: '$type',
        },
        total: { $sum: '$amount' },
      },
    },
    {
      $project: {
        _id: 0,
        category: '$_id.category',
        type: '$_id.type',
        total: 1,
      },
    },
    {
      $sort: { total: -1 },
    },
  ]);
};

export const getMonthlyTrends = async (query, currentUser) => {
  const match = buildRecordMatch(query, currentUser);

  return Record.aggregate([
    { $match: match },
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' },
        },
        income: {
          $sum: {
            $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0],
          },
        },
        expenses: {
          $sum: {
            $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        year: '$_id.year',
        month: '$_id.month',
        income: 1,
        expenses: 1,
        net: { $subtract: ['$income', '$expenses'] },
      },
    },
    {
      $sort: { year: 1, month: 1 },
    },
  ]);
};

export const getRecentTransactions = async (query, currentUser) => {
  const match = buildRecordMatch(query, currentUser);
  const limit = query.limit || 5;

  return Record.find(match)
    .populate('userId', 'name email role')
    .sort({ date: -1, createdAt: -1 })
    .limit(limit);
};
