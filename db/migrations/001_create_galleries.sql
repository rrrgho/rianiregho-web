-- Gallery: a story (title, date, text) with many photos shown as a slideshow.
-- Idempotent: safe to run more than once.
BEGIN;

CREATE TABLE IF NOT EXISTS galleries (
  id          uuid PRIMARY KEY,
  user_id     uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       varchar(255) NOT NULL,
  story       text,
  taken_date  date,
  created_at  timestamp(0) without time zone,
  updated_at  timestamp(0) without time zone,
  deleted_at  timestamp(0) without time zone
);
CREATE INDEX IF NOT EXISTS galleries_user_id_index ON galleries (user_id);
CREATE INDEX IF NOT EXISTS galleries_taken_date_index ON galleries (taken_date);

CREATE TABLE IF NOT EXISTS gallery_photos (
  id          uuid PRIMARY KEY,
  gallery_id  uuid NOT NULL REFERENCES galleries(id) ON DELETE CASCADE,
  image_path  varchar(255) NOT NULL,
  position    integer NOT NULL DEFAULT 0,
  created_at  timestamp(0) without time zone
);
CREATE INDEX IF NOT EXISTS gallery_photos_gallery_id_index ON gallery_photos (gallery_id, position);

COMMIT;
