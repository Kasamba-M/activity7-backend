CREATE TABLE IF NOT EXISTS records (
  id SERIAL PRIMARY KEY,
  title VARCHAR(80) NOT NULL,
  category VARCHAR(40) NOT NULL,
  description VARCHAR(300) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('Pending', 'In progress', 'Completed')),
  CONSTRAINT title_length CHECK (char_length(trim(title)) BETWEEN 3 AND 80),
  CONSTRAINT category_length CHECK (char_length(trim(category)) BETWEEN 2 AND 40),
  CONSTRAINT description_length CHECK (char_length(trim(description)) BETWEEN 5 AND 300)
);
