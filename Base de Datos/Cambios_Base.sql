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

INSERT INTO usuarios (nombre_usuario, password_hash, correoElectronico)
VALUES ('20181030913', '$2b$12$A9NoXVOx0Wr1luys8Mb9me/crCyo8TA4jSPIhyUAnt7ZhckXQt/Yi', 'papardosmith1917@gmail.com');
