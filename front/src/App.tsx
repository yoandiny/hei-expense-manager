import './App.css'
import Category from "./pages/dashboard/Categories";
import Summary from "./pages/dashboard/Dashboard";

function App() {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-6 gap-12">
            <div className="w-full max-w-4xl">
                <Summary />
            </div>

            <div className="w-full max-w-4xl">
                <Category />
            </div>
        </div>
    )
}

export default App;
