// server/routes/expense.js
const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const { authenticateToken } = require('./auth');

router.get('/', authenticateToken, async (req, res) => {
    try {
        const expenses = await Expense.find({ userId: req.user.userId });
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { title, amount, category, date } = req.body;

        const newExpense = new Expense({
            userId: req.user.userId,
            title,
            amount,
            category,
            date
        });

        await newExpense.save();
        res.status(201).json(newExpense);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { title, amount, category, date } = req.body;

        const expense = await Expense.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.userId },
            { title, amount, category, date },
            { new: true }
        );

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        res.json(expense);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const expense = await Expense.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.userId
        });

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        res.json({ message: 'Expense deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
