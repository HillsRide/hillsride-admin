import express, { Request, Response, Application } from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();
const app: Application = express();

app.use(cors());
app.use(express.json());

// Login endpoint
app.post('/api/auth/login', async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.authCode || '');

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Return user data without sensitive information
    const { authCode, ...userWithoutAuthCode } = user;
    res.json(userWithoutAuthCode);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user profile
app.get('/api/auth/profile', async (req: Request, res: Response) => {
  const userId = req.headers['x-user-id'];

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: {
        id: true,
        email: true,
        fullName: true,
        employeeId: true,
        designation: true,
        department: true,
        manager: true,
        approver: true,
        status: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 