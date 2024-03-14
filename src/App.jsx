
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './components/Login'
import { ToastContainer } from 'react-toastify'
import Dashboard from './components/Dashboard'
import ProtectdRoute from './components/protectedroutes/protect'


function App() {


  return (
    <>
    <Routes>
        <Route path='/' element={<Login></Login>}></Route>
        <Route path='/dashboard' element={<ProtectdRoute><Dashboard/></ProtectdRoute>}></Route>
    </Routes>
    <ToastContainer />
    </>
  )
}

export default App
