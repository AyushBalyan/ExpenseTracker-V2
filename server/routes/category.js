// server/routes/category.js
const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { authenticateToken } = require('./auth');

router.get('/', authenticateToken, async (req, res) => {
    try {
        const categories = await Category.find({ userId: req.user.userId });
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { name } = req.body;

        const newCategory = new Category({
            userId: req.user.userId,
            name
        });

        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
