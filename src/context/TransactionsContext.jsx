import {createContext, useContext} from 'react';
import {useTransactions} from '../hooks/useTransactions';

const TransactionsContext = createContext(null);

export function TransactionsProvider({children}) {
    const value = useTransactions();
    return <TransactionsContext.Provider value={value}>{children}</TransactionsContext.Provider>;
}

export function useTransactionsContext() {
    const context = useContext(TransactionsContext);
    if (!context) throw new Error('Transactions must be provided.');
    return context;
}