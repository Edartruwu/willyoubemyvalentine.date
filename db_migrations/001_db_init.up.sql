CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE auth_users (
    id UUID PRIMARY KEY,                          -- Unique identifier for the user
    google_id VARCHAR(255) NOT NULL,              -- `googleId` field
    name VARCHAR(255) NOT NULL,                   -- Name with a max length of 255 characters
    user_slug VARCHAR(255) NOT NULL UNIQUE,       -- `userSlug` field (unique identifier for the user)
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,  -- Timestamp for when the user was created
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,  -- Timestamp for when the user was last updated
    CHECK (user_slug ~ '^[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*$') -- Validation for `userSlug`
);

CREATE TABLE user_session (
    id CHAR(64) NOT NULL PRIMARY KEY,             -- Session ID (fixed length for sha256 hex)
    user_id UUID NOT NULL REFERENCES auth_users(id), -- Foreign key to `auth_users`
    expires_at TIMESTAMPTZ NOT NULL              -- Expiration timestamp
);

-- Automatically update `updated_at` on row changes
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON auth_users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
