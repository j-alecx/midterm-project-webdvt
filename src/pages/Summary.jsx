import {useMemo} from 'react';
import {useTransactionsContext} from '../context/TransactionsContext';
import {useTheme} from '../context/ThemeContext';

export default function Summary() {
    const {transactions} = useTransactionsContext();

    const breakdown = useMemo(() => {
        const totals = {};
        transactions.forEach((t) => {
            if (t.type !== 'expense') return;
            totals[t.category] = (totals[t.category] || 0) + Number(t.amount);
        });
        return Object.entries(totals).sort((a, b) => b[1] - a[1]);
    }, [transactions]);

    const totalExpense = useMemo(() => breakdown.reduce((sum, [, amount]) => sum + amount, 0), [breakdown]);
    const totalIncome = useMemo(() => transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0), [transactions]);

    return (
        <div className="page">
            <div className="summary-header">
                <h1>Summary</h1>
            </div>

            <div className="summary-cards">
                <div className="summary-card"><span>Total Income</span><strong className="positive">${totalIncome.toFixed(2)}</strong></div>
                <div className="summary-card"><span>Total Expenses</span><strong className="negative">${totalExpense.toFixed(2)}</strong></div>
            </div>

            <h2>Spending by Category</h2>
            {breakdown.length === 0 ? (
                <p className="empty">No records yet.</p>
            ) : (
                <ul className="breakdown-list">
                    {breakdown.map(([category, amount]) => {
                        const pct = totalExpense > 0 ? (amount / totalExpense) * 100 : 0;
                        return(
                            <li key={category} className="breakdown-item">
                                <div className="breakdown-label">
                                    <span>{category}</span>
                                    <span>${amount.toFixed(2)} ({pct.toFixed(1)}%)</span>
                                </div>
                                <div className="breakdown-bar-bg">
                                    <div className="breakdown-bar-fill" style={{width: `${pct}%`}}/>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}