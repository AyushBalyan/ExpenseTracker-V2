// src/components/ExpenseManager.jsx
import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';

const ExpenseManager = () => {
    const [editingExpense, setEditingExpense] = useState(null);
    const { expenses, loading, error } = useFinance();

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Expense Management</h2>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <ExpenseForm 
                editingExpense={editingExpense}
                setEditingExpense={setEditingExpense}
            />

            <ExpenseList 
                expenses={expenses}
                setEditingExpense={setEditingExpense}
            />
        </div>
    );
};

export default ExpenseManager;
