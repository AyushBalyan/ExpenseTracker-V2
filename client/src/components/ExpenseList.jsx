// src/components/ExpenseList.jsx
import React from 'react';
import { useFinance } from '../context/FinanceContext';

const ExpenseList = ({ expenses, setEditingExpense }) => {
    const { deleteExpense, loading } = useFinance();

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this expense?')) {
            try {
                await deleteExpense(id);
            } catch (err) {
                console.error('Failed to delete expense:', err);
            }
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border">Title</th>
                        <th className="px-4 py-2 border">Amount</th>
                        <th className="px-4 py-2 border">Category</th>
                        <th className="px-4 py-2 border">Date</th>
                        <th className="px-4 py-2 border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.map((expense) => (
                        <tr key={expense._id}>
                            <td className="px-4 py-2 border">{expense.title}</td>
                            <td className="px-4 py-2 border">Rs.{expense.amount.toFixed(2)}</td>
                            <td className="px-4 py-2 border">{expense.category}</td>
                            <td className="px-4 py-2 border">
                                {new Date(expense.date).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-2 border">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setEditingExpense(expense)}
                                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                                        disabled={loading}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(expense._id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                        disabled={loading}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ExpenseList;
