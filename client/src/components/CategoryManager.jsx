// src/components/CategoryManager.jsx
import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';

const CategoryManager = () => {
    const [categoryName, setCategoryName] = useState('');
    const { addCategory, categories, loading, error } = useFinance();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addCategory(categoryName);
            setCategoryName('');
        } catch (err) {
            console.error('Failed to add category:', err);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Category Management</h2>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="mb-6">
                <div className="flex gap-4">
                    <div className="flex-1">
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
                    <div className="flex items-end">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            disabled={loading}
                        >
                            {loading ? 'Adding...' : 'Add Category'}
                        </button>
                    </div>
                </div>
            </form>

            <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border">Category Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category._id}>
                                <td className="px-4 py-2 border">{category.name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CategoryManager;
