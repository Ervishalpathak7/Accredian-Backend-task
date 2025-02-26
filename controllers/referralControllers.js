import express from 'express';
import prisma from '../db/db.js';
import { body, validationResult } from 'express-validator';
import sendReferralEmail from '../mail/mail.js';

const router = express.Router();

// Create a Referral
router.post(
  '/',
  [
    body('referrerName').notEmpty().withMessage('Referrer name is required'),
    body('referrerEmail').isEmail().withMessage('Valid referrer email required'),
    body('referredName').notEmpty().withMessage('Referred name is required'),
    body('referredEmail').isEmail().withMessage('Valid referred email required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { referrerName, referrerEmail, referredName, referredEmail } = req.body;

    try {
      // Check if the referred user is already registered
      const existingReferred = await prisma.referred.findFirst({
        where: {
          AND: [{ email: referredEmail }, { registered: true }],
        },
      });

      if (existingReferred) {
        return res.status(400).json({ error: 'This person has already registered and cannot be referred again.' });
      }

      // Check if the referrer already referred this person
      const existingReferral = await prisma.referred.findFirst({
        where: {
          AND: [{ email: referredEmail }, { referrer: { email: referrerEmail } }],
        },
      });

      if (existingReferral) {
        // Referral already exists, send response and email only
        sendReferralEmail(referrerName, referrerEmail, referredName, referredEmail);
        return res.status(200).json({ message: 'Referral already exists, email sent!' });
      }

      // Create or find the referrer
      const referrer = await prisma.referrer.upsert({
        where: { email: referrerEmail },
        update: {},
        create: { name: referrerName, email: referrerEmail },
      });

      // Create the referral
      const referred = await prisma.referred.create({
        data: {
          name: referredName,
          email: referredEmail,
          referrerId: referrer.id,
        },
      });

      // Send referral email
      sendReferralEmail(referrerName, referrerEmail, referredName, referredEmail);

      res.status(201).json({ message: 'Referral created successfully!', referrer, referred });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create referral', details: error.message });
    }
  }
);


// Create a Referral
router.post(
  '/',
  [
    body('referrerName').notEmpty().withMessage('Referrer name is required'),
    body('referrerEmail').isEmail().withMessage('Valid referrer email required'),
    body('referredName').notEmpty().withMessage('Referred name is required'),
    body('referredEmail').isEmail().withMessage('Valid referred email required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { referrerName, referrerEmail, referredName, referredEmail } = req.body;

    try {
      // Check if the referred user already registered
      const existingReferred = await prisma.referred.findFirst({
        where: {
          email: referredEmail,
          registered: true, // Only care if they already registered
        },
      });

      if (existingReferred) {
        return res.status(400).json({ error: 'This person has already registered and cannot be referred again.' });
      }

      // Create or find the referrer
      const referrer = await prisma.referrer.upsert({
        where: { email: referrerEmail },
        update: {},
        create: { name: referrerName, email: referrerEmail },
      });

      // Create the referral
      const referred = await prisma.referred.create({
        data: {
          name: referredName,
          email: referredEmail,
          referrerId: referrer.id,
        },
      });

      res.status(201).json({ message: 'Referral created successfully!', referrer, referred });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create referral', details: error.message });
    }
  }
);


// Get All Referrals
router.get('/', async (req, res) => {
  try {
    const referrals = await prisma.referrer.findMany({
      include: { referrals: true },
    });
    res.json(referrals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch referrals' });
  }
});

// Get Referral by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const referrer = await prisma.referrer.findUnique({
      where: { id: parseInt(id) },
      include: { referrals: true },
    });

    if (!referrer) return res.status(404).json({ error: 'Referral not found' });

    res.json(referrer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch referral' });
  }
});

export default router;
