--Agregar el proceso academico para la PLanificacion academica
INSERT INTO Procesos_academicos(tipo_proceso, descripcion)
VALUES(4, 'Proceso de Planificacion Academica')

--tablas para el modulo de jefe dep
CREATE TABLE secciones_canceladas(
	id_cancelar_seccion INT PRIMARY KEY IDENTITY(1,1),
	id_asignatura INT,
	id_jefeDep INT,
	justificacion NVARCHAR(200) NOT NULL,
	fecha DATE DEFAULT GETDATE(),
	FOREIGN KEY (id_asignatura) REFERENCES asignaturas(id_asignatura),
	FOREIGN KEY (id_jefeDep) REFERENCES jefes_departamentos(id_jefe)
);

CREATE TABLE matriculas_listaEspera(
	id_listaEspera INT PRIMARY KEY IDENTITY(1,1),
	id_estudiante NVARCHAR(11),
	id_seccion INT,
	FOREIGN KEY (id_estudiante) REFERENCES estudiantes(num_cuenta),
	FOREIGN KEY (id_seccion) REFERENCES secciones(id_seccion)
);

--tablas para la evaluacion del docente
CREATE TABLE cuestionarios(
	id_cuestionario INT PRIMARY KEY,
	pregunta1 NVARCHAR(200),
	pregunta2 NVARCHAR(200),
	pregunta3 NVARCHAR(200),
	pregunta4 NVARCHAR(200),
	pregunta5 NVARCHAR(200),
	pregunta6 NVARCHAR(200)
 );

 INSERT INTO cuestionarios
 VALUES(1, 'El docente muestra dominio de técnicas pedagógicas para el proceso enseñanza-aprendizaje a nivel universitario',
 'El docente proporciona herramientas para facilitar el aprendizaje de los contenidos de esta asignatura',
 'El docente trata de forma cordial y respuetuosa a los estudiantes en todo momento',
 'El docente imparte la clase con puntualidad y segun lo programado',
 '¿Que cualidades personales y profesionales identifica usted en el docente?',
 '¿En qué aspectos del desempeño puede mejorar el docente?')

 CREATE TABLE observaciones_docentes(
	id_observacion INT PRIMARY KEY,
	descripcion NVARCHAR(100)
 )

 INSERT INTO observaciones_docentes
 VALUES
 (1, 'Excelente'),
 (2, 'Muy bueno'),
 (3, 'Bueno'),
 (4, 'Deficiente')

 CREATE TABLE respuestas(
	id_respuestas INT PRIMARY KEY IDENTITY(1,1),
	id_cuestionario INT,
	respuesta1 INT,
	respuesta2 INT,
	respuesta3 INT,
	respuesta4 INT,
	respuesta5 NVARCHAR(200),
	respuesta6 NVARCHAR(200)
	FOREIGN KEY (id_cuestionario) REFERENCES cuestionarios(id_cuestionario),
	FOREIGN KEY (respuesta1) REFERENCES observaciones_docentes(id_observacion),
	FOREIGN KEY (respuesta2) REFERENCES observaciones_docentes(id_observacion),
	FOREIGN KEY (respuesta3) REFERENCES observaciones_docentes(id_observacion),
	FOREIGN KEY (respuesta4) REFERENCES observaciones_docentes(id_observacion)
 );

 CREATE TABLE evaluaciones_docentes(
	id_evaluacion INT PRIMARY KEY IDENTITY(1,1),
	id_docente INT,
	id_respuestas INT,
	id_seccion INT, 
	id_estudiante NVARCHAR(11),
	FOREIGN KEY (id_docente) REFERENCES docentes(num_empleado),
	FOREIGN KEY (id_respuestas) REFERENCES respuestas(id_respuestas),
	FOREIGN KEY (id_seccion) REFERENCES secciones(id_seccion),
	FOREIGN KEY (id_estudiante) REFERENCES estudiantes(num_cuenta)
 )

--Cambios para crear secciones
ALTER TABLE carreras
ADD tipo_carrera nchar(5);

ALTER TABLE departamentos_academicos
ADD tipo_dep nchar(5); --Para saber si ese departamento imparte clases semestrales o trimestrales

ALTER TABLE Asignaturas_PAC
DROP COLUMN id_asignatura_carrera;

--FK a la tabla asignaturas
ALTER TABLE secciones
DROP CONSTRAINT FK__secciones__id_as__02C769E9

ALTER TABLE secciones
ADD cod_seccion NCHAR(4);

ALTER TABLE usuarios
ADD correoElectronico NVARCHAR(255);

ALTER TABLE Usuarios 
ADD rol Nvarchar(30);

--Eliminar la tabla docentes y volverla a crear
CREATE TABLE docentes (
    num_empleado INT PRIMARY KEY,
    id_persona NVARCHAR(13),
    fotografia VARBINARY(MAX),
    id_dep_academico INT,
    id_centro INT,
    FOREIGN KEY (id_persona) REFERENCES personas(numero_identidad),
    FOREIGN KEY (id_dep_academico) REFERENCES departamentos_academicos(id_dep_academico),
    FOREIGN KEY (id_centro) REFERENCES centros_regionales(id_centro)
);

--Cambios en la tabla usuarios y creacion de la tabla roles
CREATE TABLE roles(
	id_rol INT PRIMARY KEY,
	nombre NVARCHAR(70)
)

ALTER TABLE usuarios
ALTER COLUMN rol INT;

ALTER TABLE usuario
ADD CONSTRAINT FK_usuario_rol
FOREIGN KEY (rol) REFERENCES roles(id_rol);

INSERT INTO roles
VALUES
	(1, 'administrador'),
	(2, 'estudiante'),
	(3, 'docente'),
	(4, 'coordinador'),
	(5, 'jefeDep')

--Para que el estudiante pueda ver sus notas despues de que se le haya enviado el correo
ALTER TABLE secciones
ADD ingreso_notas BIT DEFAULT 0;

UPDATE estado_calificacion
SET estado = 'No Se Presento'
WHERE id_estado_calificacion = 4


INSERT INTO usuarios (nombre_usuario, password_hash, correoElectronico)
VALUES ('20181030913', '$2b$12$A9NoXVOx0Wr1luys8Mb9me/crCyo8TA4jSPIhyUAnt7ZhckXQt/Yi', 'papardosmith1917@gmail.com');
