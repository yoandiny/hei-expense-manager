import './App.css'
// <<<<<<< HEAD
// import Category from "./pages/dashboard/Categories";
// import Summary from "./pages/dashboard/Dashboard";

// function App() {
//     return (
//         <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-6 gap-12">
//                 <Summary />
//                 <Category />
//         </div>
//     )
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Signup from './pages/auth/Signup'
import Login from './pages/auth/Login'
import Dashboard from './pages/dashboard/Dashboard'
import Navbar from './components/layout/Navbar'
import Categories from './pages/dashboard/Categories'

function App() {
 

  return (
    <Router>
      <Routes>
        <Route>
           <Route path="/signup" element={<Signup />}/>
           <Route path="/login" element={<Login />}/>
        </Route>
        
        <Route path="/" element={<Navbar />}>
        <Route index element={<Dashboard />} />
        <Route path="/categories" element={<Categories />} />
       

        </Route>

      </Routes>
      
    </Router>
  )
}

export default App;
