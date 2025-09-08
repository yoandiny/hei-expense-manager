import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Categories from './pages/dashboard/Categories';
import Summary from './pages/dashboard/Dashboard';

const App: React.FC = () => {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                <h1 className="text-3xl font-bold text-center mt-4 mb-6">Personal Expense Tracker</h1>
                <Routes>
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/summary" element={<Summary />} />
                    <Route path="/" element={<Categories />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;