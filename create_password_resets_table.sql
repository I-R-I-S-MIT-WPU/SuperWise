-- Create password_resets table for password reset token management
CREATE TABLE IF NOT EXISTS password_resets (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES MUFG(User_ID) ON DELETE CASCADE,
  token_hash VARCHAR(64) NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  INDEX idx_token_hash (token_hash),
  INDEX idx_user_id (user_id),
  INDEX idx_expires_at (expires_at)
);

-- Enable Row Level Security
ALTER TABLE password_resets ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (managed by backend)
CREATE POLICY "Allow all operations on password_resets" ON password_resets
  FOR ALL USING (true) WITH CHECK (true);

-- Create function to automatically delete expired reset tokens
CREATE OR REPLACE FUNCTION delete_expired_reset_tokens()
RETURNS void AS $$
BEGIN
  DELETE FROM password_resets
  WHERE expires_at < NOW() OR used = true;
END;
$$ LANGUAGE plpgsql;

-- Uncomment to run periodically (requires pg_cron extension):
-- SELECT cron.schedule('delete_expired_reset_tokens', '0 */6 * * *', 'SELECT delete_expired_reset_tokens()');
