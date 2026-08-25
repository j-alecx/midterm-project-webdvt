export const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Travel', 'Bills', 'Shopping', 'Health', 'Education', 'Rent', 'Other', ];
export const INCOME_CATEGORIES = ['Salary', 'Allowance', 'Freelance', 'Business', 'Investments', 'Gifts', 'Other', ];
const rawCombined = [...new Set([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES])];
export const CATEGORIES = [...rawCombined.filter((c) => c !== 'Other'), 'Other'];
export const TYPES = ['income', 'expense'];

export function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'});
}

export function formatCurrency(amount) {
    const num = Number(amount);
    const absNum = Math.abs(num);

    if (absNum >= 1_000_000_000) {
        return `₱${(num / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}B`;
    }
    if (absNum >= 1_000_000) {
        return `₱${(num / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
    }
    return `₱${num.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})}`;
}