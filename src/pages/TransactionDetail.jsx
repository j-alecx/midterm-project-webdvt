import {useState} from 'react';
import {useParams, useNavigate, Link} from 'react-router-dom';
import {useTransactionsContext} from '../context/TransactionsContext';
import {CATEGORIES} from '../constants';

export default function TransactionDetail() {
    const {id} = useParams();
    const navigate = useNavigate();
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
        const {name, value} = e.target;
        setForm((f) => ({...f, [name]: value}));
    }

    function handleCategorySelect(category) {
        setForm((f) => ({...f, category}));
    }

    function handleAmountKeyDown(e) {
        if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
            e.preventDefault();
        }
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
                    <p><strong>Category:</strong> {trans.category} </p>
                    <p><strong>Description:</strong> {trans.description} </p>
                    <p><strong>Amount:</strong> <span className={trans.type}>{trans.type === 'income' ? '+' : '-'}${Number(trans.amount).toFixed(2)} </span></p>
                    <p><strong>Type:</strong> {trans.type} </p>
                    <p><strong>Date:</strong> {trans.date} </p>
                    {trans.notes && <p><strong>Notes:</strong> {trans.notes} </p>}

                    <div className="detail-actions">
                        <button className="btn-primary" onClick={() => setEditing(true)}>Edit</button>
                        <button className="btn-danger" onClick={handleDelete}>Delete</button>
                    </div>
                </div>
            ) : (
                <form className="trans-form" onSubmit={handleSave} noValidate>
                    <div className="form-group">
                        <span className="form-label">Category</span>
                        <div className="category-picker">
                            {CATEGORIES.map((c) => (
                                <button key={c} type="button" className={`category-chip${form.category === c ? ' category-chip-selected' : ''}`}
                                    onClick={() => handleCategorySelect(c)}>
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="floating-field">
                        <input id="edit-description" name="description" value={form.description} onChange={handleChange} placeholder=" "/>
                        <label htmlFor="edit-description">
                            <span className="label-text">Description <span className="required-asterisk">*</span></span>
                        </label>
                        {errors.description && <span className="error">{errors.description}</span>}
                    </div>

                    <div className="floating-field amount-field">
                        <input id="edit-amount" name="amount" type="number" step="0.01" min="0" value={form.amount}
                            onChange={handleChange} onKeyDown={handleAmountKeyDown} placeholder=" "/>
                        <label htmlFor="edit-amount">
                            <span className="label-text">Amount <span className="required-asterisk">*</span></span>
                        </label>
                        {errors.amount && <span className="error">{errors.amount}</span>}
                    </div>

                    <div className="form-row">
                        <div className="type-toggle-row">
                            <span className="form-label">Type <span className="required-asterisk">*</span></span>
                            <div className="type-toggle">
                                <button type="button" className={`type-option${form.type === 'expense' ? ' type-option-selected expense' : ''}`}
                                    onClick={() => setForm((f) => ({...f, type: 'expense'}))}>
                                    <i className="bi bi-dash-circle"></i> Expense
                                </button>
                                <button type="button" className={`type-option${form.type === 'income' ? ' type-option-selected income' : ''}`}>
                                    <i className="bi bi-plus-circle"></i> Income
                                </button>
                            </div>
                        </div>

                        <div className="floating field">
                            <input id="edit-date" name="date" type="date" value={form.date} onChange={handleChange} placeholder=" "/>
                            <label htmlFor="edit-date">
                                <span className="label-text">Date <span className="required-asterisk">*</span></span>
                            </label>
                            {errors.date && <span className="error">{errors.date}</span>}
                        </div>
                    </div>

                    <div className="floating-field">
                        <textarea id="edit-notes" name="notes" value={form.notes || ''} onChange={handleChange} rows={3} placeholder=" "/>
                        <label htmlFor="edit-notes">Notes</label>
                    </div>

                    <div className="detail-actions">
                        <button type="submit" classsName="btn-primary">Save Changes</button>
                        <button type="button" className="btn-secondary" 
                            onClick={() => {setEditing(false); setForm({...trans}); setErrors({});}}>
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}