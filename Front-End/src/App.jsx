import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Acceso from './pages/Estudiantes';
import Registrar from './pages/Registrar';
import Docentes from './pages/Docentes';
import LayoutPrincipal from './layout/LayoutPrincipal';
import SubirCsv from './pages/SubirCsv';
import OlvideContraseña from './pages/OlvideContraseña';
import LayoutAdmin from './layout/LayoutAdmin';
import Administrador from './pages/Administrador';
import VistaPrincipal from './pages/VistaPrincipal';
import RegistrarDocentes from './pages/RegistrarDocentes';
import EstAdmitidosCsv from './pages/EstAdmitidosCsv';
import VistaAdmin from './pages/VistaAdmin';
import Dc_ClasesAsignadas from './pages/Dc_ClasesAsignadas';
import PerfilEstudiante from './pages/PerfilEstudiante';
import '@fortawesome/fontawesome-free/css/all.css';
import LayoutEstudiante from './layout/LayoutEstudiante';
import LayoutDocente from './layout/LayoutDocente';
import SubirVideoFormulario from './pages/AsignarVideo';

function App() {
  

  return (
    
        <BrowserRouter>
      <Routes>

        <Route path='/' element={<LayoutPrincipal/>}> 
            <Route index element={<VistaPrincipal/> } />
            <Route path='/estudiantes' element={<Acceso/> } />
            <Route path='/registrar' element={<Registrar/>} />
            <Route path='/docentes' element={<Docentes/>} /> 
            <Route path='/Administrador' element={<Administrador/>} /> 
        </Route>
        
        <Route > 
            <Route path='/olvideContraseña' element={<OlvideContraseña/>} /> 
        </Route>

        <Route path='/administracion' element={<LayoutAdmin/>}>
              <Route index element={<VistaAdmin/> } />
              <Route path='nuevoDocente' element={<RegistrarDocentes/>} />
              <Route path='SubirCsv' element={<SubirCsv/>} />
              <Route path='estAdmitidos' element={<EstAdmitidosCsv/>} />
        </Route>

        <Route path='/principalEstudiante' element={<LayoutEstudiante/>}>
            <Route path='perfilEstudiante/:numeroCuenta' element={<PerfilEstudiante/>} /> 
        </Route>

        <Route path='/principalDocente' element={<LayoutDocente/>}>
            <Route path='clasesAsignadas' element={<Dc_ClasesAsignadas/>} /> 
            <Route path='videosporasignatura' element={<SubirVideoFormulario/>} />
        </Route>


      </Routes>
    </BrowserRouter>
    
    
  )
}

export default App