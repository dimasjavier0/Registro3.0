CREATE PROCEDURE crear_seccion
	@idPeriodo INT,
	@idAsignatura INT,
	@idDocente INT,
	@idAula INT,
	@horaInicio INT,
	@horaFin INT,
	@cupos INT,
	@dias NVARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
		
			DECLARE @nuevoId_asig_Pac INT, @id_asig_pac INT, @canSeccion INT;
			SELECT @nuevoId_asig_Pac = ISNULL(MAX(id_asignatura_pac), 0) + 1 FROM Asignaturas_PAC;

			SELECT @id_asig_pac = id_asignatura_pac FROM Asignaturas_PAC
			WHERE id_periodo = @idPeriodo AND id_asignatura_carrera = @idAsignatura

			IF @id_asig_pac = 0
			BEGIN
				INSERT INTO Asignaturas_PAC
				VALUES(@nuevoId_asig_Pac, @idPeriodo, @idAsignatura)

				SET @id_asig_pac = @nuevoId_asig_Pac
			END;

			SELECT @canSeccion = COUNT(id_seccion) FROM secciones
			WHERE id_asignatura = @id_asig_pac
			
			SET @canSeccion = @canSeccion + @horaInicio

			DECLARE @codSeccion NCHAR(4) = FORMAT(@canSeccion, '0000');

			INSERT INTO secciones(id_asignatura,id_docente,id_aula ,hora_inicio,hora_fin,cupos_maximos, cod_seccion)
			VALUES(@id_asig_pac,@idDocente,@idAula, @horaInicio, @horaFin, @cupos, @codSeccion)

			DECLARE @UltimoID INT;
			SET @UltimoID = SCOPE_IDENTITY();

			CREATE TABLE #TempArray (Valor INT);

			INSERT INTO #TempArray (Valor)
			SELECT value
			FROM STRING_SPLIT(@dias, ',');

			INSERT INTO Dias_asignatura
			SELECT @UltimoID, Valor
			FROM #TempArray;

			DROP TABLE #TempArray;
        COMMIT;
			SELECT id_seccion,cod_seccion, id_asignatura, id_aula, id_docente, hora_inicio, hora_fin FROM secciones
			WHERE id_seccion = @UltimoID

    END TRY
    BEGIN CATCH
        ROLLBACK;

        SELECT 
            ERROR_NUMBER() AS ErrorNumber,
            ERROR_MESSAGE() AS ErrorMessage;
    END CATCH;
END;
