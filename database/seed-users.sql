-- =============================================================================
-- STEP 1: Run the original schema.sql first, then run this seed file
-- Make sure MySQL 8.x is running and perfect_protection_db exists
-- =============================================================================

USE perfect_protection_db;

-- Create admin user (password: admin123 — BCrypt hash)
INSERT IGNORE INTO users (username, email, password_hash, full_name, phone, role, is_active) VALUES
('admin', 'admin@perfectprotection.agency',
 '$2a$12$Y5x7vUijYpLaMoE3ioJ8J.Y6mLgLxDGGnBc5AEqc9qwqKIVz8AJ/a',
 'Chief Operations Officer', '9890011223', 'ADMIN', 1);

-- Create customer user (password: pass123 — BCrypt hash)
INSERT IGNORE INTO users (username, email, password_hash, full_name, phone, role, is_active) VALUES
('principal.ghss', 'principal.ghss@gov.in',
 '$2a$12$PIPMd5TmQO8Rk9kEhW1q7u5p3dRYl1vFGn7z6YdxL.1AZqsmR/X6K',
 'Dr. Rajesh Sen', '9876543210', 'CUSTOMER', 1);

-- =============================================================================
-- Passwords for demo:
--   admin      / admin123
--   principal.ghss / pass123
-- =============================================================================
