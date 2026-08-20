import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useTransactionsContext} from '../context/TransactionsContext';
import {CATEGORIES} from '../constants';

const emptyForm = {
    name: '',
    amount: '',
    type: '',
    category: CATEGORIES[0],
    date: new Date().toISOString().slice(0, 10),
    notes: '',
};

export default function AddTransaction() {
    const {addTransaction} = useTransactionsContext();
    const navigate = useNavigate();
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});

    function handleChange(e) {
        const {name, value} = e.target;
        setForm((f) => ({...f, [name] : value}));
    }

    function handleCategorySelect(category) {
        setForm((f) => ({...f, category}));
    }

    function validate() {
        const errs = {};
        
        if (!form.category) errs.category = 'Category is required.';
        if (!form.name.trim()) errs.name = 'Name is required.';
        if (form.amount === '' || Number(form.amount) <= 0) errs.amount = 'Amount is required.';
        if (!form.date) errs.date = 'Date is required.';
        return errs;
    }

    function handleSubmit(e) {
        e.preventDefault();
        const errs = validate();
        setErrors(errs);
        if (Object.keys(errs).length > 0) return;

        addTransaction({...form, amount: Number(form.amount)});
        navigate('/');
    }

    function handleAmountKeyDown(e) {
        if (e.key === 'e' || e.key === 'E' || e.key === "+" || e.key === '-') {
            e.preventDefault();
        }
    }

    return (
        <div className="page">
            <h1>Add Transaction</h1>
            <form className="trans-form" onSubmit={handleSubmit} noValidate>
                <div className="category-row">
                    <span className="form-label">Category <span className="required-asterisk">*</span></span>
                    <div className="category-picker">
                        {CATEGORIES.map((c) => (
                            <button key={c} type="button" className={`category-chip${form.category === c ? ' category-chip-selected' : ''}`}
                                onClick={() => handleCategorySelect(c)}>
                                {c}
                            </button>
                        ))}
                    </div>
                    {errors.category && <span className="error">{errors.category}</span>}
                </div>
                
                <div className="floating-field">
                    <input id="name" name="name" value={form.name}
                        onChange={handleChange} placeholder=" "/>
                    <label htmlFor="name">
                        <span className="label-text">Name <span className="required-asterisk">*</span></span>
                    </label>
                    {errors.name && <span className="error">{errors.name}</span>}
                </div>

                <div className="floating-field amount-field">
                    <input id="amount" name="amount" type="number" step="0.01" min="0" value={form.amount}
                        onChange={handleChange} onKeyDown={handleAmountKeyDown} placeholder=" "/>
                    <label htmlFor="amount">
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
                            <button type="button" className={`type-option${form.type === 'income' ? ' type-option-selected income' : ''}`} 
                                onClick={() => setForm((f) => ({...f, type: 'income' }))}>
                                <i className="bi bi-plus-circle"></i> Income
                            </button>
                        </div>
                    </div>

                    <div className="floating-field">
                        <input id="date" name="date" type="date" value={form.date}
                            onChange={handleChange} placeholder=" "/>
                        <label htmlFor="date">
                            <span className="label-text">Date <span className="required-asterisk">*</span></span>
                        </label>
                        {errors.date && <span className="error">{errors.date}</span>}
                    </div>
                </div>

                <div className="floating-field">
                    <textarea id="notes" name="notes" value={form.notes}
                        onChange={handleChange} rows={3} placeholder=" "/>
                    <label htmlFor="notes">Notes</label>
                </div>
                
                <div className="form-actions">
                    <button type="submit" className="btn-primary">Save Transaction</button>
                </div>
            </form>
        </div>
    );
}