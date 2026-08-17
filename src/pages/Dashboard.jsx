import {useState, useMemo} from 'react';
import {Link} from 'react-router-dom';
import {useTransactionsContext} from '../context/TransactionsContext';
import TransactionItem from '../components/TransactionItem';
import {CATEGORIES} from '../constants';

export default function Dashboard() {
    const {transactions} = useTransactionsContext();
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [typeFilter, setTypeFilter] = useState('All');

    const filtered = useMemo(() => {
        return transactions.filter((t) => {
            const categoryMatch = categoryFilter === 'All' || t.category === categoryFilter;
            const typeMatch = typeFilter === 'All' || t.type === typeFilter;
            return categoryMatch && typeMatch;
        });
    }, [transactions, categoryFilter, typeFilter]);

    const balance = useMemo(() => {
        return transactions.reduce((acc, t) => (t.type === 'income' ? acc + Number(t.amount) : acc - Number(t.amount)), 0);
    }, [transactions]);

    return (
        <div className="page">
            <h1>Dashboard</h1>
            <div className="balance-card">
                <span>Current Balance</span>
                <strong className={balance >= 0 ? 'positive' : 'negative'}>${balance.toFixed(2)}</strong>
            </div>

            <div className="filters">
                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                    <option value="All">All</option>
                    <option value="Income">Income</option>
                    <option value="Expense">Expense</option>
                </select>

                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                    <option value="All">All</option>
                    {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>

                <Link to="/add" className="btn-primary">+ Add Transaction</Link>
            </div>

            {filtered.length === 0 ? (
                <p className="empty">No transactions found.</p>
            ) : (
                <ul className="trans-list">
                    {filtered.map((t) => (
                        <TransactionItem key={t.id} trans={t}/>
                    ))}
                </ul>
            )}
        </div>
    );
}