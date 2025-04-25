CREATE OR REPLACE FUNCTION increment_likes()
RETURNS TRIGGER AS $$
BEGIN
UPDATE "Post"
SET "likesCount" = "likesCount" + 1
WHERE id = NEW."postId";
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER like_created
    AFTER INSERT ON "Like"
    FOR EACH ROW EXECUTE FUNCTION increment_likes();


CREATE OR REPLACE FUNCTION decrement_likes()
RETURNS TRIGGER AS $$
BEGIN
UPDATE "Post"
SET "likesCount" = GREATEST("likesCount" - 1, 0)
WHERE id = OLD."postId";
RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER like_deleted
    AFTER DELETE ON "Like"
    FOR EACH ROW EXECUTE FUNCTION decrement_likes();
