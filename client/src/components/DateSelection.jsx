import React from 'react';

const DateSelection = ({ selectedMonth, setSelectedMonth, selectedYear, setSelectedYear }) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="flex gap-4">
      <select
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
        className="p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
      >
        {months.map(month => (
          <option key={month} value={month}>{month}</option>
        ))}
      </select>
      
      <select
        value={selectedYear}
        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
        className="p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
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
  );
};

export default DateSelection;
