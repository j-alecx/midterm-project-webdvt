export const CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Bills', 'Salary', 'Shopping', 'Health', 'Other', ];
export const TYPES = ['income', 'expense'];

export function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'});
}