import React from 'react'

function AlertaError({alerta}) {
    const { mensaje,error } = alerta
    return (
        <div className={`${error ? 'from-red-400 to-red-600': 'from-indigo-400 to-indigo-600'} bg-gradient-to-br text-center p-3 rounded-xl uppercase text-white font-bold mb-5 text-sm  `}>
            {mensaje}
        </div>
    )
    }

export default AlertaError
