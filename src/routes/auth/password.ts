import { Request, Response } from 'express';
import { Router } from 'express';
import { prisma } from '../../lib/prisma';
import bcrypt from 'bcryptjs';
import { User } from '@prisma/client';

interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  newPin: string;
}

const router = Router();

// Password requirements
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const PIN_REGEX = /^\d{4}$/;

router.post('/change', async (req: Request<{}, {}, PasswordChangeRequest>, res: Response) => {
  try {
    const { currentPassword, newPassword, newPin } = req.body;

    // Validate required fields
    if (!currentPassword || !newPassword || !newPin) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Get user from session or token
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid current password' });
    }

    // Validate new password format
    if (newPassword.length < PASSWORD_MIN_LENGTH) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    if (!PASSWORD_REGEX.test(newPassword)) {
      return res.status(400).json({ 
        error: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character' 
      });
    }

    // Validate new PIN format
    if (!PIN_REGEX.test(newPin)) {
      return res.status(400).json({ error: 'PIN must be 4 digits' });
    }

    // Hash new password and PIN
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const hashedPin = await bcrypt.hash(newPin, 10);

    // Update user
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        pin: hashedPin,
        updatedAt: new Date()
      }
    });

    return res.json({ message: 'Password and PIN updated successfully' });
  } catch (error) {
    console.error('Password change error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 