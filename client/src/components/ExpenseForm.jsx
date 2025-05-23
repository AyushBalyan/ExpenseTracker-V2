// src/components/ExpenseForm.jsx
import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import AddCategoryModal from './AddCategoryModal';

const ExpenseForm = ({ editingExpense, setEditingExpense }) => {
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0]
    });
    const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);

    const { addExpense, updateExpense, categories, loading } = useFinance();

    useEffect(() => {
        if (editingExpense) {
            setFormData({
                title: editingExpense.title,
                amount: editingExpense.amount,
                category: editingExpense.category,
                date: new Date(editingExpense.date).toISOString().split('T')[0]
            });
        }
    }, [editingExpense]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingExpense) {
                await updateExpense(editingExpense._id, formData);
                setEditingExpense(null);
            } else {
                await addExpense(formData);
            }
            setFormData({
                title: '',
                amount: '',
                category: '',
                date: new Date().toISOString().split('T')[0]
            });
        } catch (err) {
            console.error('Failed to save expense:', err);
        }
    };

    const handleCancel = () => {
        setEditingExpense(null);
        setFormData({
            title: '',
            amount: '',
            category: '',
            date: new Date().toISOString().split('T')[0]
        });
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Title
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Amount
                        </label>
                        <input
                            type="number"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Category
                        </label>
                        <div className="flex gap-2">
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full p-2 border rounded"
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map((category) => (
                                    <option key={category._id} value={category.name}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            <button
                                type="button"
                                onClick={() => setIsAddCategoryModalOpen(true)}
                                className="bg-green-500 text-white px-3 rounded hover:bg-green-600"
                            >
                                +
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Date
                        </label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                </div>
                <div className="mt-4 flex gap-2">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : editingExpense ? 'Update Expense' : 'Add Expense'}
                    </button>
                    {editingExpense && (
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            <AddCategoryModal 
                isOpen={isAddCategoryModalOpen}
                onClose={() => setIsAddCategoryModalOpen(false)}
            />
        </>
    );
};

export default ExpenseForm;
