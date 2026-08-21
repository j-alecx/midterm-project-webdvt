export const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Health', 'Education', 'Rent', 'Other', ];
export const INCOME_CATEGORIES = ['Salary', 'Allowance', 'Freelance', 'Business', 'Investments', 'Gifts', 'Other', ];
export const CATEGORIES = [...new Set([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES])];
export const TYPES = ['income', 'expense'];

export function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'});
}