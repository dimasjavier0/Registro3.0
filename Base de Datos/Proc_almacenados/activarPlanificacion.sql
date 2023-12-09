CREATE PROCEDURE ActivarPlanificacion
	@fechaInicio NVARCHAR(50),
	@fechaFin NVARCHAR(50),
	@tipoPeriodo NCHAR(5)
AS
BEGIN
	SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;

		DECLARE @fecha1 DATE;
		SET @fecha1 = CONVERT(DATE, @fechaInicio, 23);

		DECLARE @fecha2 DATE;
		SET @fecha2 = CONVERT(DATE, @fechaFin, 23);

		INSERT INTO Procesos_academicos_periodo(estado, id_periodo)
		SELECT 1, id_periodo
		FROM periodos_academicos
		WHERE tipo_periodo = @tipoPeriodo  AND (GETDATE() BETWEEN fecha_inicio AND fecha_fin);

		DECLARE @UltimoID INT;
		SET @UltimoID = SCOPE_IDENTITY()

        INSERT INTO Procesos_academicos(id_PAC, tipo_proceso, descripcion, fecha_inicio, fecha_fin)
		VALUES (@UltimoID, 3, 'Proceso de Planificación', @fecha1, @fecha2)

        COMMIT;

		SELECT * 
		FROM Procesos_academicos pa
		INNER JOIN Procesos_academicos_periodo pap ON  pa.id_PAC = pap.id_proceso_academico
		WHERE (GETDATE() BETWEEN pa.fecha_inicio AND pa.fecha_fin) AND estado = 1 AND pa.tipo_proceso = 3;

    END TRY
    BEGIN CATCH
        ROLLBACK;

        SELECT 
            ERROR_NUMBER() AS ErrorNumber,
            ERROR_MESSAGE() AS ErrorMessage;
    END CATCH;
END;
