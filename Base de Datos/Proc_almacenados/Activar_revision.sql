CREATE PROCEDURE ActivarRevision
AS
BEGIN
	SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;

		DECLARE @TablaTemporal TABLE (PrimaryKey INT);

		INSERT INTO Procesos_academicos_periodo(estado, id_periodo)
		OUTPUT INSERTED.id_proceso_academico INTO @TablaTemporal
		SELECT 1, id_periodo
		FROM periodos_academicos
		WHERE (DATEDIFF(day, fecha_fin, GETDATE()) <= 10) AND (GETDATE() BETWEEN fecha_inicio AND fecha_fin);

        INSERT INTO Procesos_academicos(id_PAC, tipo_proceso, descripcion, fecha_inicio, fecha_fin)
		SELECT PrimaryKey, 2, 'Proceso de Evaluación', CONVERT(DATE, GETDATE()), CONVERT(DATE, DATEADD(DAY, 4,GETDATE()))
		FROM @TablaTemporal

        COMMIT;

		SELECT * 
		FROM Procesos_academicos pa
		INNER JOIN Procesos_academicos_periodo pap ON  pa.id_PAC = pap.id_proceso_academico
		WHERE (GETDATE() BETWEEN pa.fecha_inicio AND pa.fecha_fin) AND estado = 1 AND pa.tipo_proceso = 2;

    END TRY
    BEGIN CATCH
        ROLLBACK;

        SELECT 
            ERROR_NUMBER() AS ErrorNumber,
            ERROR_MESSAGE() AS ErrorMessage;
    END CATCH;
END;
