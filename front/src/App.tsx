import './App.css'
import IncomeForm from './components/forms/IncomeForm';
import Category from "./pages/dashboard/Categories";
import Summary from "./pages/dashboard/Dashboard";
import Incomes from './pages/dashboard/Incomes';

function App() {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-6 gap-12">
                {/* <Summary />
                <Category /> */}
                {/*<IncomeForm/>*/}
                <Incomes/>
        </div>
    )
}

export default App;
