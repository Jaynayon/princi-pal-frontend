export const calculateWeeklyExpenses = (expensesData) => {
    const weeklyExpenses = {};
    const dates = expensesData.map(({ date }) => new Date(date));
    const earliestDate = new Date(Math.min(...dates));
    const latestDate = new Date(Math.max(...dates));

    const getWeekDifference = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const timeDiff = end - start;
        const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
        const maxWeeks = Math.ceil(daysDiff / 7) <= 12 ? Math.ceil(daysDiff / 7) : 12;
        return maxWeeks;
    };

    const totalWeeks = getWeekDifference(earliestDate, latestDate) + 1;

    const getStartOfWeek = (weekIndex, startDate) => {
        const start = new Date(startDate);
        start.setDate(start.getDate() + weekIndex * 7);
        return start;
    };


    const getWeekIndex = (date) => {
        const startOfWeek = new Date(earliestDate);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        const timeDiff = date - startOfWeek;
        const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
        return Math.floor(daysDiff / 7);
    };


    expensesData.forEach(({ objectCode }) => {
        if (!weeklyExpenses[objectCode]) {
            weeklyExpenses[objectCode] = new Array(totalWeeks).fill(0);
        }
    });


    expensesData.forEach(({ date, objectCode, amount }) => {
        const expenseDate = new Date(date);
        const weekIndex = getWeekIndex(expenseDate);

        if (weekIndex >= 0 && weekIndex < totalWeeks) {
            weeklyExpenses[objectCode][weekIndex] += amount;
        }
    });

    return weeklyExpenses;
};