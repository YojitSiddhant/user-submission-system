const schema = `
CREATE DATABASE IF NOT EXISTS user_document_submissions
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE user_document_submissions;

CREATE TABLE IF NOT EXISTS submissions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  city VARCHAR(120) NOT NULL,
  attachment_file_name VARCHAR(255) NOT NULL,
  attachment_path VARCHAR(500) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY unique_submission_email (email),
  KEY idx_submission_created_at (created_at),
  KEY idx_submission_full_name (full_name),
  KEY idx_submission_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

process.stdout.write(`${schema.trim()}\n`);
