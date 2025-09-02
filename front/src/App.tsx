import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import './App.css'
import Signup from './pages/auth/Signup'
import Login from './pages/auth/Login'
import Dashboard from './pages/dashboard/Dashboard'
import Navbar from './components/layout/Navbar'

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
       

        </Route>

      </Routes>
      
    </Router>
  )
}

export default App
