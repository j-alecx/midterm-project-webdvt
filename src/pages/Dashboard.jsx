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
                <div className="balance-info">
                    <span>Current Balance</span>
                    <strong className={balance >= 0 ? 'positive' : 'negative'}>₱{balance.toFixed(2)}</strong>
                </div>
                <Link to="/add" className="btn-primary btn-expand">
                    <i className="bi bi-plus-lg"></i>
                    <span className="btn-expand-text">Add Transaction</span>
                </Link>
            </div>

            <div className="filter-group">
                <span className="form-label">Type</span>
                <div className="category-picker">
                    {['All', 'income', 'expense'].map((t) => (
                        <button key={t} type="button" className={`category-chip${typeFilter === t ? ' category-chip-selected' : ''}`}
                            onClick={() => setTypeFilter(t)}>
                            {t === 'All' ? 'All' : t === 'income' ? 'Income' : 'Expense'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="filter-group">
                <span className="form-label">Category</span>
                <div className="category-picker">
                    <button type="button" className={`category-chip${categoryFilter === 'All' ? ' category-chip-selected' : ''}`}
                        onClick={() => setCategoryFilter('All')}>All</button>
                        {CATEGORIES.map((c) => (
                            <button key={c} type="button" className={`category-chip${categoryFilter === c ? ' category-chip-selected' : ''}`}
                                onClick={() => setCategoryFilter(c)}>{c}</button>
                        ))}
                </div>
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