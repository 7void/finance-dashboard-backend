import express from 'express';
import {
  createNewRecord,
  getRecord,
  getRecords,
  removeRecord,
  updateExistingRecord,
} from '../controllers/recordController.js';
import { ROLES } from '../constants/roles.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import {
  createRecordSchema,
  listRecordsQuerySchema,
  recordParamsSchema,
  updateRecordSchema,
} from '../validators/recordValidators.js';

const router = express.Router();

router.use(authenticate);

router.get(
  '/',
  authorize(ROLES.VIEWER, ROLES.ANALYST, ROLES.ADMIN),
  validate(listRecordsQuerySchema),
  getRecords
);
router.get(
  '/:id',
  authorize(ROLES.VIEWER, ROLES.ANALYST, ROLES.ADMIN),
  validate(recordParamsSchema),
  getRecord
);
router.post(
  '/',
  authorize(ROLES.ANALYST, ROLES.ADMIN),
  validate(createRecordSchema),
  createNewRecord
);
router.patch(
  '/:id',
  authorize(ROLES.ANALYST, ROLES.ADMIN),
  validate(updateRecordSchema),
  updateExistingRecord
);
router.delete(
  '/:id',
  authorize(ROLES.ANALYST, ROLES.ADMIN),
  validate(recordParamsSchema),
  removeRecord
);

export default router;
