CREATE DATABASE Registro2;
GO

USE Registro2;
GO

CREATE TABLE carreras (
    id_carrera INT PRIMARY KEY identity(1,1),
    nombre_carrera NVARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE tipos_examen_admision (
    id_tipo_examen INT PRIMARY KEY,
    nombre_examen NVARCHAR(100) NOT NULL
);

CREATE TABLE requisitos_carreras (
    id_requisito_carrera INT PRIMARY KEY,
    id_carrera INT NOT NULL,
    id_tipo_examen INT,
    puntaje_minimo_examen INT,
    UNIQUE (id_carrera, id_tipo_examen),
    FOREIGN KEY (id_carrera) REFERENCES carreras(id_carrera),
    FOREIGN KEY (id_tipo_examen) REFERENCES tipos_examen_admision(id_tipo_examen)
);

CREATE TABLE departamentos (
    id_departamento INT PRIMARY KEY identity(1,1),
    nombre_departamento NVARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE municipios (
    id_municipio INT PRIMARY KEY identity(1,1),
    nombre_municipio NVARCHAR(100) NOT NULL,
    id_departamento INT,
    FOREIGN KEY (id_departamento) REFERENCES departamentos(id_departamento)
);

CREATE TABLE direcciones (
    id_direccion INT PRIMARY KEY identity(1,1),
    descripcion NVARCHAR(255) NOT NULL,
    id_municipio INT,
    FOREIGN KEY (id_municipio) REFERENCES municipios(id_municipio)
);

CREATE TABLE centros_regionales (
    id_centro INT PRIMARY KEY,
    nombre_centro NVARCHAR(100) UNIQUE NOT NULL,
    id_direccion INT,
    FOREIGN KEY (id_direccion) REFERENCES direcciones(id_direccion)
);

CREATE TABLE usuarios (
    id_usuario INT PRIMARY KEY identity(1,1),
    nombre_usuario NVARCHAR(30) UNIQUE NOT NULL, --, -- COMMENT 'es el correo',
    password_hash NVARCHAR(100) NOT NULL
);

CREATE TABLE personas (
    numero_identidad NVARCHAR(13) PRIMARY KEY,
    primer_nombre NVARCHAR(100) NOT NULL,
    segundo_nombre NVARCHAR(100),
    primer_apellido NVARCHAR(100) NOT NULL,
    segundo_apellido NVARCHAR(100),
    telefono NVARCHAR(11),
    correo NVARCHAR(100),
    id_usuario INT,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

CREATE TABLE aspirantes (
    id_aspirante INT PRIMARY KEY,
    id_persona NVARCHAR(13),
    carrera_principal INT NOT NULL,
    carrera_secundaria INT NOT NULL,
    foto_certificado_secundaria VARBINARY(MAX),
    id_centro INT,
    fecha_solicitud DATE DEFAULT GETDATE(),
    FOREIGN KEY (id_persona) REFERENCES personas(numero_identidad),
    FOREIGN KEY (carrera_principal) REFERENCES carreras(id_carrera),
    FOREIGN KEY (carrera_secundaria) REFERENCES carreras(id_carrera),
    FOREIGN KEY (id_centro) REFERENCES centros_regionales(id_centro)
);

CREATE TABLE resultados_examen_admision (
    id_resultado INT PRIMARY KEY identity(1,1),
    id_aspirante INT,
    FechaExamen DATE,
    id_tipo_examen INT,
    nota FLOAT,
    id_persona NVARCHAR(13),
    FOREIGN KEY (id_aspirante) REFERENCES aspirantes(id_aspirante),
    FOREIGN KEY (id_tipo_examen) REFERENCES tipos_examen_admision(id_tipo_examen),
    FOREIGN KEY (id_persona) REFERENCES personas(numero_identidad)
);

CREATE TABLE estudiantes_aprobados (
    id_est_aprobados INT PRIMARY KEY identity(1,1),
    id_aspirante INT,
    id_carrera INT,
    FOREIGN KEY (id_aspirante) REFERENCES aspirantes(id_aspirante),
    FOREIGN KEY (id_carrera) REFERENCES carreras(id_carrera)
);

CREATE TABLE estudiantes (
    num_cuenta NVARCHAR(11) PRIMARY KEY,
    id_persona NVARCHAR(13),
    id_carrera INT,
    id_direccion INT,
    id_centro_regional INT,
    correo_institucional NVARCHAR(100) UNIQUE,
    FOREIGN KEY (id_persona) REFERENCES personas(numero_identidad),
    FOREIGN KEY (id_carrera) REFERENCES carreras(id_carrera),
    FOREIGN KEY (id_direccion) REFERENCES direcciones(id_direccion),
    FOREIGN KEY (id_centro_regional) REFERENCES centros_regionales(id_centro)
);

CREATE TABLE departamentos_academicos (
    id_dep_academico INT PRIMARY KEY identity(1,1),
    nombre NVARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE docentes (
    num_empleado INT PRIMARY KEY identity(1,1),
    id_persona NVARCHAR(13),
    fotografia VARBINARY(MAX),
    id_dep_academico INT,
    id_centro INT,
    FOREIGN KEY (id_persona) REFERENCES personas(numero_identidad),
    FOREIGN KEY (id_dep_academico) REFERENCES departamentos_academicos(id_dep_academico),
    FOREIGN KEY (id_centro) REFERENCES centros_regionales(id_centro)
);

CREATE TABLE periodos_academicos (
    id_periodo INT PRIMARY KEY identity(1,1),
    num_periodo INT CHECK(num_periodo > 0 AND num_periodo < 4),
    descripcion NVARCHAR(100) NOT NULL,
    fecha_inicio DATE,
    fecha_fin DATE,
    anio_academico INT DEFAULT YEAR(GETDATE())
);

CREATE TABLE Procesos_academicos_periodo (
    id_proceso_academico INT PRIMARY KEY identity(1,1),
    estado bit DEFAULT 0,  -- activo o inactivo
    id_periodo INT,
    FOREIGN KEY (id_periodo) REFERENCES periodos_academicos(id_periodo)
);

CREATE TABLE Procesos_academicos (
    id_proceso INT PRIMARY KEY identity(1,1),
    id_PAC INT,
    tipo_proceso INT , -- COMMENT 'según el número es un tipo de proceso: 1-> reposición, 2-> cancelación excepcional, etc',
    descripcion NVARCHAR(255),
    fecha_inicio DATE,
    fecha_fin DATE,
    FOREIGN KEY (id_PAC) REFERENCES Procesos_academicos_periodo(id_proceso_academico)
);

CREATE TABLE Solicitudes (
    id_solicitud INT PRIMARY KEY,
    tipo_solicitud NVARCHAR(50),
    num_cuenta_solicitante NVARCHAR(11),
    fecha_solicitud DATE,
    fecha_respuesta DATE,
    estado bit DEFAULT 0,
    FOREIGN KEY (num_cuenta_solicitante) REFERENCES estudiantes(num_cuenta)
);

CREATE TABLE Pago_Reposicion_Solicitud (
    id_solicitud INT PRIMARY KEY,
    fecha_pago DATE,
    precio_pago INT,
    FOREIGN KEY (id_solicitud) REFERENCES Solicitudes(id_solicitud)
);

CREATE TABLE Cancelacion_Excepcional_Solicitud (
    id_solicitud INT PRIMARY KEY,
    motivo_cancelacion VARCHAR(255),
    FOREIGN KEY (id_solicitud) REFERENCES Solicitudes(id_solicitud)
);

CREATE TABLE Cambio_Centro_Regional_Solicitud (
    id_solicitud INT PRIMARY KEY,
    id_centro_destino INT,
    FOREIGN KEY (id_solicitud) REFERENCES Solicitudes(id_solicitud),
    FOREIGN KEY (id_centro_destino) REFERENCES centros_regionales(id_centro)
);

CREATE TABLE Cambio_Carrera_Solicitud (
    id_solicitud INT PRIMARY KEY,
    id_carrera_destino INT,
    FOREIGN KEY (id_solicitud) REFERENCES Solicitudes(id_solicitud),
    FOREIGN KEY (id_carrera_destino) REFERENCES carreras(id_carrera)
);

CREATE TABLE Solicitudes_hechas_centro (
    id_solicitud INT PRIMARY KEY identity(1,1),
    motivo INT,
    id_solicitante NVARCHAR(11),
    fecha_solicitud DATE,
    fecha_respuesta DATE,
    id_centro INT,
    FOREIGN KEY (id_solicitante) REFERENCES estudiantes(num_cuenta),
    FOREIGN KEY (id_centro) REFERENCES centros_regionales(id_centro)
);

CREATE TABLE jefes_departamentos (
    id_jefe INT PRIMARY KEY identity(1,1),
    id_departamentoAcademico INT,
    id_docente INT,
    UNIQUE (id_departamentoAcademico, id_docente),
    FOREIGN KEY (id_departamentoAcademico) REFERENCES departamentos_academicos(id_dep_academico),
    FOREIGN KEY (id_docente) REFERENCES docentes(num_empleado)
);

CREATE TABLE coordinadores (
    id_coordinador INT PRIMARY KEY identity(1,1),
    id_carrera INT,
    id_docente INT,
    UNIQUE (id_carrera, id_docente),
    FOREIGN KEY (id_carrera) REFERENCES carreras(id_carrera),
    FOREIGN KEY (id_docente) REFERENCES docentes(num_empleado)
);

CREATE TABLE estudiantes_reprobados (
    id_est_reprobados INT PRIMARY KEY identity(1,1),
    id_aspirante INT,
    id_carrera INT,
    FOREIGN KEY (id_aspirante) REFERENCES aspirantes(id_aspirante),
    FOREIGN KEY (id_carrera) REFERENCES carreras(id_carrera)
);

CREATE TABLE carreras_CentrosRegionales (
    id_carrera_centro INT PRIMARY KEY identity(1,1),
    id_centro INT,
    id_carrera INT,
    UNIQUE (id_centro, id_carrera),
    FOREIGN KEY (id_centro) REFERENCES centros_regionales(id_centro),
    FOREIGN KEY (id_carrera) REFERENCES carreras(id_carrera)
);

CREATE TABLE edificios (
    id_edificio INT PRIMARY KEY identity(1,1),
    nombre NVARCHAR(100) NOT NULL,
    id_centro INT,
    FOREIGN KEY (id_centro) REFERENCES centros_regionales(id_centro)
);

CREATE TABLE aulas (
    id_aula INT PRIMARY KEY identity(1,1),
    numero_aula NVARCHAR(25) NOT NULL,
    id_edificio INT,
    FOREIGN KEY (id_edificio) REFERENCES edificios(id_edificio)
);

CREATE TABLE asignaturas (
    id_asignatura INT PRIMARY KEY identity(1,1),
    codigo_asignatura NVARCHAR(10), --', -- COMMENT IS-303, etc...',
    nombre_asig NVARCHAR(50) NOT NULL,
    unidades_valorativas INT,
    id_dep_academico INT,
    FOREIGN KEY (id_dep_academico) REFERENCES departamentos_academicos(id_dep_academico)
);

CREATE TABLE asignaturas_carreras (
    id_asig_carrera INT PRIMARY KEY identity(1,1),
    id_asignatura INT,
    id_carrera INT,
    id_requisito INT,
    FOREIGN KEY (id_asignatura) REFERENCES asignaturas(id_asignatura),
    FOREIGN KEY (id_carrera) REFERENCES carreras(id_carrera),
    FOREIGN KEY (id_requisito) REFERENCES asignaturas(id_asignatura)
);

CREATE TABLE secciones (
    id_seccion INT PRIMARY KEY identity(1,1),
    id_asignatura INT,
    id_docente INT,
    id_aula INT,
    hora_inicio INT NOT NULL,
    hora_fin INT NOT NULL,
    dias NVARCHAR(255),
    cupos_maximos INT NOT NULL,
    ruta_video NVARCHAR(255),
    FOREIGN KEY (id_asignatura) REFERENCES asignaturas(id_asignatura),
    FOREIGN KEY (id_docente) REFERENCES docentes(num_empleado),
    FOREIGN KEY (id_aula) REFERENCES aulas(id_aula)
);

CREATE TABLE estado_calificacion (
    id_estado_calificacion INT PRIMARY KEY identity(1,1),
    estado NVARCHAR(50)
);

CREATE TABLE matricula_estudiantes (
    id_matricula INT PRIMARY KEY identity(1,1),
    id_estudiante NVARCHAR(11),
    id_seccion INT,
    nota FLOAT,
    id_estado_calificacion INT,
    FOREIGN KEY (id_estudiante) REFERENCES estudiantes(num_cuenta),
    FOREIGN KEY (id_seccion) REFERENCES secciones(id_seccion),
    FOREIGN KEY (id_estado_calificacion) REFERENCES estado_calificacion(id_estado_calificacion)
);

CREATE TABLE fotos_estudiantes (
    id_foto INT PRIMARY KEY identity(1,1),
    id_estudiante NVARCHAR(11),
    fotografia VARBINARY(MAX) NOT NULL,
    FOREIGN KEY (id_estudiante) REFERENCES estudiantes(num_cuenta)
);

CREATE TABLE Administradores (
    id_administrador INT PRIMARY KEY identity(1,1),
    id_usuario INT,
    correo NVARCHAR(30),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

CREATE TABLE Dias (
    id_dia INT PRIMARY KEY,
    descripcion NVARCHAR(20)
);

CREATE TABLE Dias_asignatura (
    id_seccion INT,
    id_dia INT,
    FOREIGN KEY (id_seccion) REFERENCES secciones(id_seccion),
    FOREIGN KEY (id_dia) REFERENCES Dias(id_dia),
    PRIMARY KEY (id_seccion, id_dia)
);

CREATE TABLE Anios_academicos (
    id_anio INT PRIMARY KEY,
    fecha_inicio DATE,
    fecha_fin DATE,
    id_periodo_academico INT,
    FOREIGN KEY (id_periodo_academico) REFERENCES periodos_academicos(id_periodo)
);

CREATE TABLE Asignaturas_PAC (
    id_asignatura_pac INT PRIMARY KEY,
    id_periodo INT,
    id_carrera INT,
    id_asignatura_carrera INT,
    FOREIGN KEY (id_periodo) REFERENCES periodos_academicos(id_periodo),
    FOREIGN KEY (id_carrera) REFERENCES carreras(id_carrera),
    FOREIGN KEY (id_asignatura_carrera) REFERENCES asignaturas(id_asignatura)
);

CREATE TABLE solicitudes_disponibles (
    id_centro INT,
    tipo_solicitud INT CHECK(tipo_solicitud IN (1, 2, 3, 4)),
    FOREIGN KEY (id_centro) REFERENCES centros_regionales(id_centro),
    PRIMARY KEY (id_centro, tipo_solicitud)
);

CREATE TABLE dias_matricula (
    id_proceso INT,
    indice_inicial INT,
    indice_final INT,
    dia_comienzo_matricula DATETIME,
    dia_final_matricula DATETIME,
    FOREIGN KEY (id_proceso) REFERENCES Procesos_academicos(id_proceso),
    PRIMARY KEY (id_proceso)
);

--Alter table Asignaturas_PAC add id_seccion int ;

--alter table Asignaturas_pac drop column id_seccion ;



--Alter Table secciones add constraint FK_secciones_APAC Foreign key (id_seccion) references asignaturas_PAC (id_seccion);

--Alter Table Asignaturas_PAC drop constraint FK_secciones --Foreign key (id_seccion) references secciones (id_seccion);


Alter table secciones drop constraint FK__secciones__id_as__41EDCAC5;

Alter Table secciones add constraint FK_sec_PAC Foreign key (id_asignatura) references  Asignaturas_PAC (id_asignatura_pac);

--alter table asignaturas drop constraint FK_secciones_asig_PAC
alter table asignaturas_PAC drop constraint FK__Asignatur__id_as__5D95E53A;




--Alter Table secciones add constraint FK_secciones_asig_PAC Foreign key (id_asignatura) references asignaturas (id_asignatura);

alter table secciones drop constraint FK_secciones_asig_PAC;


ALTER TABLE secciones ADD CONSTRAINT FK_secciones_asig_PAC FOREIGN KEY (id_asignatura) REFERENCES asignaturas_PAC (id_asignatura_pac);
--alter table secciones drop constraint FK_secciones_asig_PAC;
--borrar manualmente alter table Asignaturas_PAC drop constraint FK__Asignatur__id_as;

--Alter table secciones add constraint fk_seccion_PAC foreign key (id_asignatura) references asignaturas_PAC (id_asignatura_pac);