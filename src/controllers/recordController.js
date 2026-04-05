import {
  createRecord,
  deleteRecord,
  getRecordById,
  listRecords,
  updateRecord,
} from '../services/recordService.js';
import { catchAsync } from '../utils/catchAsync.js';

export const getRecords = catchAsync(async (req, res) => {
  const result = await listRecords(req.query, req.user);

  res.status(200).json({
    success: true,
    message: 'Records fetched successfully',
    data: result.data,
    pagination: result.pagination,
  });
});

export const getRecord = catchAsync(async (req, res) => {
  const record = await getRecordById(req.params.id, req.user);

  res.status(200).json({
    success: true,
    message: 'Record fetched successfully',
    data: record,
  });
});

export const createNewRecord = catchAsync(async (req, res) => {
  const record = await createRecord(req.body, req.user);

  res.status(201).json({
    success: true,
    message: 'Record created successfully',
    data: record,
  });
});

export const updateExistingRecord = catchAsync(async (req, res) => {
  const record = await updateRecord(req.params.id, req.body, req.user);

  res.status(200).json({
    success: true,
    message: 'Record updated successfully',
    data: record,
  });
});

export const removeRecord = catchAsync(async (req, res) => {
  await deleteRecord(req.params.id, req.user);

  res.status(200).json({
    success: true,
    message: 'Record deleted successfully',
  });
});
