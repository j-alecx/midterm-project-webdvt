import {useState, useRef, useEffect} from 'react';
import {useParams, useNavigate, Link} from 'react-router-dom';
import {useTransactionsContext} from '../context/TransactionsContext';
import {CATEGORIES, formatDate} from '../constants';

export default function TransactionDetail() {
    const {id} = useParams();
    const navigate = useNavigate();
    const {getTransactionById, updateTransaction, deleteTransaction} = useTransactionsContext();
    const trans = getTransactionById(id);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState(trans ? {...trans} : null);
    const [errors, setErrors] = useState({});
    const [categoryOpen, setCategoryOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setCategoryOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
        if (!form.category) errs.category = 'Category is required.';
        if (!form.name.trim()) errs.name = 'Name is required.';
        if (form.amount === '' || Number(form.amount) <= 0) errs.amount = 'Amount is required.';
        if (!form.type) errs.type = 'Type is required.';
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
                <form className="trans-form trans-form-stacked" onSubmit={handleSave} noValidate>
                    <div className="type-category-row">
                        <div className="inline-field-group">
                            <span className="form-label">Type: <span className="required-asterisk">*</span></span>
                            <div className="type-toggle type-toggle-full">
                                <button type="button" className={`type-option${form.type === 'expense' ? ' type-option-selected expense' : ''}`}
                                    onClick={() => setForm((f) => ({...f, type: 'expense'}))}>
                                    <i className="bi bi-dash-circle"></i> Expense
                                </button>
                                <button type="button" className={`type-option${form.type === 'income' ? ' type-option-selected income' : ''}`}
                                    onClick={() => setForm((f) => ({...f, type: 'income'}))}>
                                    <i className="bi bi-plus-circle"></i> Income
                                </button>
                            </div>
                        </div>

                        <div className="inline-field-group">
                            <span className="form-label">Category: <span className="required-asterisk">*</span></span>
                            <div className="custom-select" ref={dropdownRef}>
                                <button type="button" className = "custom-select-trigger" onClick={() => setCategoryOpen((o) => !o)}>
                                    <span>{form.category}</span>
                                    <i className={`bi bi-chevron-down custom-select-arrow${categoryOpen ? ' open' : ''}`}></i>
                                </button>

                                {categoryOpen && (
                                    <ul className = "custom-select-list">
                                        {CATEGORIES.map((c) => (
                                            <li key={c}>
                                                <button type="button" className={`custom-select-option${form.category === c ? ' selected' : ''}`}
                                                    onClick={() => {handleCategorySelect(c); setCategoryOpen(false);}}>{c}</button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                    {errors.category && <span className="error">{errors.category}</span>}
                    {errors.type && <span className="error type-error">{errors.type}</span>}

                    <div className="floating-field">
                        <input id="edit-name" name="name" value={form.name} onChange={handleChange} placeholder=" "/>
                        <label htmlFor="edit-name">
                            <span className="label-text">Name/Description <span className="required-asterisk">*</span></span>
                        </label>
                        {errors.name && <span className="error">{errors.name}</span>}
                    </div>

                    <div className="floating-field amount-field">
                        <input id="edit-amount" name="amount" type="number" step="0.01" min="0" value={form.amount}
                            onChange={handleChange} onKeyDown={handleAmountKeyDown} placeholder=" "/>
                        <label htmlFor="edit-amount">
                            <span className="label-text">Amount <span className="required-asterisk">*</span></span>
                        </label>
                        {errors.amount && <span className="error">{errors.amount}</span>}
                    </div>

                    <div className="floating-field">
                        <input id="edit-date" name="date" type="date" value={form.date} onChange={handleChange} placeholder=" "/>
                        <label htmlFor="edit-date">
                            <span className="label-text">Date <span className="required-asterisk">*</span></span>
                        </label>
                        {errors.date && <span className="error">{errors.date}</span>}
                    </div>

                    <div className="floating-field">
                        <textarea id="edit-notes" name="notes" value={form.notes || ''} onChange={handleChange} rows={3} placeholder=" "/>
                        <label htmlFor="edit-notes">Notes</label>
                    </div>

                    <div className="detail-actions">
                        <button type="submit" className="btn-primary">Save Changes</button>
                        <button type="button" className="btn-secondary" onClick={() => {setEditing(false); setForm({...trans}); setErrors({});}}>Cancel</button>
                    </div>
                </form>
            )}
        </div>
    );
}