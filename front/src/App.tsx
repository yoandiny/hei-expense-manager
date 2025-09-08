import './App.css'
import ExpenseForm from './components/forms/ExpenseForm';
import Category from "./pages/dashboard/Categories";
import Summary from "./pages/dashboard/Dashboard";

function App() {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-6 gap-12">
                {/* <Summary />
                <Category /> */}
                <ExpenseForm/>
        </div>
    )
}

export default App;
