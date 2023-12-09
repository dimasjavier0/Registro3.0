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
