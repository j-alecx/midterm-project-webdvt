import {useState, useEffect, useCallback} from 'react';

const STORAGE_KEY = 'budget-tracker-transactions';

function loadFromStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (err) {
        return [];
    }
}

export function useTransactions() {
    const [transactions, setTransactions] = useState(loadFromStorage);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    }, [transactions]);

    const addTransaction = useCallback((trans) => {
        const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
        const newTrans = {id, ...trans};
        setTransactions((prev) => [newTrans, ...prev]);
        return id;
    }, []);

    const updateTransaction = useCallback((id, updates) => {
        setTransactions((prev) => prev.map((t) => (t.id === id ? {...t, ...updates} : t)));
    }, []);
    
    const deleteTransaction = useCallback((id) => {
        setTransactions((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const getTransactionById = useCallback((id) => transactions.find((t) => t.id === id), [transactions]);

    return{transactions, addTransaction, updateTransaction, deleteTransaction, getTransactionById};
}