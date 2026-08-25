import {useNavigate} from 'react-router-dom';
import {useTransactionsContext} from '../context/TransactionsContext';
import TransactionForm from '../components/TransactionForm';

const emptyForm = {
    name: '',
    amount: '',
    type: '',
    category: '',
    date: new Date().toISOString().slice(0, 10),
    notes: '',
};

export default function AddTransaction() {
    const {addTransaction} = useTransactionsContext();
    const navigate = useNavigate();

    function handleSubmit(data) {
        addTransaction(data);
        navigate('/');
    }

    return (
        <div className="page">
            <h1>Add Transaction</h1>
            <TransactionForm initialForm={emptyForm} onSubmit={handleSubmit} onCancel={() => navigate('/')} submitLabel="Add Transaction"/>
        </div>
    );
}