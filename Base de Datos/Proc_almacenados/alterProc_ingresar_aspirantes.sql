ALTER PROCEDURE [dbo].[agregar_aspirante]
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

        INSERT INTO aspirantes (id_aspirante, id_persona, carrera_principal, carrera_secundaria, id_centro, fecha_solicitud)
        VALUES (@nuevoIdAspirante, @p_numero_identidad, @p_carrera_principal, @p_carrera_secundaria, @p_id_centro, GETDATE());

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
    END CATCH
END