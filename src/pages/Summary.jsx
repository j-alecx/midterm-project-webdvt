import {useMemo} from 'react';
import {useTransactionsContext} from '../context/TransactionsContext';
import {formatCurrency} from '../constants';

const CHART_COLORS = ['#e2668f', '#f9adc8', '#ba415e', '#8f2557', '#c9184a', '#ff6b9d', '#d81159', '#a4193d', '#ff8fab', '#ffb3c6',];

function buildBreakdown(transactions, type) {
    const totals = {};
    transactions.forEach((t) => {
        if (t.type !== type) return;
        totals[t.category] = (totals[t.category] || 0) + Number(t.amount);
    });
    return Object.entries(totals).sort((a, b) => b[1] - a[1]);
}

function buildConicGradient(breakdown,total) {
    if (total === 0) return 'var(--border)';
    let cumulative = 0;
    const stops = breakdown.map(([, amount], i) => {
        const start = (cumulative / total) * 360;
        cumulative += amount;
        const end = (cumulative / total) *  360;
        const color = CHART_COLORS[i % CHART_COLORS.length];
        return `${color} ${start}deg ${end}deg`;
    });
    return `conic-gradient(${stops.join(', ')})`;
}

function DonutChart({breakdown, total, centerLabel}) {
    const gradient = useMemo(() => buildConicGradient(breakdown, total), [breakdown, total]);
    
    return (
        <div className="donut-chart" style={{background: gradient}}>
            <div className="donut-chart-center">
                <span>{centerLabel}</span>
                <strong>{formatCurrency(total)}</strong>
            </div>
        </div>
    );
}

function BreakdownSection({title, breakdown, total, emptyMessage}) {
    return (
        <div className="breakdown-section">
            <h2>{title}</h2>
            {breakdown.length === 0 ? (
                <p className="empty">{emptyMessage}</p>
            ) : (
                <div className="breakdown-content">
                    <DonutChart breakdown={breakdown} total={total} centerLabel={title}/>
                    <div className="breakdown-list">
                        <StackedBar breakdown={breakdown} total={total}/>
                        <ul className="breakdown-list">
                        {breakdown.map(([category, amount], i) => {
                            const pct = total > 0 ? (amount / total) * 100 : 0;
                            const pctDisplay = pct > 0 && pct < 0.1 ? '<0.1' : pct.toFixed(1);
                            return (
                                <li key={category} className="breakdown-item">
                                    <span className="breakdown-swatch" style={{background: CHART_COLORS[i % CHART_COLORS.length]}}></span>
                                    <span className="breakdown-item-name">{category} - </span>
                                    <span className="breakdown-item-amount">₱{amount.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})} ({pctDisplay}%)</span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
            )}
        </div>
    );
}

function StackedBar({breakdown, total}) {
    return (
        <div className="stacked-bar">
            {breakdown.map(([category, amount], i) => {
                const pct = total > 0 ? (amount / total) * 100 : 0;
                return (
                    <div key={category} className="stacked-bar-segment" style={{width: `${pct}%`, background: CHART_COLORS[i % CHART_COLORS.length]}} title={`${category}: ${pct.toFixed(1)}%`}/>
                );
            })}
        </div>
    );
}

export default function Summary() {
    const {transactions} = useTransactionsContext();

    const expenseBreakdown = useMemo(() => buildBreakdown(transactions, 'expense'), [transactions]);
    const incomeBreakdown = useMemo(() => buildBreakdown(transactions, 'income'), [transactions]);

    const totalExpense = useMemo(() => expenseBreakdown.reduce((sum, [, amt]) => sum + amt, 0), [expenseBreakdown]);
    const totalIncome = useMemo(() => incomeBreakdown.reduce((sum, [, amt]) => sum + amt, 0), [incomeBreakdown]);

    return (
        <div className="page">
            <h1>Summary</h1>

            <div className="summary-cards">
                <div className="summary-card"><span>Total Income</span><strong className="positive">₱{totalIncome.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})}</strong></div>
                <div className="summary-card"><span>Total Expenses</span><strong className="negative">₱{totalExpense.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})}</strong></div>
            </div>

            <BreakdownSection title="Expenses by Category" breakdown={expenseBreakdown} total={totalExpense} emptyMessage="No expenses recorded yet."/>
            <BreakdownSection title="Income by Category" breakdown={incomeBreakdown} total={totalIncome} emptyMessage="No income recorded yet."/>
        </div>
    );
}