ALTER TABLE usuarios
ADD correoElectronico NVARCHAR(255);

INSERT INTO usuarios (nombre_usuario, password_hash, correoElectronico)
VALUES ('20181030913', '$2b$12$A9NoXVOx0Wr1luys8Mb9me/crCyo8TA4jSPIhyUAnt7ZhckXQt/Yi', 'papardosmith1917@gmail.com');