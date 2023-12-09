ALTER PROCEDURE ActivarRevision
	@fecha_inicio DATE,
	@fecha_fin DATE,
	@idPeriodo INT
AS
BEGIN
	SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
		SET @fecha_inicio = CONVERT(DATE, @fecha_inicio, 23);

		SET @fecha_fin = CONVERT(DATE, @fecha_fin, 23);

		DECLARE @idProceso INT

		SELECT @idProceso = id_proceso FROM Procesos_academicos
		WHERE tipo_proceso = 3;

		INSERT INTO Procesos_academicos_periodo(estado, id_periodo,fecha_inicio,fecha_fin, id_proceso)
		VALUES(1, @idPeriodo,@fecha_inicio, @fecha_fin, @idProceso)
		
        COMMIT;

		SELECT id_proceso_academico , estado, id_periodo,fecha_inicio,fecha_fin, pac.id_proceso
		FROM Procesos_academicos_periodo pac
		INNER JOIN Procesos_academicos pa ON pac.id_proceso = pa.id_proceso
		WHERE  pa.tipo_proceso = 3 ;

    END TRY
    BEGIN CATCH
        ROLLBACK;

        SELECT 
            ERROR_NUMBER() AS ErrorNumber,
            ERROR_MESSAGE() AS ErrorMessage;
    END CATCH;
END;
