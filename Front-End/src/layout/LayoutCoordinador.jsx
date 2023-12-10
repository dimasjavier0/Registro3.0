import React from 'react'
import HeaderCoordinador from '../components/HeaderCoordinador'
import { Outlet } from 'react-router-dom'

function LayoutCoordinador() {

    return (
        <div className='grid grid-cols-3 '>
            
            <div className='col-span-1'>
            <HeaderCoordinador/>
            </div>
            
            <main className="col-span-2">
            <Outlet />
            </main>
        </div>
    )
}

export default LayoutCoordinador