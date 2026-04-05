import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Record } from '../models/Record.js';

const seed = async () => {
  await connectDB();

  await Promise.all([User.deleteMany({}), Record.deleteMany({})]);

  const [admin, analyst, viewer] = await User.create([
    {
      name: 'Admin User',
      email: 'admin@finance.com',
      password: 'Admin123',
      role: 'admin',
      status: 'active',
    },
    {
      name: 'Analyst User',
      email: 'analyst@finance.com',
      password: 'Analyst123',
      role: 'analyst',
      status: 'active',
    },
    {
      name: 'Viewer User',
      email: 'viewer@finance.com',
      password: 'Viewer123',
      role: 'viewer',
      status: 'active',
    },
  ]);

  await Record.create([
    {
      amount: 5200,
      type: 'income',
      category: 'Salary',
      date: new Date('2026-01-05'),
      note: 'January salary',
      userId: analyst._id,
    },
    {
      amount: 1200,
      type: 'expense',
      category: 'Rent',
      date: new Date('2026-01-06'),
      note: 'Monthly rent',
      userId: analyst._id,
    },
    {
      amount: 300,
      type: 'expense',
      category: 'Transport',
      date: new Date('2026-02-10'),
      note: 'Office commute',
      userId: analyst._id,
    },
    {
      amount: 8000,
      type: 'income',
      category: 'Consulting',
      date: new Date('2026-02-15'),
      note: 'Client payment',
      userId: admin._id,
    },
    {
      amount: 1500,
      type: 'expense',
      category: 'Software',
      date: new Date('2026-02-20'),
      note: 'Tool subscription',
      userId: admin._id,
    },
    {
      amount: 250,
      type: 'expense',
      category: 'Food',
      date: new Date('2026-03-01'),
      note: 'Team lunch',
      userId: viewer._id,
    },
  ]);

  console.log('Seed complete');
  console.log('Admin login: admin@finance.com / Admin123');
  console.log('Analyst login: analyst@finance.com / Analyst123');
  console.log('Viewer login: viewer@finance.com / Viewer123');

  process.exit(0);
};

seed().catch((error) => {
  console.error('Seed failed', error);
  process.exit(1);
});
