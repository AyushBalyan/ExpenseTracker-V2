// src/components/AddCategoryModal.jsx
import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';

const AddCategoryModal = ({ isOpen, onClose }) => {
    const [categoryName, setCategoryName] = useState('');
    const { addCategory, loading, error } = useFinance();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addCategory(categoryName);
            setCategoryName('');
            onClose();
        } catch (err) {
            console.error('Failed to add category:', err);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-xl font-bold mb-4">Add New Category</h2>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Category Name
                        </label>
                        <input
                            type="text"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            disabled={loading}
                        >
                            {loading ? 'Adding...' : 'Add Category'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCategoryModal;
