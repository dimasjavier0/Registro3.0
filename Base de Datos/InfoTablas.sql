INSERT INTO carreras(nombre_carrera, puntaje_minimo_PAA)
VALUES
	('Periodismo',	900),
	('Historia',	700),
	('Ingenier�a en Sistemas',1000),
	('Medicina',	1100),
	('Enfermer�a',	900);

INSERT INTO tipos_examen_admision (id_tipo_examen, nombre_examen)
VALUES
    (1, 'Prueba de Aptitud Acad�mica'),
    (2, 'Prueba de Aprovechamiento Matem�tico'),
    (3, 'Prueba de Conocimiento de Ciencias Naturales y de La Salud');

INSERT INTO requisitos_carreras(id_carrera,id_tipo_examen,puntaje_minimo_examen)
VALUES
	(3,2, 400),
	(4,2, 500),
	(5,3, 400)

INSERT INTO departamentos (nombre_departamento)
VALUES
    ('Atl�ntida'),
	('Col�n'),
	('Comayagua'),
	('Cop�n'),
	('Cort�s'),
	('Choluteca'),
	('El Para�so'),
	('Francisco Moraz�n'),
	('Gracias a Dios'),
	('Intibuc�'),
	('Islas de la Bah�a'),
	('La Paz'),
	('Lempira');

-- Insertar datos en la tabla municipios
INSERT INTO municipios (nombre_municipio, id_departamento)
VALUES
    ('La Ceiba', 1),
	('Comayagua', 3),
	('San Pedro Sula', 5),
	('Choluteca', 6),
    ('Tegucigalpa', 8);

-- Insertar datos en la tabla direcciones
INSERT INTO direcciones (descripcion, id_municipio)
VALUES
	('Barrio El Centro, La Ceiba', 1),
	('Colonia San Miguel ,Comayagua', 2), 
    ('Sector Pedregal, San Pedro Sula', 3),
	('Km 5 salida a San Marcos de Col�n, Choluteca',4),
    ('Boulevard Suyapa, Tegucigalpa', 5);

-- Insertar datos en la tabla centros_regionales
INSERT INTO centros_regionales (id_centro, nombre_centro, id_direccion)
VALUES
    (1, 'UNAH Valle de Sula', 3),
    (2, 'Ciudad Universitaria', 5),
    (3, 'Centro Universitario Regional del Centro', 2),
	(4, 'Centro Universitario Regional de Litoral Atl�ntico', 1),
	(5, 'Centro Universitario Regional del Litoral Pac�fico', 4);

-- Insertar datos en la tabla departamentos_academicos
INSERT INTO departamentos_academicos (nombre)
VALUES
	('Departamento de Ingenieria en Sistemas'),
	('Departamento de Sociolog�a'),
	('Departamento de Matem�tica Aplicada'),
	('Departamento de Matem�tica Pura');