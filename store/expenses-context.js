import { createContext, useReducer, useState } from "react";

export const ExpensesContext = createContext({
  expenses: [],
  addExpenses: ({ description, amount, date }) => {},
  setExpenses: (expenses) => {},
  deleteExpense: ({ id }) => {},
  updateExpenses: ({ id, description, amount, date }) => {},
});

function expensesReducer(state, action) {
  switch (action.type) {
    case "ADD":
      return [action.payload, ...state];

    case "SET":
      const inverted = action.payload.reverse();
      return inverted;

    case "UPDATE":
      const updatableExpenseIndex = state.findIndex(
        (expense) => expense.id === action.payload.id
      );
      const updatableExpense = state[updatableExpenseIndex];
      const updatedItem = {
        ...updatableExpense,
        ...action.payload.data,
      };
      const updatedExpenses = [...state];
      updatedExpenses[updatableExpenseIndex] = updatedItem;
      return updatedExpenses;

    case "DELETE":
      return state.filter((expense) => expense.id !== action.payload);
    default:
      return state;
  }
}

function ExpenseContextProvider({ children }) {
  const [expensesState, dispatch] = useReducer(expensesReducer, []);

  function addExpenses(expensesData) {
    dispatch({
      type: "ADD",
      payload: expensesData,
    });
  }

  function setExpenses(expenses) {
    dispatch({
      type: "SET",
      payload: expenses,
    });
  }
  function deleteExpense(id) {
    dispatch({
      type: "DELETE",
      payload: id,
    });
  }

  function updateExpenses(id, expensesData) {
    dispatch({
      type: "UPDATE",
      payload: {
        id: id,
        data: expensesData,
      },
    });
  }

  const value = {
    expenses: expensesState,
    addExpenses: addExpenses,
    setExpenses: setExpenses,
    deleteExpense: deleteExpense,
    updateExpenses: updateExpenses,
  };
  return (
    <ExpensesContext.Provider value={value}>
      {children}
    </ExpensesContext.Provider>
  );
}

export default ExpenseContextProvider;
