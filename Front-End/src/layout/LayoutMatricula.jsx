import React from 'react'
import HeaderMatricula from '../components/HeaderMatricula'
import { Outlet } from 'react-router-dom'

function LayoutMatricula() {

    return (
        <div className='grid grid-cols-3 '>
            
            <div className='col-span-1'>
            <HeaderMatricula/>
            </div>
            
            <main className="col-span-2">
            <Outlet />
            </main>
        </div>
    )
}

export default LayoutMatricula