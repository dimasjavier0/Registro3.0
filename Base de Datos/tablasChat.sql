
CREATE TABLE Contactos (
    id_contacto INT PRIMARY KEY IDENTITY,
    estudiante_id NVARCHAR(11),
    contacto_id NVARCHAR(11),
    FOREIGN KEY (estudiante_id) REFERENCES estudiantes(num_cuenta),
    FOREIGN KEY (contacto_id) REFERENCES estudiantes(num_cuenta)
);

-- Tabla de Solicitudes de Contacto
CREATE TABLE SolicitudesContacto (
    id_solicitud INT PRIMARY KEY IDENTITY,
    solicitante_id NVARCHAR(11),
    solicitado_id NVARCHAR(11),
    estado NVARCHAR(20),  -- Ejemplo: 'Pendiente', 'Aceptado', 'Rechazado'
    FOREIGN KEY (solicitante_id) REFERENCES estudiantes(num_cuenta),
    FOREIGN KEY (solicitado_id) REFERENCES estudiantes(num_cuenta)
);

-- Tabla de Grupos
CREATE TABLE Grupos (
    id_grupo INT PRIMARY KEY IDENTITY,
    nombre_grupo NVARCHAR(100),
    creador_id NVARCHAR(11),
    FOREIGN KEY (creador_id) REFERENCES estudiantes(num_cuenta)
);

CREATE TABLE MiembrosGrupo (
    id_grupo INT,
    miembro_id NVARCHAR(11),
    FOREIGN KEY (id_grupo) REFERENCES Grupos(id_grupo),
    FOREIGN KEY (miembro_id) REFERENCES estudiantes(num_cuenta),
    PRIMARY KEY (id_grupo, miembro_id)
);

-- Tabla de Mensajes de Grupo
CREATE TABLE MensajesGrupo (
    id_mensaje INT PRIMARY KEY IDENTITY,
    id_grupo INT,
    remitente_id NVARCHAR(11),
    texto NVARCHAR(1000),
    fecha_hora_envio DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (id_grupo) REFERENCES Grupos(id_grupo),
    FOREIGN KEY (remitente_id) REFERENCES estudiantes(num_cuenta)
);

CREATE TABLE Messages (
    id INT PRIMARY KEY IDENTITY,
    senderId INT,
    receiverId INT,
    text NVARCHAR(1000),
    timestamp DATETIME DEFAULT GETDATE()
);