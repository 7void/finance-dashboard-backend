import express from 'express';
import { login, register } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { ROLES } from '../constants/roles.js';
import { loginSchema, registerSchema } from '../validators/authValidators.js';

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post(
  '/admin/register',
  authenticate,
  authorize(ROLES.ADMIN),
  validate(registerSchema),
  register
);

export default router;
