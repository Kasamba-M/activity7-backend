INSERT INTO records (id, title, category, description, status) VALUES
(1, 'Help with recursion in Java', 'Programming', 'I am struggling to understand how recursive methods work, especially with base cases and stack frames. Need clear examples.', 'Pending'),
(2, 'Bayes theorem practice questions', 'Mathematics', 'Need extra practice problems and step-by-step solutions for Bayes’ theorem and conditional probability.', 'In progress'),
(3, 'Normalisation of database tables', 'Databases', 'Confused about 1NF, 2NF and 3NF. Can someone review my ER diagram and normalised tables?', 'Pending'),
(4, 'Debugging ArrayIndexOutOfBounds', 'Programming', 'My Java program keeps throwing ArrayIndexOutOfBoundsException when I try to process student marks. Need help finding the bug.', 'Completed'),
(5, 'Matrix multiplication method', 'Mathematics', 'I need a clear explanation and worked example of multiplying two 3×3 matrices by hand and by formula.', 'Pending'),
(6, 'SQL JOIN types explained', 'Databases', 'Please explain INNER, LEFT, RIGHT and FULL OUTER JOIN with simple student–course examples.', 'In progress'),
(7, 'Understanding Big-O notation', 'Programming', 'I need help analysing the time complexity of a few sorting algorithms and explaining Big-O in plain language.', 'Pending'),
(8, 'Probability tree diagrams', 'Mathematics', 'Struggling to draw and interpret probability tree diagrams for sequential events. Need guided examples.', 'Completed'),
(9, 'Primary vs foreign keys', 'Databases', 'Clarify the difference between primary keys, foreign keys and candidate keys with practical table examples.', 'Pending')
ON CONFLICT (id) DO NOTHING;

SELECT setval(
  pg_get_serial_sequence('records', 'id'),
  COALESCE((SELECT MAX(id) FROM records), 1),
  true
);
