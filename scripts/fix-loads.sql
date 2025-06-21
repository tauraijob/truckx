-- First, disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;

-- Update specifications to a valid empty JSON object
UPDATE `load` 
SET specifications = '{}'
WHERE specifications IS NULL 
   OR specifications = '' 
   OR specifications = 'null'
   OR specifications = 'undefined'
   OR specifications = '[]';

-- Update images to a valid empty JSON array
UPDATE `load` 
SET images = '[]'
WHERE images IS NULL 
   OR images = '' 
   OR images = 'null'
   OR images = 'undefined'
   OR images = '{}';

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1; 