import {useState, useRef, useEffect} from 'react';
import {EXPENSE_CATEGORIES, INCOME_CATEGORIES} from '../constants';

export default function TransactionForm({initialForm, onSubmit, onCancel, submitLabel}) {
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [categoryOpen, setCategoryOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [showTypeHint, setShowTypeHint] = useState(false);

    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setCategoryOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const activeCategories = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

    function handleChange(e) {
        const {name, value} = e.target;
        setForm((f) => ({...f, [name]: value}));
    }

    function handleAmountChange(e) {
        let value = e.target.value;
        value = value.replace(/[^0-9.]/g, '');
        const parts = value.split('.');
        if (parts.length > 2) {
            value = parts[0] + '.' + parts.slice(1).join('');
        }
        setForm((f) => ({...f, amount: value}));
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
        if (!form.type) errs.type = 'Type is required.';
        if (!form.category) errs.category = 'Category is required.';
        if (!form.name.trim()) errs.name = 'Name is required.';
        if (form.amount === '' || Number(form.amount) <= 0) errs.amount = 'Amount is required.';
        if (!form.date) errs.date = 'Date is required.';
        return errs;
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        const errs = validate();
        setErrors(errs);
        if (Object.keys(errs).length > 0) return;
        onSubmit({...form, amount: Number(form.amount)});
    }

    return (
        <form className="trans-form trans-form-stacked" onSubmit={handleFormSubmit} noValidate>
            <div className="type-category-row">
                <div className="inline-field-group">
                    <div className="inline-field-control">
                        <span className="form-label">Type: <span className="required-asterisk">*</span></span>
                        <div className="type-toggle type-toggle-full">
                            <button type="button" className={`type-option${form.type === 'expense' ? ' type-option-selected expense' : ''}`}
                                onClick={() => setForm((f) => ({...f, type: 'expense', category: ''}))}>
                                <i className="bi bi-dash-circle"></i> Expense
                            </button>
                            <button type="button" className={`type-option${form.type === 'income' ? ' type-option-selected income' : ''}`}
                                onClick={() => setForm((f) => ({...f, type: 'income', category: ''}))}>
                                <i className="bi bi-plus-circle"></i> Income
                            </button>
                        </div>
                    </div>
                    {errors.type && <span className="error type-error">{errors.type}</span>}
                </div>

                <div className="inline-field-group">
                    <div className="inline-field-control">
                        <span className="form-label">Category: <span className="required-asterisk">*</span></span>
                        <div className="custom-select" ref={dropdownRef}>
                            <button type="button" className={`custom-select-trigger${!form.type ? ' custom-select-trigger-disabled' : ''}`}
                                onClick={() => {if (!form.type) {
                                    setShowTypeHint(true);
                                    setTimeout(() => setShowTypeHint(false), 2000);
                                    return;
                                }
                                setCategoryOpen((o) => !o);
                                }}>
                                <span>{form.category || 'Select Category'}</span>
                                <i className={`bi bi-chevron-down custom-select-arrow${categoryOpen ? ' open' : ''}`}></i>
                            </button>
                            {showTypeHint && (
                                <span className="type-hint-message">Select Type First.</span>
                            )}
                            {categoryOpen && (
                                <ul className="custom-select-list">
                                    {activeCategories.map((c) => (
                                        <li key={c}>
                                            <button type="button" className={`custom-select-option${form.category === c ? ' selected' : ''}`}
                                                onClick={() => {handleCategorySelect(c); setCategoryOpen(false);}}>{c}</button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                    {errors.category && <span className="error">{errors.category}</span>}
                </div>
            </div>

            <div className="floating-field">
                <input id="name" name="name" value={form.name} onChange={handleChange} placeholder=" "/>
                <label htmlFor="name">
                    <span className="label-text">Name/Description <span className="required-asterisk">*</span></span>
                </label>
                {errors.name && <span className="error">{errors.name}</span>}
            </div>

            <div className="floating-field amount-field">
                <input id="amount" name="amount" type="text" inputMode="decimal" value={form.amount} onChange={handleAmountChange} onKeyDown={handleAmountKeyDown} placeholder=" "/>
                <label htmlFor="amount">
                    <span className="label-text">Amount <span className="required-asterisk">*</span></span>
                </label>
                {errors.amount && <span className="error">{errors.amount}</span>}
            </div>

            <div className="floating-field">
                <input id="date" name="date" type="date" value={form.date} onChange={handleChange} placeholder=" "/>
                <label htmlFor="date">
                    <span className="label-text">Date <span className="required-asterisk">*</span></span>
                </label>
                {errors.date && <span className="error">{errors.date}</span>}
            </div>

            <div className="floating-field">
                <textarea id="notes" name="notes" value={form.notes || ''} onChange={handleChange} rows={3} placeholder=" "/>
                <label htmlFor="notes">Notes (Optional)</label>
            </div>

            <div className="form-actions form-actions-stacked">
                <button type="submit" className="btn-primary btn-full">{submitLabel}</button>
                <button type="button" className="btn-cancel-full" onClick={onCancel}>Cancel</button>
            </div>
        </form>
    );
}