import React from 'react'
import HeaderAdministrador from '../components/HeaderAdministrador'
import { Outlet } from 'react-router-dom'

function LayoutAdmin() {

    return (
        <div className='grid grid-cols-3 '>
            
            <div className='col-span-1'>
            <HeaderAdministrador/>
            </div>
            
            <main className="col-span-2">
            <Outlet />
            </main>
        </div>
    )
}

export default LayoutAdmin