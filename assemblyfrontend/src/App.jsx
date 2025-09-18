
import { BrowserRouter, Routes, Route  } from 'react-router-dom'
import './App.css'
import Login from './components/Login'
import Search from './components/Search'
import Print from './components/print/Print'

function App() {


  return (
    
    <BrowserRouter>
    <Routes>
      <Route path='assemblynah' element={<Login/>}/>
      <Route path='assemblynah/search' element={<Search/>}/>
      <Route path='assemblynah/Print' element={<Print/>}/>
    </Routes>
         
    </BrowserRouter>
  )
}

export default App
