import React from 'react'
import HeaderEstudiantes from '../components/HeaderEstudiante'
import { Outlet } from 'react-router-dom'

function LayoutEstudiante() {

    return (
        <div className='grid grid-cols-3 '>
            
            <div className='col-span-1'>
            <HeaderEstudiantes/>
            </div>
            
            <main className="col-span-2">
            <Outlet />
            </main>
        </div>
    )
}

export default LayoutEstudiante