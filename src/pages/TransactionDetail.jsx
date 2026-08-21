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
                    <p><strong>Category:</strong> {trans.category} </p>
                    <p><strong>Name/Description:</strong> {trans.name} </p>
                    <p><strong>Amount:</strong> <span className={trans.type}>{trans.type === 'income' ? '+' : '-'}₱{Number(trans.amount).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})} </span></p>
                    <p><strong>Type:</strong> {trans.type} </p>
                    <p><strong>Date:</strong> {formatDate(trans.date)} </p>
                    {trans.notes && <p><strong>Notes:</strong> {trans.notes} </p>}

                    <div className="detail-actions">
                        <button className="btn-primary" onClick={() => setEditing(true)}>Edit</button>
                        <button className="btn-danger" onClick={handleDelete}>Delete</button>
                    </div>
                </div>
            ) : (
                <TransactionForm initialForm={trans} onSubmit={handleSave} onCancel={() => setEditing(false)} submitLabel="Save Changes"/>
            )}
        </div>
    );
}