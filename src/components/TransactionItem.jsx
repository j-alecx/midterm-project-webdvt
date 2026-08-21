import {memo} from 'react';
import {Link} from 'react-router-dom';
import {formatDate} from '../constants';

const TransactionItem = memo(function TransactionItem({trans}) {
    const isIncome = trans.type === 'income';
    return (
        <li className={`trans-item ${trans.type}`}>
            <Link to={`/transaction/${trans.id}`} className="trans-link">
                <div className="trans-main">
                    <div className="trans-title-row">
                        <span className="trans-name">{trans.name}</span>
                        <span className="trans-category-tag">{trans.category}</span>
                        <span className={`trans-type-tag ${trans.type}`}>{isIncome ? 'Income' : 'Expense'}</span>
                    </div>
                    <span className="trans-date">{formatDate(trans.date)}</span>
                </div>
                <span className={`trans-amount ${trans.type}`}>{isIncome ? '+' : '-'}₱{Number(trans.amount).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})}</span>
            </Link>
        </li>
    );
});

export default TransactionItem;