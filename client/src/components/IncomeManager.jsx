// src/components/IncomeManager.jsx
import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';

const IncomeManager = () => {
    const [amount, setAmount] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState(new Date().getFullYear());
    const { addIncome, lockIncome, incomes, loading, error } = useFinance();

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addIncome(parseFloat(amount), month, parseInt(year));
            setAmount('');
            setMonth('');
        } catch (err) {
            console.error('Failed to add income:', err);
        }
    };

    const handleLock = async (id) => {
        try {
            await lockIncome(id);
        } catch (err) {
            console.error('Failed to lock income:', err);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">Add New Income</h3>
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2">
                                Amount
                            </label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2">
                                Month
                            </label>
                            <select
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                                required
                            >
                                <option value="">Select Month</option>
                                {months.map((m) => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2">
                                Year
                            </label>
                            <input
                                type="number"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                                required
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                type="submit"
                                className="w-full bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                disabled={loading}
                            >
                                {loading ? 'Adding...' : 'Add Income'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">Income History</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {incomes.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                        No income records found
                                    </td>
                                </tr>
                            ) : (
                                incomes.map((income) => (
                                    <tr key={income._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{income.month}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{income.year}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₹{income.amount.toFixed(2)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {income.isLocked ? (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                    Locked
                                                </span>
                                            ) : (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    Active
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {!income.isLocked && (
                                                <button
                                                    onClick={() => handleLock(income._id)}
                                                    className="text-indigo-600 hover:text-indigo-900 focus:outline-none focus:underline"
                                                    disabled={loading}
                                                >
                                                    Lock
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default IncomeManager;
