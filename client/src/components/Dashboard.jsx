// src/components/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFinance } from '../context/FinanceContext';
import {
    PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, Cell, LineChart, Line,
    AreaChart, Area, RadialBarChart, RadialBar
} from 'recharts';
import IncomeManager from './IncomeManager';
import ExpenseManager from './ExpenseManager';
import CategoryManager from './CategoryManager';
import DateSelection from './DateSelection';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { incomes, expenses, categories } = useFinance();
    const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [activeSection, setActiveSection] = useState('overview');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/auth');
        }
    }, [user, navigate]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/auth');
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    // Financial calculations
    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalSavings = totalIncome - totalExpenses;
    const savingsPercentage = totalIncome > 0 ? Math.round((totalSavings / totalIncome) * 100) : 0;

    // Monthly data
    const monthlyData = {
        income: incomes.find(i => i.month === selectedMonth && i.year === selectedYear)?.amount || 0,
        expenses: expenses.filter(e => {
            const expenseDate = new Date(e.date);
            return expenseDate.toLocaleString('default', { month: 'long' }) === selectedMonth &&
                   expenseDate.getFullYear() === selectedYear;
        }).reduce((sum, expense) => sum + expense.amount, 0)
    };

    // Expense analysis by category
    const categoryData = expenses
        .filter(e => {
            const expenseDate = new Date(e.date);
            return expenseDate.toLocaleString('default', { month: 'long' }) === selectedMonth &&
                   expenseDate.getFullYear() === selectedYear;
        })
        .reduce((acc, expense) => {
            acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
            return acc;
        }, {});

    const barChartData = Object.entries(categoryData).map(([category, amount]) => ({
        category,
        amount
    }));

    // Pie chart data
    const pieChartData = [
        { name: 'Income', value: monthlyData.income, color: '#4CAF50' },
        { name: 'Expenses', value: monthlyData.expenses, color: '#f44336' }
    ];

    // Radial bar chart data
    const radialData = [
        {
            name: 'Savings',
            value: savingsPercentage,
            fill: savingsPercentage > 30 ? '#4CAF50' : savingsPercentage > 10 ? '#FFC107' : '#f44336'
        }
    ];

    // Generate monthly trend data for line/area chart
    const getMonthlyTrendData = () => {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return monthNames.map(month => {
            const income = incomes.find(i => i.month.substring(0, 3) === month && i.year === selectedYear)?.amount || 0;
            const monthExpenses = expenses.filter(e => {
                const date = new Date(e.date);
                return date.toLocaleString('default', { month: 'short' }) === month && 
                       date.getFullYear() === selectedYear;
            }).reduce((sum, e) => sum + e.amount, 0);
            
            return {
                month,
                income,
                expenses: monthExpenses,
                savings: income - monthExpenses
            };
        });
    };

    const trendData = getMonthlyTrendData();

    // Menu items for sidebar
    const menuItems = [
        { id: 'overview', label: 'Overview', icon: 'bx bxs-dashboard' },
        { id: 'income', label: 'Income', icon: 'bx bx-money' },
        { id: 'expenses', label: 'Expenses', icon: 'bx bx-shopping-bag' },
        { id: 'categories', label: 'Categories', icon: 'bx bx-category' },
        { id: 'analytics', label: 'Analytics', icon: 'bx bx-line-chart' }
    ];

    return (
        <div className="min-h-screen h-screen flex bg-blue-50 overflow-hidden">
            {/* Sidebar - Fixed height */}
            <div className={`h-full bg-gradient-to-b from-blue-500 to-sky-600 text-white transition-all duration-300 flex flex-col ${sidebarOpen ? 'w-64' : 'w-20'}`}>
                <div className="p-4 flex items-center justify-between border-b border-blue-400 border-opacity-30">
                    {sidebarOpen && <h1 className="text-xl font-bold">ProFinance</h1>}
                    <button 
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded-lg hover:bg-blue-600 hover:bg-opacity-50 transition-colors"
                    >
                        <i className={`bx ${sidebarOpen ? 'bx-chevron-left' : 'bx-chevron-right'} text-2xl`}></i>
                    </button>
                </div>
                <div className="flex-grow overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-transparent">
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            className={`w-full flex items-center p-3 transition-colors ${
                                activeSection === item.id 
                                    ? 'bg-blue-600 bg-opacity-50 border-r-4 border-white' 
                                    : 'hover:bg-blue-600 hover:bg-opacity-30'
                            } ${!sidebarOpen && 'justify-center'}`}
                        >
                            <i className={`${item.icon} text-xl ${!sidebarOpen && 'mx-auto'}`}></i>
                            {sidebarOpen && <span className="ml-3">{item.label}</span>}
                        </button>
                    ))}
                </div>
                <div className="border-t border-blue-400 border-opacity-30 p-4">
                    <div className={`flex ${!sidebarOpen && 'justify-center'} items-center mb-4`}>
                        <div className="h-10 w-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-xl">
                            {user && user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                        </div>
                        {sidebarOpen && (
                            <div className="ml-3 overflow-hidden">
                                <p className="font-semibold truncate">{user && user.username}</p>
                                <p className="text-xs text-blue-100 truncate">{user && user.email}</p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleLogout}
                        className={`w-full py-2 rounded-lg bg-red-500 hover:bg-red-600 transition-colors flex items-center ${!sidebarOpen && 'justify-center'}`}
                    >
                        <i className="bx bx-log-out text-xl"></i>
                        {sidebarOpen && <span className="ml-2">Logout</span>}
                    </button>
                </div>
            </div>

            {/* Main Content - Scrollable */}
            <div className="flex-1 overflow-y-auto h-screen">
                <div className="p-6">
                    {/* Header with Date Filter */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-white p-4 rounded-lg shadow-sm">
                        <h1 className="text-2xl font-bold text-sky-700 mb-4 md:mb-0">
                            {activeSection === 'overview' && 'Dashboard Overview'}
                            {activeSection === 'income' && 'Income Management'}
                            {activeSection === 'expenses' && 'Expense Management'}
                            {activeSection === 'categories' && 'Category Management'}
                            {activeSection === 'analytics' && 'Financial Analytics'}
                        </h1>
                        
                        <div className="flex gap-4">
                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                className="p-2 border rounded-lg focus:ring-2 focus:ring-sky-400 focus:outline-none"
                            >
                                {[
                                    'January', 'February', 'March', 'April', 'May', 'June',
                                    'July', 'August', 'September', 'October', 'November', 'December'
                                ].map(month => (
                                    <option key={month} value={month}>{month}</option>
                                ))}
                            </select>
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                className="p-2 border rounded-lg focus:ring-2 focus:ring-sky-400 focus:outline-none"
                            >
                                {[...Array(6)].map((_, i) => {
                                    const year = new Date().getFullYear() - 2 + i;
                                    return (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>

                    {/* Content Sections */}
                    {activeSection === 'overview' && (
                        <div className="space-y-6">
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow transition-all">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-gray-500 text-sm">Total Income</p>
                                            <h3 className="text-2xl font-bold text-gray-800">₹{totalIncome.toFixed(2)}</h3>
                                        </div>
                                        <div className="p-3 bg-green-50 rounded-lg">
                                            <i className="bx bx-wallet text-2xl text-green-500"></i>
                                        </div>
                                    </div>
                                    <div className="mt-4 text-sm">
                                        <span className={monthlyData.income > 0 ? 'text-green-500' : 'text-gray-500'}>
                                            ₹{monthlyData.income.toFixed(2)} this month
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow transition-all">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-gray-500 text-sm">Total Expenses</p>
                                            <h3 className="text-2xl font-bold text-gray-800">₹{totalExpenses.toFixed(2)}</h3>
                                        </div>
                                        <div className="p-3 bg-red-50 rounded-lg">
                                            <i className="bx bx-shopping-bag text-2xl text-red-500"></i>
                                        </div>
                                    </div>
                                    <div className="mt-4 text-sm">
                                        <span className={monthlyData.expenses > 0 ? 'text-red-500' : 'text-gray-500'}>
                                            ₹{monthlyData.expenses.toFixed(2)} this month
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow transition-all">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-gray-500 text-sm">Total Savings</p>
                                            <h3 className="text-2xl font-bold text-gray-800">₹{totalSavings.toFixed(2)}</h3>
                                        </div>
                                        <div className="p-3 bg-blue-50 rounded-lg">
                                            <i className="bx bx-trending-up text-2xl text-sky-500"></i>
                                        </div>
                                    </div>
                                    <div className="mt-4 text-sm">
                                        <span className={totalSavings > 0 ? 'text-sky-500' : 'text-gray-500'}>
                                            {savingsPercentage}% of income
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow transition-all">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-gray-500 text-sm">Categories</p>
                                            <h3 className="text-2xl font-bold text-gray-800">{categories.length}</h3>
                                        </div>
                                        <div className="p-3 bg-purple-50 rounded-lg">
                                            <i className="bx bx-category text-2xl text-purple-500"></i>
                                        </div>
                                    </div>
                                    <div className="mt-4 text-sm">
                                        <span className="text-purple-500">
                                            {Object.keys(categoryData).length} used this month
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Charts Row 1 */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="bg-white p-6 rounded-lg shadow-sm">
                                    <h3 className="text-lg font-semibold mb-4 text-sky-700">Income vs Expenses</h3>
                                    <div className="h-80">
                                        <ResponsiveContainer>
                                            <PieChart>
                                                <Pie
                                                    data={pieChartData}
                                                    dataKey="value"
                                                    nameKey="name"
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={90}
                                                    innerRadius={60}
                                                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                >
                                                    {pieChartData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                
                                <div className="bg-white p-6 rounded-lg shadow-sm">
                                    <h3 className="text-lg font-semibold mb-4 text-sky-700">Spending by Category</h3>
                                    <div className="h-80">
                                        <ResponsiveContainer>
                                            <BarChart data={barChartData} layout="vertical">
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis type="number" />
                                                <YAxis dataKey="category" type="category" width={100} />
                                                <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                                                <Legend />
                                                <Bar dataKey="amount" fill="#38BDF8" radius={[0, 6, 6, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Charts Row 2 */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="bg-white p-6 rounded-lg shadow-sm">
                                    <h3 className="text-lg font-semibold mb-4 text-sky-700">Monthly Trend</h3>
                                    <div className="h-80">
                                        <ResponsiveContainer>
                                            <LineChart data={trendData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="month" />
                                                <YAxis />
                                                <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                                                <Legend />
                                                <Line type="monotone" dataKey="income" stroke="#4CAF50" strokeWidth={2} activeDot={{ r: 8 }} />
                                                <Line type="monotone" dataKey="expenses" stroke="#f44336" strokeWidth={2} />
                                                <Line type="monotone" dataKey="savings" stroke="#0EA5E9" strokeWidth={2} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                
                                <div className="bg-white p-6 rounded-lg shadow-sm">
                                    <h3 className="text-lg font-semibold mb-4 text-sky-700">Savings Goal</h3>
                                    <div className="h-80 flex flex-col items-center justify-center">
                                        <ResponsiveContainer width="100%" height="80%">
                                            <RadialBarChart 
                                                cx="50%" 
                                                cy="50%" 
                                                innerRadius="20%" 
                                                outerRadius="80%" 
                                                barSize={20} 
                                                data={radialData}
                                                startAngle={90} 
                                                endAngle={-270}
                                            >
                                                <RadialBar
                                                    background
                                                    dataKey="value"
                                                    cornerRadius={30}
                                                    label={{ position: 'center', fill: '#666', fontSize: 32 }}
                                                />
                                                <Legend 
                                                    iconSize={10} 
                                                    width={120} 
                                                    height={30} 
                                                    layout="vertical" 
                                                    verticalAlign="middle" 
                                                    align="right"
                                                />
                                                <Tooltip formatter={(value) => `${value}%`} />
                                            </RadialBarChart>
                                        </ResponsiveContainer>
                                        <p className="text-lg font-bold text-gray-600">Savings Rate: {savingsPercentage}%</p>
                                        <p className="text-sm text-gray-500">Target: 30% of Income</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'income' && <IncomeManager />}
                    
                    {activeSection === 'expenses' && <ExpenseManager />}
                    
                    {activeSection === 'categories' && <CategoryManager />}
                    
                    {activeSection === 'analytics' && (
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h3 className="text-lg font-semibold mb-6 text-sky-700">Income vs Expenses Trends</h3>
                                <div className="h-80">
                                    <ResponsiveContainer>
                                        <AreaChart data={trendData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis />
                                            <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                                            <Legend />
                                            <Area type="monotone" dataKey="income" stroke="#4CAF50" fill="#4CAF5033" activeDot={{ r: 8 }} />
                                            <Area type="monotone" dataKey="expenses" stroke="#f44336" fill="#f4433633" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="bg-white p-6 rounded-lg shadow-sm">
                                    <h3 className="text-lg font-semibold mb-4 text-sky-700">Monthly Breakdown</h3>
                                    <div className="h-80">
                                        <ResponsiveContainer>
                                            <BarChart data={trendData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="month" />
                                                <YAxis />
                                                <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                                                <Legend />
                                                <Bar dataKey="income" fill="#4CAF50" radius={[6, 6, 0, 0]} />
                                                <Bar dataKey="expenses" fill="#f44336" radius={[6, 6, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                
                                <div className="bg-white p-6 rounded-lg shadow-sm">
                                    <h3 className="text-lg font-semibold mb-4 text-sky-700">Savings Progress</h3>
                                    <div className="h-80">
                                        <ResponsiveContainer>
                                            <LineChart data={trendData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="month" />
                                                <YAxis />
                                                <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                                                <Legend />
                                                <Line type="monotone" dataKey="savings" stroke="#0EA5E9" strokeWidth={3} dot={{ r: 6 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
