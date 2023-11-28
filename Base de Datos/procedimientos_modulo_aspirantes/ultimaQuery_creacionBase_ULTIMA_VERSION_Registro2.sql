create database Registro2;

use Registro2;

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

/*
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

*/
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


--Alter table secciones drop constraint FK__secciones__id_as__41EDCAC5;

Alter Table secciones add constraint FK_sec_PAC Foreign key (id_asignatura) references  Asignaturas_PAC (id_asignatura_pac);

--alter table asignaturas drop constraint FK_secciones_asig_PAC
--alter table asignaturas_PAC drop constraint FK__Asignatur__id_as__5D95E53A;




--Alter Table secciones add constraint FK_secciones_asig_PAC Foreign key (id_asignatura) references asignaturas (id_asignatura);

--alter table secciones drop constraint FK_secciones_asig_PAC;


--ALTER TABLE secciones ADD CONSTRAINT FK_secciones_asig_PAC FOREIGN KEY (id_asignatura) REFERENCES asignaturas_PAC (id_asignatura_pac);
--alter table secciones drop constraint FK_secciones_asig_PAC;
--borrar manualmente alter table Asignaturas_PAC drop constraint FK__Asignatur__id_as;

--Alter table secciones add constraint fk_seccion_PAC foreign key (id_asignatura) references asignaturas_PAC (id_asignatura_pac);

INSERT INTO carreras (nombre_carrera) VALUES
('Ingeniería en Sistemas'),
('Medicina'),
('Derecho'),
('Arquitectura'),
('Contaduría Pública');

INSERT INTO tipos_examen_admision (id_tipo_examen, nombre_examen) VALUES
(1, 'Prueba de Aptitud Académica'),
(2, 'Examen de Conocimientos Generales'),
(3, 'Examen de Matemáticas'),
(4, 'Examen de Ciencias'),
(5, 'Examen de Humanidades');

INSERT INTO requisitos_carreras (id_requisito_carrera, id_carrera, id_tipo_examen, puntaje_minimo_examen) VALUES
(1, 1, 1, 70),
(2, 2, 2, 75),
(3, 3, 3, 65),
(4, 4, 4, 60),
(5, 5, 5, 80);

INSERT INTO departamentos (nombre_departamento) VALUES
('Francisco Morazán'),
('Cortés'),
('Yoro'),
('Atlántida'),
('Comayagua');

INSERT INTO municipios (nombre_municipio, id_departamento) VALUES
('Tegucigalpa', 1),
('San Pedro Sula', 2),
('El Progreso', 3),
('La Ceiba', 4),
('Comayagua', 5);

INSERT INTO direcciones (descripcion, id_municipio) VALUES
('Colonia Universidad', 1),
('Barrio Las Acacias', 2),
('Sector El Centro', 3),
('Avenida Atlántida', 4),
('Residencial Los Pinos', 5);


INSERT INTO centros_regionales (id_centro, nombre_centro, id_direccion) VALUES
(1, 'Centro Universitario Tegucigalpa', 1),
(2, 'Centro Universitario San Pedro Sula', 2),
(3, 'Centro Universitario El Progreso', 3),
(4, 'Centro Universitario La Ceiba', 4),
(5, 'Centro Universitario Comayagua', 5);

INSERT INTO usuarios (nombre_usuario, password_hash) VALUES
('juan.perez@unah.hn', 'hash1'),
('maria.lopez@unah.hn', 'hash2'),
('carlos.gomez@unah.hn', 'hash3'),
('lucia.hernandez@unah.hn', 'hash4'),
('david.martinez@unah.hn', 'hash5');

INSERT INTO personas (numero_identidad, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, telefono, correo, id_usuario) VALUES
('0801198512345', 'Juan', 'Alberto', 'Pérez', 'Cáceres', '99887766', 'juan.perez@unah.hn', 1),
('0802198523456', 'María', 'Fernanda', 'López', 'Morales', '99887767', 'maria.lopez@unah.hn', 2),
('0803198534567', 'Carlos', 'Enrique', 'Gómez', 'Fernández', '99887768', 'carlos.gomez@unah.hn', 3),
('0804198545678', 'Lucía', 'Isabel', 'Hernández', 'Valladares', '99887769', 'lucia.hernandez@unah.hn', 4),
('0805198556789', 'David', 'José', 'Martínez', 'Rodríguez', '99887770', 'david.martinez@unah.hn', 5);

INSERT INTO aspirantes (id_aspirante, id_persona, carrera_principal, carrera_secundaria, id_centro) VALUES
(1, '0801198512345', 1, 2, 1),
(2, '0802198523456', 2, 3, 2),
(3, '0803198534567', 3, 4, 3),
(4, '0804198545678', 4, 5, 4),
(5, '0805198556789', 5, 1, 5);

INSERT INTO resultados_examen_admision (id_aspirante, FechaExamen, id_tipo_examen, nota, id_persona) VALUES
(1, '2023-01-15', 1, 85, '0801198512345'),
(2, '2023-01-16', 2, 80, '0802198523456'),
(3, '2023-01-17', 3, 75, '0803198534567'),
(4, '2023-01-18', 4, 70, '0804198545678'),
(5, '2023-01-19', 5, 65, '0805198556789');

INSERT INTO estudiantes_aprobados (id_aspirante, id_carrera) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);

INSERT INTO estudiantes (num_cuenta, id_persona, id_carrera, id_direccion, id_centro_regional, correo_institucional) VALUES
('20230001', '0801198512345', 1, 1, 1, '20230001@est.unah.hn'),
('20230002', '0802198523456', 2, 2, 2, '20230002@est.unah.hn'),
('20230003', '0803198534567', 3, 3, 3, '20230003@est.unah.hn'),
('20230004', '0804198545678', 4, 4, 4, '20230004@est.unah.hn'),
('20230005', '0805198556789', 5, 5, 5, '20230005@est.unah.hn');

INSERT INTO departamentos_academicos (nombre) VALUES
('Ciencias de la Computación'),
('Medicina y Cirugía'),
('Ciencias Jurídicas'),
('Arquitectura y Diseño'),
('Ciencias Económicas y Administrativas');

INSERT INTO docentes (id_persona, id_dep_academico, id_centro) VALUES
('0801198512345', 1, 1),
('0802198523456', 2, 2),
('0803198534567', 3, 3),
('0804198545678', 4, 4),
('0805198556789', 5, 5);

INSERT INTO periodos_academicos (num_periodo, descripcion, fecha_inicio, fecha_fin, anio_academico) VALUES
(1, 'Primer Semestre', '2023-01-15', '2023-06-30', 2023),
(2, 'Segundo Semestre', '2023-07-15', '2023-12-15', 2023),
(3, 'Tercer Periodo', '2023-09-01', '2023-12-15', 2023),
(1, 'Primer Semestre', '2024-01-15', '2024-06-30', 2024),
(2, 'Segundo Semestre', '2024-07-15', '2024-12-15', 2024);

INSERT INTO Procesos_academicos_periodo (estado, id_periodo) VALUES
(1, 1),
(0, 2),
(1, 3),
(0, 4),
(1, 5);

INSERT INTO Procesos_academicos (id_PAC, tipo_proceso, descripcion, fecha_inicio, fecha_fin) VALUES
(1, 1, 'Proceso de Matrícula', '2023-01-01', '2023-01-10'),
(2, 2, 'Proceso de Evaluación', '2023-06-01', '2023-06-10'),
(3, 1, 'Proceso de Matrícula', '2023-07-01', '2023-07-10'),
(4, 2, 'Proceso de Evaluación', '2023-12-01', '2023-12-10'),
(5, 1, 'Proceso de Matrícula', '2024-01-01', '2024-01-10');

INSERT INTO estudiantes (num_cuenta, id_persona, id_carrera, id_direccion, id_centro_regional, correo_institucional) VALUES
('201901234', '0801198512345', 1, 1, 1, 'estudiante1@unah.hn'),
('201902345', '0802198523456', 2, 2, 2, 'estudiante2@unah.hn'),
('201903456', '0803198534567', 3, 3, 3, 'estudiante3@unah.hn'),
('201904567', '0804198545678', 4, 4, 4, 'estudiante4@unah.hn'),
('201905678', '0805198556789', 5, 5, 5, 'estudiante5@unah.hn');

INSERT INTO Solicitudes (id_solicitud, tipo_solicitud, num_cuenta_solicitante, fecha_solicitud, fecha_respuesta, estado) VALUES
(1, 'Cambio de Carrera', '201901234', '2023-03-01', '2023-03-05', 1),
(2, 'Cancelación de Clase', '201902345', '2023-04-01', '2023-04-05', 0),
(3, 'Reposición de Examen', '201903456', '2023-05-01', '2023-05-05', 1),
(4, 'Cambio de Centro', '201904567', '2023-06-01', '2023-06-05', 1),
(5, 'Solicitud de Práctica', '201905678', '2023-07-01', '2023-07-05', 0);

INSERT INTO Pago_Reposicion_Solicitud (id_solicitud, fecha_pago, precio_pago) VALUES
(3, '2023-05-02', 500);

INSERT INTO Cancelacion_Excepcional_Solicitud (id_solicitud, motivo_cancelacion) VALUES
(1, 'Enfermedad'),
(2, 'Viaje de emergencia'),
(3, 'Problemas personales'),
(4, 'Dificultades financieras'),
(5, 'Cambio de ciudad');

INSERT INTO Cambio_Centro_Regional_Solicitud (id_solicitud, id_centro_destino) VALUES
(1, 2),
(2, 3),
(3, 4),
(4, 5),
(5, 1);

INSERT INTO Cambio_Carrera_Solicitud (id_solicitud, id_carrera_destino) VALUES
(1, 2),
(2, 3),
(3, 4),
(4, 5),
(5, 1);

INSERT INTO carreras_CentrosRegionales (id_centro, id_carrera) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);

INSERT INTO edificios (nombre, id_centro) VALUES
('Edificio Central', 1),
('Edificio de Ingenierías', 2),
('Edificio de Ciencias Médicas', 3),
('Edificio de Humanidades', 4),
('Edificio Administrativo', 5);

INSERT INTO aulas (numero_aula, id_edificio) VALUES
('Aula 101', 1),
('Aula 201', 2),
('Aula 301', 3),
('Aula 401', 4),
('Aula 501', 5);

INSERT INTO asignaturas (codigo_asignatura, nombre_asig, unidades_valorativas, id_dep_academico) VALUES
('IS-101', 'Introducción a la Informática', 3, 1),
('ME-201', 'Anatomía Humana', 4, 2),
('DE-301', 'Derecho Constitucional', 3, 3),
('AR-401', 'Diseño Arquitectónico', 4, 4),
('CP-501', 'Contabilidad General', 3, 5);

INSERT INTO asignaturas_carreras (id_asignatura, id_carrera, id_requisito) VALUES
(1, 1, NULL),
(2, 2, NULL),
(3, 3, NULL),
(4, 4, NULL),
(5, 5, NULL);

INSERT INTO secciones (id_asignatura, id_docente, id_aula, hora_inicio, hora_fin, dias, cupos_maximos, ruta_video) VALUES
(1, 1, 1, 800, 950, 'Lunes y Miércoles', 30, 'ruta_video_1'),
(2, 2, 2, 1000, 1150, 'Martes y Jueves', 30, 'ruta_video_2'),
(3, 3, 3, 1200, 1350, 'Lunes y Miércoles', 30, 'ruta_video_3'),
(4, 4, 4, 1400, 1550, 'Martes y Jueves', 30, 'ruta_video_4'),
(5, 5, 5, 1600, 1750, 'Lunes y Miércoles', 30, 'ruta_video_5');

INSERT INTO estado_calificacion (estado) VALUES
('Aprobado'),
('Reprobado'),
('Abandono'),
('Pendiente'),
('Incompleto');

INSERT INTO matricula_estudiantes (id_estudiante, id_seccion, nota, id_estado_calificacion) VALUES
('20230001', 1, 85, 1),
('20230002', 2, 80, 1),
('20230003', 3, 75, 2),
('20230004', 4, 70, 2),
('20230005', 5, 65, 3);

-- Suponiendo que las fotografías están almacenadas como archivos binarios.
INSERT INTO fotos_estudiantes (id_estudiante, fotografia) VALUES
('20230001', 0x0123456789ABCDEF),
('20230002', 0x0123456789ABCDEF),
('20230003', 0x0123456789ABCDEF),
('20230004', 0x0123456789ABCDEF),
('20230005', 0x0123456789ABCDEF);

INSERT INTO Administradores (id_usuario, correo) VALUES
(1, 'admin1@unah.hn'),
(2, 'admin2@unah.hn'),
(3, 'admin3@unah.hn'),
(4, 'admin4@unah.hn'),
(5, 'admin5@unah.hn');

INSERT INTO Dias (id_dia, descripcion) VALUES
(1, 'Lunes'),
(2, 'Martes'),
(3, 'Miércoles'),
(4, 'Jueves'),
(5, 'Viernes');

INSERT INTO Dias_asignatura (id_seccion, id_dia) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);

INSERT INTO Anios_academicos (id_anio, fecha_inicio, fecha_fin, id_periodo_academico) VALUES
(1, '2023-01-01', '2023-12-31', 1),
(2, '2024-01-01', '2024-12-31', 2),
(3, '2025-01-01', '2025-12-31', 3),
(4, '2026-01-01', '2026-12-31', 4),
(5, '2027-01-01', '2027-12-31', 5);

INSERT INTO Asignaturas_PAC (id_asignatura_pac, id_periodo, id_carrera, id_asignatura_carrera) VALUES
(1, 1, 1, 1),
(2, 2, 2, 2),
(3, 3, 3, 3),
(4, 4, 4, 4),
(5, 5, 5, 5);

INSERT INTO solicitudes_disponibles (id_centro, tipo_solicitud) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 1);

INSERT INTO dias_matricula (id_proceso, indice_inicial, indice_final, dia_comienzo_matricula, dia_final_matricula) VALUES
(1, 0, 50, '2023-01-01', '2023-01-05'),
(2, 51, 100, '2023-06-01', '2023-06-05'),
(3, 0, 50, '2023-07-01', '2023-07-05'),
(4, 51, 100, '2023-12-01', '2023-12-05'),
(5, 0, 50, '2024-01-01', '2024-01-05');


ALTER TABLE Usuarios add rol Nvarchar(30);

ALTER TABLE usuarios
ADD correoElectronico NVARCHAR(255);


CREATE SEQUENCE seq_estudiantes
    AS INT
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 3000
    CYCLE;




	
INSERT INTO usuarios (nombre_usuario, password_hash, correoElectronico)
VALUES ('20181030913', '$2b$12$A9NoXVOx0Wr1luys8Mb9me/crCyo8TA4jSPIhyUAnt7ZhckXQt/Yi', 'papardosmith1917@gmail.com');


--- PROCEDIMIENTOS ALMACENDOS
USE [Registro2]
GO
/****** Object:  StoredProcedure [dbo].[ActualizarCorreoEstudiante]    Script Date: 27/11/2023 19:59:32 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

Create PROCEDURE [dbo].[ActualizarCorreoEstudiante]
    @Identidad NVARCHAR(13)
AS
BEGIN 
    DECLARE @Nombre1 nvarchar(100), @Nombre2 nvarchar(100), @Apellido1 nvarchar(100), @Apellido2 nvarchar(100)
    DECLARE @BaseCorreo nvarchar(100), @Contador int, @CorreoUnico nvarchar(100)
	
    -- Obtener los nombres y apellidos del estudiante
    SELECT @Nombre1 = primer_nombre, @Nombre2 = segundo_nombre, @Apellido1 = primer_apellido, @Apellido2 = segundo_apellido
    FROM personas
    WHERE numero_identidad = @Identidad
	
    -- Crear la base del correo electrónico
    SET @BaseCorreo = LOWER(REPLACE(@Nombre1, ' ', '') + '.' + REPLACE(@Nombre2, ' ', '') + '.' + REPLACE(@Apellido1, ' ', '') + '.' + REPLACE(@Apellido2, ' ', '') + '@ejemplo.com')
    SET @Contador = 1
    SET @CorreoUnico = @BaseCorreo 

    -- Verificar si el correo ya existe y modificarlo si es necesario
    WHILE EXISTS(SELECT 1 FROM estudiantes WHERE correo_institucional = @CorreoUnico)
    BEGIN
		
        SET @CorreoUnico = LEFT(@BaseCorreo, 100 - LEN(CAST(@Contador AS nvarchar))) + CAST(@Contador AS nvarchar) + '@unah.hn'
        SET @Contador = @Contador + 1
    END

    -- Actualizar el correo del estudiante
    UPDATE estudiantes
    SET correo_institucional = @CorreoUnico
    WHERE id_persona = @Identidad
END
GO




USE [Registro2]
GO
/****** Object:  StoredProcedure [dbo].[agregar_aspirante]    Script Date: 27/11/2023 19:51:21 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
Create PROCEDURE [dbo].[agregar_aspirante]
    @p_numero_identidad NVARCHAR(13),
    @p_primer_nombre NVARCHAR(20),
    @p_segundo_nombre NVARCHAR(20),
    @p_primer_apellido NVARCHAR(20),
    @p_segundo_apellido NVARCHAR(20),
    @p_telefono NVARCHAR(8),
    @p_correo NVARCHAR(50),
    @p_carrera_principal INT,
    @p_carrera_secundaria INT,
    @p_id_centro INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @nuevoIdAspirante INT;
    SELECT @nuevoIdAspirante = ISNULL(MAX(id_aspirante), 0) + 1 FROM aspirantes;

    BEGIN TRANSACTION;
    BEGIN TRY
        IF NOT EXISTS (SELECT * FROM personas WHERE numero_identidad = @p_numero_identidad)
        BEGIN
            INSERT INTO personas (numero_identidad, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, telefono, correo)
            VALUES (@p_numero_identidad, @p_primer_nombre, @p_segundo_nombre, @p_primer_apellido, @p_segundo_apellido, @p_telefono, @p_correo);
        END

		if not exists (select * from aspirantes a where id_persona = @p_numero_identidad )
		begin
			INSERT INTO aspirantes (id_aspirante, id_persona, carrera_principal, carrera_secundaria, id_centro, fecha_solicitud)
			VALUES (@nuevoIdAspirante, @p_numero_identidad, @p_carrera_principal, @p_carrera_secundaria, @p_id_centro, GETDATE());
		end

        
        COMMIT TRANSACTION;

        -- Seleccionar y devolver la información de la persona agregada
        SELECT * FROM personas p
        INNER JOIN aspirantes a ON a.id_persona = p.numero_identidad
        WHERE p.numero_identidad = @p_numero_identidad;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        SELECT 
            ERROR_NUMBER() AS ErrorNumber,
            ERROR_MESSAGE() AS ErrorMessage;
    END CATCH
END
GO
USE [Registro2]
GO
/****** Object:  StoredProcedure [dbo].[agregar_estudiante]    Script Date: 27/11/2023 19:54:37 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
Create PROCEDURE [dbo].[agregar_estudiante]
	@numIdentidad NVARCHAR(13),
	@id_carrera INT -- carrera que aprobo

AS
BEGIN 
	BEGIN TRY
		
		

		declare @id_direccion INT = 5;
		declare @correoPersonal NVARCHAR(100) = (select correo from personas where numero_identidad = @numIdentidad);
		declare @id_centro INT = (select id_centro from aspirantes where id_persona = @numIdentidad);	

		DECLARE @contador INT;
		
		--Verificar que el estudiante no este matriculado
		SELECT @contador = COUNT(id_persona) FROM estudiantes 
		WHERE id_persona = @numIdentidad;

		IF @contador > 0
		BEGIN;
			THROW 51000, 'El estudiante ya esta matriculado.', 1;
		END; 

		--Verificar que la carrera este disponible en el centro regional
		--SELECT @contador = COUNT(*) FROM carreras_CentrosRegionales
		--WHERE id_carrera = @id_carrera and id_centro = @id_centro;

		--IF @contador <= 0
		BEGIN;
			--THROW 51000, 'La carrera no esta disponible en ese centro universitario.', 1;
		--END
		--ELSE
		--BEGIN 
			--Crear el numero de cuenta
			DECLARE @numCuenta NVARCHAR(11);

			DECLARE @anoActual INT = YEAR(GETDATE());

			DECLARE @periodo NVARCHAR(2) = 
			(
				CASE 
					WHEN MONTH(GETDATE()) BETWEEN 5 and 9 THEN '03'
					ELSE '00'
				END
			);
		
			DECLARE @numFinales VARCHAR(4) = FORMAT(NEXT VALUE FOR seq_estudiantes, '0000');
		
			SET @numCuenta = CONCAT(@anoActual, @id_centro, @periodo , @numFinales);

			INSERT INTO estudiantes(num_cuenta,id_persona,id_carrera,id_direccion,id_centro_regional) 
			VALUES (@numCuenta,@numIdentidad,@id_carrera,@id_direccion,@id_centro);

			EXEC dbo.ActualizarCorreoEstudiante @Identidad = @numIdentidad;
			
			-- Eliminar al estudiante de la tabla aspirantes y resultados_examen_admision
			declare  @id_aspirante int = (SELECT id_aspirante FROM aspirantes WHERE id_persona = @numIdentidad);
            DELETE FROM resultados_examen_admision WHERE id_aspirante = @id_aspirante;
            DELETE FROM aspirantes WHERE id_persona = @numIdentidad;
		END

	END TRY
	BEGIN CATCH
		THROW;
		ROLLBACK;
	END CATCH;
END;
GO
USE [Registro2]
GO
/****** Object:  StoredProcedure [dbo].[subir_nota_estudiante]    Script Date: 27/11/2023 19:56:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
Create PROCEDURE [dbo].[subir_nota_estudiante]
	@p_identidad nvarchar(13),
	@p_tipo_examen int,
	@p_nota float

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
	-- agregar si no esta el resultado no existe o no esta subido .
	IF NOT EXISTS (
		select * from resultados_examen_admision r 
		where r.id_persona= @p_identidad
		and r.id_tipo_examen = @p_tipo_examen
	)BEGIN
		declare @id int ;
		set @id = (select id_aspirante from aspirantes where id_persona = @p_identidad);
		if @id is not null
		begin
			insert into resultados_examen_admision(id_aspirante,id_persona,id_tipo_examen,nota)
			values (
				(@id),
				@p_identidad,
				@p_tipo_examen,
				@p_nota
			)
		end

		    
	END
	
	select * from resultados_examen_admision r where r.id_persona = @p_identidad;
	
	
	
END

GO
CREATE PROCEDURE RegistrarDocente
    @Identidad NVARCHAR(100),
    @PrimerNombre NVARCHAR(100),
    @SegundoNombre NVARCHAR(100),
    @PrimerApellido NVARCHAR(100),
    @SegundoApellido NVARCHAR(100),
    @Correo NVARCHAR(100),
    @NumeroEmpleado INT,
    @Foto VARBINARY(MAX),
    @DeptoAcademicoId INT,
    @CentroId INT
AS
BEGIN
    INSERT INTO personas(numero_identidad, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, Correo)
    VALUES (@Identidad, @PrimerNombre, @SegundoNombre, @PrimerApellido, @SegundoApellido, @Correo);

    INSERT INTO docentes (num_empleado, fotografia, id_persona, id_dep_academico, id_centro)
    VALUES (@NumeroEmpleado, @Foto, @Identidad, @DeptoAcademicoId, @CentroId);
END;

GO