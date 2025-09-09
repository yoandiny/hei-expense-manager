import './App.css'
import Category from "./pages/dashboard/Categories";
import Summary from "./pages/dashboard/Dashboard";

 function App() {
     return (
         <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-6 gap-12">
             <Summary/>
             <Category/>
         </div>
     )
 }
 export default App;

// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import Signup from './pages/auth/Signup'
// import Login from './pages/auth/Login'
// import Dashboard from './pages/dashboard/Dashboard'
// import Navbar from './components/layout/Navbar'

// function App() {
 

  // return (
    // <Router>
    //   <Routes>
    //     <Route>
    //        <Route path="/signup" element={<Signup />}/>
    //        <Route path="/login" element={<Login />}/>
    //     </Route>
    //
    //     <Route path="/" element={<Navbar />}>
    //     <Route index element={<Dashboard />} />
    //
    //
    //     </Route>
    //
    //   </Routes>
    //
   // </Router>
  //)
//}


