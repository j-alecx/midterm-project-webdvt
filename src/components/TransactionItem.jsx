import {memo} from 'react';
import {Link} from 'react-router-dom';

const TransactionItem = memo(function TransactionItem({trans}) {
    const isIncome = trans.type === 'income';
    return (
        <li className={`trans-item ${trans.type}`}>
            <Link to={`/transaction/${trans.id}`} className="trans-link">
                <div className="trans-main">
                    <span className="trans-desc">{trans.description}</span>
                    <span className="trans-category">{trans.category}</span>
                </div>
                <div className="trans-other">
                    <span className="trans-date">{trans.date}</span>
                    <span className={`trans-amount ${trans.type}`}>{isIncome ? '+' : '-'}${Number(trans.amount).toFixed(2)}</span>
                </div>
            </Link>
        </li>
    );
});

export default TransactionItem;