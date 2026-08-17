import {useState} from 'react';
import {useParams, useNavigate, Link} from 'react-router-dom';
import { useTransactionsContext} from '../context/TransactionsContext';
import {CATEGORIES} from '../constants';

export default function TransactionDetail() {
    const {id} = useParams();
    const navigate = useeNavigate();
    const {getTransactionById, updateTransaction, deleteTransaction} = useTransactionsContext();
    const trans = getTransactionById(id);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState(trans ? {...trans} : null);
    const [errors, setErrors] = useState({});

    if (!trans) {
        return (
            <div className="page">
                <Link to="/" className="back-link">← Back to Dashboard</Link>
                <h1>Transaction Not Found</h1>
                <p>This transaction may have already been deleted.</p>
            </div>
        );
    }

    function handleChange(e) {
        const {name, value} = e.traget;
        setForm((f) => ({...f, [name]: value}));
    }

    function validate() {
        const errs = {};
        if (!form.description.trim()) errs.description = 'Description is required.';
        if (form.amount === '' || Number(form.amount) <= 0) errs.amount = 'Amount is required.';
        if (!form.date) errs.date = 'Date is required.';
        return errs;
    }

    function handleSave(e) {
        e.preventDefault();
        const errs = validate();
        setErrors(errs);
        
        if (Object.keys(errs).length > 0) return;
        updateTransaction(id, {...form, amount: Number(form.amount)});
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
                    <p><strong>Description:</strong> {trans.description} </p>
                    <p><strong>Amount:</strong> <span className={trans.type}>{trans.type === 'income' ? '+' : '-'}${Number(trans.amount).toFixed(2)} </span></p>
                    <p><strong>Type:</strong> {trans.type} </p>
                    <p><strong>Category:</strong> {trans.category} </p>
                    <p><strong>Date:</strong> {trans.date} </p>
                    {trans.notes && <p><strong>Notes:</strong> {trans.notes} </p>}

                    <div className="detail-actions">
                        <button className="btn-primary" onClick={() => setEditing(true)}>Edit</button>
                        <button className="btn-danger" onClick={handleDelete}>Delete</button>
                    </div>
                </div>
            ) : (
                <form className="trans-form" onSubmit={handleSave} noValidate>
                    <label>Description
                        <input name="description" value={form.description} onChange={handleChange}/>
                        {errors.description && <span className="error">{errors.description}</span>}
                    </label>
                    <label>Amount
                        <input name="amount" type="number" step="0.01" min="0" value={form.amount} onChange={handleChange}/>
                        {errors.amount && <span className="error">{errors.amount}</span>}
                    </label>
                    <label>Type
                        <select name="type" value={form.type} onChange={handleChange}>
                            <option value="expense">Expense</option>
                            <option value="income">Income</option>
                        </select>
                    </label>
                    <label>Category
                        <select name="category" value={form.category} onChange={handleChange}>
                            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </label>
                    <label>Date
                        <input name="date" type="date" value={form.date} onChange={handleChange}/>
                        {errors.date && <span className="error">{errors.date}</span>}
                    </label>
                    <label>Notes
                        <textarea name="notes" value={form.notes || ''} onChange={handleChange} rows={3}/>
                    </label>
                    <div className="detail-actions">
                        <button type="submit" className="btn-primary">Save Changes</button>
                        <button type="button" className="btn-secondary" onClick={() => {setEditing(false); setForm({...trans}); setErrors({}); }}>Cancel</button>
                    </div>
                </form>
            )}
        </div>
    );
}