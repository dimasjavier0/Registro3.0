CREATE DATABASE registro;
GO

USE registro;

CREATE TABLE carreras (
    id_carrera INT IDENTITY PRIMARY KEY,
    nombre_carrera NVARCHAR(100) UNIQUE NOT NULL
);
GO

CREATE TABLE tipos_examen_admision (
    id_tipo_examen INT PRIMARY KEY,
    nombre_examen NVARCHAR(100) NOT NULL
);
GO

CREATE TABLE requisitos_carreras (
    id_requisito_carrera INT IDENTITY PRIMARY KEY,
    id_carrera INT NOT NULL FOREIGN KEY REFERENCES carreras(id_carrera),
	id_tipo_examen INT FOREIGN KEY REFERENCES tipos_examen_admision(id_tipo_examen),
	puntaje_minimo_examen INT,
	UNIQUE (id_carrera, id_tipo_examen)
);

CREATE TABLE departamentos (
    id_departamento INT IDENTITY PRIMARY KEY,
    nombre_departamento NVARCHAR(100) UNIQUE NOT NULL,
);
GO

CREATE TABLE municipios (
    id_municipio INT IDENTITY PRIMARY KEY,
    nombre_municipio NVARCHAR(100) NOT NULL,
	id_departamento INT FOREIGN KEY REFERENCES departamentos(id_departamento)
);
GO

CREATE TABLE direcciones (
    id_direccion INT IDENTITY PRIMARY KEY,
    descripcion NVARCHAR(255) NOT NULL,
    id_municipio INT FOREIGN KEY REFERENCES municipios(id_municipio)
);
GO


CREATE TABLE centros_regionales (
    id_centro INT PRIMARY KEY,
    nombre_centro NVARCHAR(100) NOT NULL UNIQUE,
    id_direccion INT FOREIGN KEY REFERENCES direcciones(id_direccion)
);
GO

CREATE TABLE personas (
	numero_identidad NVARCHAR(13) PRIMARY KEY,
    primer_nombre NVARCHAR(100) NOT NULL,
	segundo_nombre NVARCHAR(100),
    primer_apellido NVARCHAR(100) NOT NULL,
	segundo_apellido NVARCHAR(100),
	telefono NVARCHAR(11),
    correo NVARCHAR(100)
);
GO

CREATE TABLE aspirantes(
	id_aspirante INT PRIMARY KEY,
	id_persona NVARCHAR(13) FOREIGN KEY REFERENCES personas(numero_identidad),
	carrera_principal INT FOREIGN KEY REFERENCES carreras(id_carrera) NOT NULL,
	carrera_secundaria INT FOREIGN KEY REFERENCES carreras(id_carrera) NOT NULL, 
	foto_certificado_secundaria VARBINARY(MAX),
	id_centro INT FOREIGN KEY REFERENCES centros_regionales(id_centro),
	fecha_solicitud DATE DEFAULT GETDATE(),
	CHECK (carrera_principal <> carrera_secundaria)
);
GO

--secuencia para la tabla resultados_examen
CREATE SEQUENCE seq_resultados_examen
    AS int
    START WITH 1;

CREATE TABLE resultados_examen_admision (
    id_resultado INT PRIMARY KEY DEFAULT NEXT VALUE FOR seq_resultados_examen,
	id_aspirante INT FOREIGN KEY REFERENCES aspirantes(id_aspirante),
	FechaExamen DATE,
    id_tipo_examen INT FOREIGN KEY REFERENCES tipos_examen_admision(id_tipo_examen),
    nota FLOAT,
	id_persona NVARCHAR(13) FOREIGN KEY REFERENCES personas(numero_identidad),
);

--secuencia para la tabla aspirantes
CREATE SEQUENCE seq_aspirantes
    AS int
    START WITH 1;

CREATE TABLE estudiantes_aprobados(
	id_est_aprobados INT IDENTITY PRIMARY KEY,
	id_aspirante INT FOREIGN KEY REFERENCES aspirantes(id_aspirante),
	id_carrera INT FOREIGN KEY REFERENCES carreras(id_carrera)
)

CREATE TABLE estudiantes(
	num_cuenta NVARCHAR(11) PRIMARY KEY,
	id_persona NVARCHAR(13) FOREIGN KEY REFERENCES personas(numero_identidad),
	id_carrera INT FOREIGN KEY REFERENCES carreras(id_carrera),
	id_direccion INT FOREIGN KEY REFERENCES direcciones(id_direccion),
	id_centro_regional INT FOREIGN KEY REFERENCES centros_regionales(id_centro),
	correo_institucional NVARCHAR(100) UNIQUE
)

--secuencia para la tabla estudiantes
CREATE SEQUENCE seq_estudiantes
    AS INT
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 3000
    CYCLE;

CREATE TABLE departamentos_academicos (
    id_dep_academico INT IDENTITY PRIMARY KEY,
	nombre NVARCHAR(100) UNIQUE NOT NULL 
);

CREATE TABLE docentes (
    num_empleado INT IDENTITY PRIMARY KEY,
	id_persona NVARCHAR(13) FOREIGN KEY REFERENCES personas(numero_identidad),
	fotografia VARBINARY(MAX),
	id_dep_academico INT FOREIGN KEY REFERENCES departamentos_academicos(id_dep_academico),
	id_centro INT FOREIGN KEY REFERENCES centros_regionales(id_centro)
);

CREATE TABLE periodos_academicos (
    id_periodo INT IDENTITY PRIMARY KEY,
	descripcion NVARCHAR(100) NOT NULL,
	fecha_inicio DATE,
	fecha_fin DATE,
	anio_academico INT DEFAULT YEAR(GETDATE())
);

CREATE TABLE jefes_departamentos (
    id_jefe INT IDENTITY PRIMARY KEY,
	id_departamentoAcademico INT FOREIGN KEY REFERENCES departamentos_academicos(id_dep_academico),
	id_docente INT FOREIGN KEY REFERENCES docentes(num_empleado),
	UNIQUE(id_departamentoAcademico,id_docente)
);

CREATE TABLE coordinadores(
    id_coordinador INT IDENTITY PRIMARY KEY,
	id_carrera INT FOREIGN KEY REFERENCES carreras(id_carrera),
	id_docente INT FOREIGN KEY REFERENCES docentes(num_empleado),
	UNIQUE(id_carrera,id_docente)
);

--*********
CREATE TABLE estudiantes_reprobados(
	id_est_reprobados INT IDENTITY PRIMARY KEY,
	id_aspirante INT FOREIGN KEY REFERENCES aspirantes(id_aspirante),
	id_carrera INT FOREIGN KEY REFERENCES carreras(id_carrera)
)

CREATE TABLE carreras_CentrosRegionales(
	id_carrera_centro INT IDENTITY PRIMARY KEY,
	id_centro INT FOREIGN KEY REFERENCES centros_regionales(id_centro),
	id_carrera INT FOREIGN KEY REFERENCES carreras(id_carrera),
	UNIQUE(id_centro, id_carrera)
)

CREATE TABLE edificios(
	id_edificio INT IDENTITY PRIMARY KEY,
	nombre NVARCHAR(100) NOT NULL, 
	id_centro INT FOREIGN KEY REFERENCES centros_regionales(id_centro)
)

CREATE TABLE aulas(
	id_aula INT IDENTITY PRIMARY KEY,
	numero_aula NVARCHAR(25) NOT NULL, 
	id_edificio INT FOREIGN KEY REFERENCES edificios(id_edificio)
)

CREATE TABLE asignaturas( 
	id_asignatura INT IDENTITY PRIMARY KEY,
	nombre_asig NVARCHAR(100) NOT NULL, 
	unidades_valorativas INT CHECK(unidades_valorativas BETWEEN 1 and 20),
	id_dep_academico INT FOREIGN KEY REFERENCES departamentos_academicos(id_dep_academico)
)

CREATE TABLE asignaturas_carreras( 
	id_asig_carrera INT IDENTITY PRIMARY KEY,
	id_asignatura INT FOREIGN KEY REFERENCES asignaturas(id_asignatura),
	id_carrera INT FOREIGN KEY REFERENCES carreras(id_carrera),
	id_requisito INT NULL FOREIGN KEY REFERENCES asignaturas(id_asignatura) --una asignatura puede o no tener requisitos
)

CREATE TABLE secciones( 
	id_seccion INT IDENTITY PRIMARY KEY,
	id_asignatura INT FOREIGN KEY REFERENCES asignaturas(id_asignatura),
	id_docente INT FOREIGN KEY REFERENCES docentes(num_empleado),
	id_aula INT FOREIGN KEY REFERENCES aulas(id_aula),
	id_periodo INT FOREIGN KEY REFERENCES periodos_academicos(id_periodo),
	hora_inicio INT NOT NULL,
	hora_fin INT NOT NULL,
	dias NVARCHAR(255),
	cupos_maximos INT NOT NULL,
	ruta_video NVARCHAR(255)
)

CREATE TABLE estado_calificacion( --reprobado, aprobado, abandono, no se presento 
	id_estado_calificacion INT IDENTITY PRIMARY KEY,
	estado NVARCHAR(50) 

)

CREATE TABLE matricula_estudiantes( 
	id_matricula INT IDENTITY PRIMARY KEY,
	id_estudiante NVARCHAR(11) FOREIGN KEY REFERENCES estudiantes(num_cuenta),
	id_seccion INT FOREIGN KEY REFERENCES secciones(id_seccion),
	nota FLOAT,
	id_estado_calificacion INT FOREIGN KEY REFERENCES estado_calificacion(id_estado_calificacion)
)

CREATE TABLE fotos_estudiantes( 
	id_foto INT IDENTITY PRIMARY KEY,
	id_estudiante NVARCHAR(11) FOREIGN KEY REFERENCES estudiantes(num_cuenta),
	fotografia VARBINARY(MAX) NOT NULL,
)

CREATE TABLE usuarios (
    id_usuario INT PRIMARY KEY IDENTITY(1,1),
    nombre_usuario NVARCHAR(11) NOT NULL UNIQUE,
    password_hash NVARCHAR(100) NOT NULL
);
