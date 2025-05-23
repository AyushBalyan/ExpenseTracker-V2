// server/routes/income.js
const express = require('express');
const router = express.Router();
const Income = require('../models/Income');
const { authenticateToken } = require('./auth');

router.get('/', authenticateToken, async (req, res) => {
    try {
        const incomes = await Income.find({ userId: req.user.userId });
        res.json(incomes);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { amount, month, year } = req.body;
        
        // Check if income already exists for this month/year
        const existingIncome = await Income.findOne({
            userId: req.user.userId,
            month,
            year,
        });

        if (existingIncome && existingIncome.isLocked) {
            return res.status(400).json({ message: 'Income for this month is locked' });
        }

        if (existingIncome) {
            existingIncome.amount = amount;
            await existingIncome.save();
            return res.json(existingIncome);
        }

        const newIncome = new Income({
            userId: req.user.userId,
            amount,
            month,
            year
        });

        await newIncome.save();
        res.status(201).json(newIncome);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.patch('/lock/:id', authenticateToken, async (req, res) => {
    try {
        const income = await Income.findOne({
            _id: req.params.id,
            userId: req.user.userId
        });

        if (!income) {
            return res.status(404).json({ message: 'Income not found' });
        }

        income.isLocked = true;
        await income.save();
        res.json(income);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
