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

use registro
GRANT EXECUTE ON [dbo].[RegistrarDocente] TO [asd];
