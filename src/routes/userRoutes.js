import express from 'express';
import {
  createNewUser,
  getUser,
  getUsers,
  updateExistingUser,
} from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { ROLES } from '../constants/roles.js';
import {
  createUserSchema,
  updateUserSchema,
  userListQuerySchema,
  userParamsSchema,
} from '../validators/userValidators.js';

const router = express.Router();

router.use(authenticate, authorize(ROLES.ADMIN));

router.get('/', validate(userListQuerySchema), getUsers);
router.post('/', validate(createUserSchema), createNewUser);
router.get('/:id', validate(userParamsSchema), getUser);
router.patch('/:id', validate(updateUserSchema), updateExistingUser);

export default router;
