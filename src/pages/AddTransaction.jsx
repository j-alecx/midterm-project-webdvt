import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useTransactionsContext} from '../context/TransactionsContext';
import {CATEGORIES} from '../constants';

const emptyForm = {
    description: '',
    amount: '',
    type: 'expense',
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

    function validate() {
        const errs = {};
        
        if (!form.description.trim()) errs.description = 'Description is required.';
        if (form.amount === '' || Number(form.amount) <= 0) errs.amount = 'Amount is required.';
        if (!form.category) errs.category = 'Category is required.';
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

    return (
        <div className="page">
            <h1>Add Transaction</h1>
            <form className="trans-form" onSubmit={handleSubmit} noValidate>
                <label>Description *
                    <input name="description" value={form.description} onChange={handleChange}/>
                    {errors.description && <span className="error">{errors.description}</span>}
                </label>
                <label>Amount *
                    <input name="amount" type="number" step="0.01" min="0" value={form.amount} onChange={handleChange}/>
                    {errors.amount && <span className="error">{errors.amount}</span>}
                </label>
                <label>Type *
                    <select name="type" value={form.type} onChange={handleChange}>
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                    </select>
                </label>
                <label>Category *
                    <select name="category" value={form.category} onChange={handleChange}>
                        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                </label>
                <label>Date *
                    <input name="date" type="date" value={form.date} onChange={handleChange}/>
                    {errors.date && <span className="error">{errors.date}</span>}
                </label>
                <label>Notes (optional)
                    <textarea name="notes" value={form.notes} onChange={handleChange} rows={3}/>
                </label>
                
                <div className="form-actions">
                    <button type="submit" className="btn-primary">Save Transaction</button>
                </div>
            </form>
        </div>
    );
}