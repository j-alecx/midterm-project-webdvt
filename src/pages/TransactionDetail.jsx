import {useState} from 'react';
import {useParams, useNavigate, Link} from 'react-router-dom';
import {useTransactionsContext} from '../context/TransactionsContext';
import {formatDate} from '../constants';
import TransactionForm from '../components/TransactionForm';

export default function TransactionDetail() {
    const {id} = useParams();
    const navigate = useNavigate();
    const {getTransactionById, updateTransaction, deleteTransaction} = useTransactionsContext();
    const trans = getTransactionById(id);
    const [editing, setEditing] = useState(false);

    if (!trans) {
        return (
            <div className="page">
                <Link to="/" className="back-link">← Back to Dashboard</Link>
                <h1>Transaction Not Found</h1>
                <p>This transaction may have already been deleted.</p>
            </div>
        );
    }

    function handleSave(data) {
        updateTransaction(id, data);
        setEditing(false);
    }

    function handleDelete() {
        if (window.confirm('Delete this transaction? This cannot be undone')) {
            deleteTransaction(id);
            navigate('/');
        }
    }

    return (
        <div className="page">
            <Link to="/" className="back-link">← Back to Dashboard</Link>
            <h1>Transaction Detail</h1>

            {!editing ? (
                <div className="detail-card">
                    <div className="detail-header">
                        <div className="detail-icon">
                            <i className="bi bi-basket"></i>
                        </div>
                        <div className="detail-header-info">
                            <div className="detail-name-row">
                                <h2 className="detail-name">{trans.name}</h2>
                                <div className="detail-tags">
                                    <span className={`trans-type-tag ${trans.type}`}>{trans.type === 'income' ? 'Income' : 'Expense'}</span>
                                    <span className="trans-category-tag">{trans.category}</span>
                                </div>
                                <p className={`detail-big-amount ${trans.type}`}>{trans.type === 'income' ? '+' : '-'}₱{Number(trans.amount).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})}</p>
                            </div>
                        </div>
                    </div>

                    <div className="detail-section">
                        <h3>Transaction Details</h3>
                        <div className="detail-row">
                            <span className="detail-row-label"><i className="bi bi-card-text"></i> Description</span>
                            <span className="detail-row-value">{trans.name}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-row-label"><i className="bi bi-calendar-event"></i> Date</span>
                            <span className="detail-row-value">{formatDate(trans.date)}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-row-label"><i className="bi bi-tag"></i> Category</span>
                            <span className="detail-row-value">{trans.category}</span>
                        </div>
                        {trans.notes && (
                        <div className="detail-row">
                            <span className="detail-row-label"><i className="bi bi-journal-text"></i> Notes</span>
                            <span className="detail-row-value">{trans.notes}</span>
                        </div>
                        )}
                        <div className="detail-row">
                            <span className="detail-row-label"><i className="bi bi-cash-stack"></i> Amount</span>
                            <span className="detail-row-value">₱{Number(trans.amount).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})}</span>
                        </div>
                    </div>

                    <div className="detail-actions">
                        <button className="btn-outline-primary" onClick={() => setEditing(true)}>
                            <i className="bi bi-pencil"></i> Edit Transaction
                        </button>
                        <button className="btn-danger" onClick={handleDelete}>
                            <i className="bi bi-trash"></i> Delete Transaction
                        </button>
                    </div>
                </div>
            ) : (
                <TransactionForm initialForm={trans} onSubmit={handleSave} onCancel={() => setEditing(false)} submitLabel="Save Changes"/>
            )}
        </div>
    );
}