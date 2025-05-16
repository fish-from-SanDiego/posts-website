-- Удаление триггеров
DROP TRIGGER IF EXISTS like_created ON "Like";
DROP TRIGGER IF EXISTS like_deleted ON "Like";

-- Удаление функций
DROP FUNCTION IF EXISTS increment_likes();
DROP FUNCTION IF EXISTS decrement_likes();
