import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Acceso from './pages/Estudiantes'
import Registrar from './pages/Registrar'
import Docentes from './pages/Docentes'
import Principal from './layout/Principal'
import OlvideContraseña from './pages/OlvideContraseña'
import '@fortawesome/fontawesome-free/css/all.css';

function App() {
  

  return (
    
        <BrowserRouter>
      <Routes>

        <Route path='/' element={<Principal/>}> 
            <Route path='/estudiantes' element={<Acceso/> } />
            <Route path='/registrar' element={<Registrar/>} />
            <Route path='/docentes' element={<Docentes/>} />
        </Route>
        <Route>
        <Route path='/olvideContraseña' element={<OlvideContraseña/>} />
        </Route>


      </Routes>
    </BrowserRouter>
    
    
  )
}

export default App