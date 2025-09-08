import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import './App.css'
import React from "react";
import ExpenseForm from "./components/forms/ExpenseForm";


function App() {
 

  return (
    <div style={{ padding: "2rem" }}>
      <h1>💸 Ajouter une dépense</h1>
      <ExpenseForm />
    </div>
  )
}

export default App
