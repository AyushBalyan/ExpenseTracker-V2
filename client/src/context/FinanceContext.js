// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const FinanceContext = createContext(null);

export const FinanceProvider = ({ children }) => {
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuth();


    useEffect(() => {
        if (user) {
            fetchIncomes();
            fetchExpenses();
            fetchCategories();
        }
    }, [user]);

    const fetchIncomes = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/income', {
                withCredentials: true
            });
            setIncomes(response.data);
        } catch (err) {
            setError('Failed to fetch incomes');
        }
    };

    const addIncome = async (amount, month, year) => {
        try {
            setLoading(true);
            const response = await axios.post('http://localhost:4000/api/income', {
                amount,
                month,
                year
            }, { withCredentials: true });
            setIncomes([...incomes, response.data]);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add income');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const lockIncome = async (id) => {
        try {
            setLoading(true);
            const response = await axios.patch(`http://localhost:4000/api/income/lock/${id}`, {}, 
                { withCredentials: true }
            );
            setIncomes(incomes.map(income => 
                income._id === id ? response.data : income
            ));
        } catch (err) {
            setError('Failed to lock income');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const fetchExpenses = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/expense', {
                withCredentials: true
            });
            setExpenses(response.data);
        } catch (err) {
            setError('Failed to fetch expenses');
        }
    };

    const addExpense = async (expenseData) => {
        try {
            setLoading(true);
            const response = await axios.post('http://localhost:4000/api/expense', 
                expenseData,
                { withCredentials: true }
            );
            setExpenses([...expenses, response.data]);
        } catch (err) {
            setError('Failed to add expense');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateExpense = async (id, expenseData) => {
        try {
            setLoading(true);
            const response = await axios.put(`http://localhost:4000/api/expense/${id}`,
                expenseData,
                { withCredentials: true }
            );
            setExpenses(expenses.map(expense => 
                expense._id === id ? response.data : expense
            ));
        } catch (err) {
            setError('Failed to update expense');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteExpense = async (id) => {
        try {
            setLoading(true);
            await axios.delete(`http://localhost:4000/api/expense/${id}`, {
                withCredentials: true
            });
            setExpenses(expenses.filter(expense => expense._id !== id));
        } catch (err) {
            setError('Failed to delete expense');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/category', {
                withCredentials: true
            });
            setCategories(response.data);
        } catch (err) {
            setError('Failed to fetch categories');
        }
    };

    const addCategory = async (name) => {
        try {
            setLoading(true);
            const response = await axios.post('http://localhost:4000/api/category', 
                { name },
                { withCredentials: true }
            );
            setCategories([...categories, response.data]);
        } catch (err) {
            setError('Failed to add category');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return (
        <FinanceContext.Provider value={{
            incomes,
            expenses,
            categories,
            loading,
            error,
            addIncome,
            lockIncome,
            addExpense,
            updateExpense,
            deleteExpense,
            addCategory
        }}>
            {children}
        </FinanceContext.Provider>
    );
};

export const useFinance = () => {
    const context = useContext(FinanceContext);
    if (!context) {
        throw new Error('useFinance must be used within a FinanceProvider');
    }
    return context;
};
