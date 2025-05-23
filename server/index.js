// server/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const User = require('./models/User');
require('dotenv').config();

const app = express();

app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(cookieParser());

async function migrateExistingUsers() {
    try {
        const users = await User.find({ email: { $exists: false } });
        if (users.length > 0) {
            console.log(`Found ${users.length} users to migrate`);
            for (const user of users) {
                user.email = `${user.username}@temporary.com`;
                await user.save();
            }
            console.log('Migration completed successfully');
        } else {
            console.log('No users need migration');
        }
    } catch (error) {
        console.error('Migration failed:', error);
    }
}

const { router: authRouter } = require('./routes/auth');
const incomeRouter = require('./routes/income');
const expenseRouter = require('./routes/expense');
const categoryRouter = require('./routes/category');

app.use('/api/auth', authRouter);
app.use('/api/income', incomeRouter);
app.use('/api/expense', expenseRouter);
app.use('/api/category', categoryRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

mongoose.connect('mongodb://localhost:27017/expense-tracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(async () => {
    console.log('Connected to MongoDB');
    await migrateExistingUsers();
})
.catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit if unable to connect to database
});

mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
    } catch (err) {
        console.error('Error during shutdown:', err);
        process.exit(1);
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
