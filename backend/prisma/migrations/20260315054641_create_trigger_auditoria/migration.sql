-- 1. Função que será executada pela trigger (log de auditoria)
CREATE OR REPLACE FUNCTION log_transacao_status()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO "AuditoriaLog" ("id", "tabela", "registroId", "acao", "dadosAntigos", "dadosNovos", "createdAt")
        VALUES (gen_random_uuid(), 'Transacao', NEW.id, 'ALTERACAO_STATUS', COALESCE(OLD.status, ''), COALESCE(NEW.status, ''), now());
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Trigger: após qualquer UPDATE na tabela "Transacao"
CREATE TRIGGER trigger_auditoria_transacao
AFTER UPDATE ON "Transacao"
FOR EACH ROW
EXECUTE PROCEDURE log_transacao_status();
