import './App.css'
import Category from "./pages/dashboard/Categories";
import Summary from "./pages/dashboard/Dashboard";

function App() {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-6 gap-12">
                <Summary />
                <Category />
        </div>
    )
}

export default App;
