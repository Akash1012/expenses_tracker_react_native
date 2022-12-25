import { useContext, useEffect, useState } from "react";
import ExpensesOutput from "../components/ExpensesOutput/ExpensesOutput";
import { getDateMinusDays } from "../util/date";
import { ExpensesContext } from "../store/expenses-context";
import { fetchExpenses } from "../util/http";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverLay from "../components/UI/ErrorOverLay";

function RecentExpenses() {
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState("");
  const expensesCtx = useContext(ExpensesContext);

  useEffect(() => {
    async function getExpenses() {
      setIsFetching(true);
      try {
        const expenses = await fetchExpenses();
        expensesCtx.setExpenses(expenses);
      } catch (error) {
        setError("Could not fetch expenses !");
      }
      setIsFetching(false);
    }
    getExpenses();
  }, []);

  const recentExpenses = expensesCtx.expenses?.filter((expense) => {
    const today = new Date();
    const date7DaysAgo = getDateMinusDays(today, 9);
    return expense.date >= date7DaysAgo && expense.data <= today;
  });

  function errorHandler() {
    setError(null);
  }

  if (error && !isFetching) {
    return <ErrorOverLay message={error} onConfirm={errorHandler} />;
  }

  if (isFetching) {
    return <LoadingOverlay />;
  }

  return (
    <>
      <ExpensesOutput
        expenses={expensesCtx.expenses}
        expensesPeriod="Last 7 Days"
        fallbackText="No expenses registered for the last 7 days "
      />
    </>
  );
}

export default RecentExpenses;
