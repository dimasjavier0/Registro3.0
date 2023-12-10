import React, { useState } from 'react';
import AlertaError from '../components/AlertaError';

function FormEvaluarDc() {
    const [alerta, setAlerta] = useState({});
    const [respuestas, setRespuestas] = useState({
        pregunta1: '',
        pregunta2: '',
        pregunta3: '',
        pregunta4: '',
        pregunta5: '',
        pregunta6: '',
        pregunta7: '',
        pregunta8: '',
        pregunta9: '',
        pregunta10: '',
        pregunta11: '',
        pregunta12: '',
        pregunta13: '',
        pregunta14: '',
        pregunta15: '',
        pregunta16: '',
        pregunta17: '',
        pregunta18: '',
        pregunta19: '',
        pregunta20: '',
        pregunta21: '',
        pregunta22: '',
        pregunta23: '',
        pregunta24: '',
        pregunta25: '',
        pregunta26: '',
        pregunta27: '',
});

const preguntas = [
    '¿Demuestra estar actualizado y tener dominio de la disciplina que imparte?',
    '¿Establece en la clase relaciones entre los contenidos teóricos y los prácticos?',
    '¿Utiliza en el desarrollo del curso técnicas educativas que facilitan el aprendizaje (investigaciones en grupo, estudio de casos, visitas al campo, seminarios, mesas redondas, simulaciones, audiciones, ejercicios adicionales, sitios web, etc.)?',
    '¿Utiliza durante la clase medios audiovisuales que faciliten su aprendizaje?',
    '¿Relaciona el contenido de esta asignatura con otras que ya ha cursado?',
    '¿Desarrolla contenidos adecuados en profundidad para el nivel que lleva en la carrera?',
    '¿Selecciona temas y experiencias que le sean útiles en su vida profesional y cotidiana?',
    'Además de las explicaciones, ¿le recomendó en esta clase otras fuentes de consulta para el desarrollo de esta asignatura, accesibles a usted en cuanto a costo, ubicación, etc.?',
    '¿Incentiva la participación de los estudiantes en la clase?',
    '¿Asiste a las clases con puntualidad y según lo programado?',
    '¿Inicia y finaliza las clases en el tiempo reglamentario?',
    '¿Muestra interés en que usted aprenda?',
    '¿Relaciona el contenido de la clase con la vida real?',
    '¿Logra mantener la atención de los estudiantes durante el desarrollo de la clase?',
    '¿Muestra buena disposición para aclarar y ampliar dudas sobre problemas que surgen durante las clases?',
    '¿Trata respetuosamente a los estudiantes durante todos los momentos de la clase?',
    '¿Mantiene un clima de cordialidad y respeto con todo el grupo de alumnos?',
    '¿Al inicio del periodo, le explicó el sistema de evaluación a utilizarse durante el desarrollo del curso?',
    '¿Practica evaluaciones de acuerdo a los objetivos propuestos en las clases, los contenidos desarrollados y en las fechas previstas?',
    '¿En la revisión de las evaluaciones, le permitió conocer sus aciertos y discutir sus equivocaciones?',
    '¿Da a conocer criterios para calificar y los aplica al revisar los exámenes, pruebas, trabajos?',
    '¿Utiliza los exámenes y la revisión de estos como medio para afianzar su aprendizaje?',
    '¿Cuál fue su nivel de aprendizaje en esta asignatura?',
    '¿Qué grado de dificultad le asigna a los contenidos de esta asignatura?',
    '¿Qué cualidad docente identifica usted en este profesor(a)?',
    'En su criterio, ¿en qué aspectos de su desempeño docente puede mejorar su profesor?',
    '¿Ha identificado usted en su profesor(a) alguna actitud no acorde con un docente universitario?'
];

const handleSubmit = (e) => {
    e.preventDefault();
    // Validar que se respondieron todas las preguntas
    const algunaRespuestaVacia = preguntas.some(
    (pregunta, index) => !respuestas[`pregunta${index + 1}`]
    );

    if (algunaRespuestaVacia) {
        setAlerta({mensaje: 'Por favor, responde a todas las preguntas.', 
            error: true})
            window.scrollTo(0, 0);
            setTimeout(() => {
                setAlerta({});
            }, 2000);
            return;
    }else{
        setAlerta({mensaje: 'Evaluación docente realizada correctamente', 
            error: false})
            window.scrollTo(0, 0);
            limpiarFormulario();
            setTimeout(() => {
                setAlerta({});
            }, 2000);
    }
};

const handleSelectChange = (pregunta, valor) => {
    setRespuestas((prevRespuestas) => ({
    ...prevRespuestas,
    [pregunta]: valor,
    }));
};

const handleTextareaChange = (pregunta, valor) => {
    setRespuestas((prevRespuestas) => ({
    ...prevRespuestas,
    [pregunta]: valor,
    }));
};

const limpiarFormulario = () => {
    setRespuestas({
        pregunta1: '',
        pregunta2: '',
        pregunta3: '',
        pregunta4: '',
        pregunta5: '',
        pregunta6: '',
        pregunta7: '',
        pregunta8: '',
        pregunta9: '',
        pregunta10: '',
        pregunta11: '',
        pregunta12: '',
        pregunta13: '',
        pregunta14: '',
        pregunta15: '',
        pregunta16: '',
        pregunta17: '',
        pregunta18: '',
        pregunta19: '',
        pregunta20: '',
        pregunta21: '',
        pregunta22: '',
        pregunta23: '',
        pregunta24: '',
        pregunta25: '',
        pregunta26: '',
        pregunta27: '',
    });
};

const {mensaje}= alerta

return (
    <div className='ml-64 mr-80 mb-14'>
    <div className=''>
    <h1 className='text-4xl bg-yellow-500 shadow-xl border-2 p-3 font-label font-bold mt-28 mb-10 text-center'>Evaluación docente</h1>

    
    <form onSubmit={handleSubmit} className='border-2 p-6'>
    {mensaje && <AlertaError 
                    alerta={alerta}
                    />}
        {preguntas.map((pregunta, index) => (
        <div key={index} className='mb-4'>
            {index < 24 ? (
            <div className='flex'>
                <p className='flex-1 font-label'>{pregunta}</p>
                <div className='ml-4'>
                <select
                    className='p-2 border border-gray-300 rounded-md bg-gray-100 font-label w-full'
                    value={respuestas[`pregunta${index + 1}`] || ''}
                    onChange={(e) => handleSelectChange(`pregunta${index + 1}`, e.target.value)}
                >
                    <option value='' disabled>
                    Seleccionar respuesta
                    </option>
                    <option value='Excelente'>Excelente</option>
                    <option value='Muy bueno'>Muy Bueno</option>
                    <option value='Bueno'>Bueno</option>
                    <option value='Deficiente'>Deficiente</option>
                </select>
                </div>
            </div>
            ) : (
            <div className=''>
                <p className='font-label'>{pregunta}</p>
                <textarea
                className='p-2 border mt-0 border-gray-300 rounded-md bg-gray-100 font-label w-full'
                value={respuestas[`pregunta${index + 1}`] || ''}
                onChange={(e) => handleTextareaChange(`pregunta${index + 1}`, e.target.value)}
                />
            </div>
            )}
        </div>
        ))}
        <button
        type='submit'
        className='bg-yellow-600 mb-7 text-white py-2 px-4 mt-12 rounded-lg hover:bg-yellow-700 font-medium w-full uppercase  font-label shadow-lg shadow-yellow-100/70'
        >
        Enviar
        </button>
    </form>
    </div>
</div>
);
}

export default FormEvaluarDc;
