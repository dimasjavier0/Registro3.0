CREATE PROCEDURE ActivarMatriculaFF
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;

        DECLARE @TablaTemporal TABLE (PrimaryKey INT);
        DECLARE @fecha_inicio DATETIME;
        DECLARE @fecha_fin DATETIME;

        -- Establecer la fecha y hora actuales como fecha de inicio
        SET @fecha_inicio = GETDATE();

        -- Calcular la fecha de fin (4 días después de la fecha de inicio)
        SET @fecha_fin = DATEADD(DAY, 3, @fecha_inicio);

        -- Insertar en Procesos_academicos_periodo y capturar el id_proceso_academico insertado
        INSERT INTO Procesos_academicos_periodo(estado, id_periodo)
        OUTPUT INSERTED.id_proceso_academico INTO @TablaTemporal
        SELECT 1, id_periodo
        FROM periodos_academicos
        WHERE (DATEDIFF(day, fecha_fin, GETDATE()) <= 10) AND (GETDATE() BETWEEN fecha_inicio AND fecha_fin);

        -- Insertar en Procesos_academicos
        INSERT INTO Procesos_academicos(id_PAC, tipo_proceso, descripcion, fecha_inicio, fecha_fin)
        SELECT PrimaryKey, 1, 'Proceso de Matrícula', @fecha_inicio, @fecha_fin
        FROM @TablaTemporal

        -- Obtener el ID del proceso recién insertado
        DECLARE @id_proceso INT;
        SELECT @id_proceso = SCOPE_IDENTITY();

        -- Insertar rangos de índices para cada día en dias_matricula
        -- Primer día: Primer ingreso
        INSERT INTO dias_matricula (id_proceso, indice_inicial, indice_final, dia_comienzo_matricula, dia_final_matricula)
        VALUES (@id_proceso, NULL, NULL, @fecha_inicio, DATEADD(DAY, 1, @fecha_inicio));

        -- Segundo día: Índices de 100 a 80
        INSERT INTO dias_matricula (id_proceso, indice_inicial, indice_final, dia_comienzo_matricula, dia_final_matricula)
        VALUES (@id_proceso, 80, 100, DATEADD(DAY, 1, @fecha_inicio), DATEADD(DAY, 2, @fecha_inicio));

        -- Tercer día: Índices de 79 a 65
        INSERT INTO dias_matricula (id_proceso, indice_inicial, indice_final, dia_comienzo_matricula, dia_final_matricula)
        VALUES (@id_proceso, 65, 79, DATEADD(DAY, 2, @fecha_inicio), DATEADD(DAY, 3, @fecha_inicio));

        -- Cuarto día: Índices de 64 a 0
        INSERT INTO dias_matricula (id_proceso, indice_inicial, indice_final, dia_comienzo_matricula, dia_final_matricula)
        VALUES (@id_proceso, 0, 64, @fecha_fin, DATEADD(DAY, 1, @fecha_fin));

        COMMIT;

        -- Seleccionar los procesos de matrícula activos
        SELECT * 
        FROM Procesos_academicos pa
        INNER JOIN Procesos_academicos_periodo pap ON pa.id_PAC = pap.id_proceso_academico
        WHERE (GETDATE() BETWEEN pa.fecha_inicio AND pa.fecha_fin) AND estado = 1 AND pa.tipo_proceso = 1;

    END TRY
    BEGIN CATCH
        ROLLBACK;

        SELECT 
            ERROR_NUMBER() AS ErrorNumber,
            ERROR_MESSAGE() AS ErrorMessage;
    END CATCH;
END;
