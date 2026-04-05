import { ROLES } from '../constants/roles.js';
import { Record } from '../models/Record.js';
import { ApiError } from '../utils/ApiError.js';

const buildRecordFilters = (query, currentUser) => {
  const filters = {};

  if (currentUser.role !== ROLES.ADMIN) {
    filters.userId = currentUser._id;
  } else if (query.userId) {
    filters.userId = query.userId;
  }

  if (query.type) {
    filters.type = query.type;
  }

  if (query.category) {
    filters.category = { $regex: query.category, $options: 'i' };
  }

  if (query.search) {
    filters.$or = [
      { category: { $regex: query.search, $options: 'i' } },
      { note: { $regex: query.search, $options: 'i' } },
    ];
  }

  if (query.startDate || query.endDate) {
    filters.date = {};

    if (query.startDate) {
      filters.date.$gte = new Date(query.startDate);
    }

    if (query.endDate) {
      filters.date.$lte = new Date(query.endDate);
    }
  }

  return filters;
};

const ensureRecordAccess = (record, currentUser) => {
  if (!record) {
    throw new ApiError(404, 'Record not found');
  }

  if (
    currentUser.role !== ROLES.ADMIN &&
    record.userId.toString() !== currentUser._id.toString()
  ) {
    throw new ApiError(403, 'You are not allowed to access this record');
  }
};

export const listRecords = async (query, currentUser) => {
  const page = query.page || 1;
  const limit = query.limit || 10;
  const skip = (page - 1) * limit;
  const sortDirection = query.sortOrder === 'asc' ? 1 : -1;
  const filters = buildRecordFilters(query, currentUser);

  const [records, total] = await Promise.all([
    Record.find(filters)
      .populate('userId', 'name email role')
      .sort({ [query.sortBy || 'date']: sortDirection })
      .skip(skip)
      .limit(limit),
    Record.countDocuments(filters),
  ]);

  return {
    data: records,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

export const getRecordById = async (id, currentUser) => {
  const record = await Record.findById(id).populate('userId', 'name email role');
  ensureRecordAccess(record, currentUser);
  return record;
};

export const createRecord = async (payload, currentUser) => {
  const record = await Record.create({
    ...payload,
    userId:
      currentUser.role === ROLES.ADMIN && payload.userId
        ? payload.userId
        : currentUser._id,
  });

  return Record.findById(record._id).populate('userId', 'name email role');
};

export const updateRecord = async (id, payload, currentUser) => {
  const record = await Record.findById(id);
  ensureRecordAccess(record, currentUser);

  if (currentUser.role !== ROLES.ADMIN) {
    delete payload.userId;
  }

  Object.assign(record, payload);
  await record.save();

  return Record.findById(record._id).populate('userId', 'name email role');
};

export const deleteRecord = async (id, currentUser) => {
  const record = await Record.findById(id);
  ensureRecordAccess(record, currentUser);
  await record.deleteOne();
};

export const buildRecordMatch = (query, currentUser) =>
  buildRecordFilters(query, currentUser);
