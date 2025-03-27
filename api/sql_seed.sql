
-- Clear existing data (in reverse order of dependencies)
DELETE FROM skill_assessments;
DELETE FROM performance_goals;
DELETE FROM performance_reviews;
DELETE FROM absences;
DELETE FROM employees;
DELETE FROM departments;

-- Create departments
INSERT INTO departments (id, name, description) VALUES
('dept-001', 'Human Resources', 'Manages employee relations and hiring processes'),
('dept-002', 'Information Technology', 'Maintains IT infrastructure and develops software solutions'),
('dept-003', 'Finance', 'Handles company financial operations and reporting'),
('dept-004', 'Marketing', 'Promotes company products and services'),
('dept-005', 'Operations', 'Oversees day-to-day business operations');

-- Create managers first (one per department)
INSERT INTO employees (id, name, position, department, email, phone, status, image_url, hire_date) VALUES
('manager-001', 'Manager 1', 'Human Resources Manager', 'Human Resources', 'manager1@example.com', '555-100', 'active', 'https://randomuser.me/api/portraits/men/10.jpg', '2018-01-15'),
('manager-002', 'Manager 2', 'Information Technology Manager', 'Information Technology', 'manager2@example.com', '555-101', 'active', 'https://randomuser.me/api/portraits/men/11.jpg', '2017-12-16'),
('manager-003', 'Manager 3', 'Finance Manager', 'Finance', 'manager3@example.com', '555-102', 'active', 'https://randomuser.me/api/portraits/men/12.jpg', '2017-11-16'),
('manager-004', 'Manager 4', 'Marketing Manager', 'Marketing', 'manager4@example.com', '555-103', 'active', 'https://randomuser.me/api/portraits/men/13.jpg', '2017-10-17'),
('manager-005', 'Manager 5', 'Operations Manager', 'Operations', 'manager5@example.com', '555-104', 'active', 'https://randomuser.me/api/portraits/men/14.jpg', '2017-09-17');

-- Update departments with managers
UPDATE departments SET manager_id = 'manager-001' WHERE id = 'dept-001';
UPDATE departments SET manager_id = 'manager-002' WHERE id = 'dept-002';
UPDATE departments SET manager_id = 'manager-003' WHERE id = 'dept-003';
UPDATE departments SET manager_id = 'manager-004' WHERE id = 'dept-004';
UPDATE departments SET manager_id = 'manager-005' WHERE id = 'dept-005';

-- Create regular employees
INSERT INTO employees (id, name, position, department, email, phone, status, image_url, hire_date, manager_id) VALUES
('emp-001', 'Employee 1', 'Human Resources Specialist', 'Human Resources', 'employee1@example.com', '555-200', 'active', 'https://randomuser.me/api/portraits/men/30.jpg', '2020-01-15', 'manager-001'),
('emp-002', 'Employee 2', 'Information Technology Specialist', 'Information Technology', 'employee2@example.com', '555-201', 'remote', 'https://randomuser.me/api/portraits/women/31.jpg', '2019-12-26', 'manager-002'),
('emp-003', 'Employee 3', 'Finance Specialist', 'Finance', 'employee3@example.com', '555-202', 'on-leave', 'https://randomuser.me/api/portraits/men/32.jpg', '2019-12-06', 'manager-003'),
('emp-004', 'Employee 4', 'Marketing Specialist', 'Marketing', 'employee4@example.com', '555-203', 'active', 'https://randomuser.me/api/portraits/women/33.jpg', '2019-11-16', 'manager-004'),
('emp-005', 'Employee 5', 'Operations Specialist', 'Operations', 'employee5@example.com', '555-204', 'remote', 'https://randomuser.me/api/portraits/men/34.jpg', '2019-10-27', 'manager-005'),
('emp-006', 'Employee 6', 'Human Resources Specialist', 'Human Resources', 'employee6@example.com', '555-205', 'on-leave', 'https://randomuser.me/api/portraits/women/35.jpg', '2019-10-07', 'manager-001'),
('emp-007', 'Employee 7', 'Information Technology Specialist', 'Information Technology', 'employee7@example.com', '555-206', 'active', 'https://randomuser.me/api/portraits/men/36.jpg', '2019-09-17', 'manager-002'),
('emp-008', 'Employee 8', 'Finance Specialist', 'Finance', 'employee8@example.com', '555-207', 'remote', 'https://randomuser.me/api/portraits/women/37.jpg', '2019-08-28', 'manager-003'),
('emp-009', 'Employee 9', 'Marketing Specialist', 'Marketing', 'employee9@example.com', '555-208', 'on-leave', 'https://randomuser.me/api/portraits/men/38.jpg', '2019-08-08', 'manager-004'),
('emp-010', 'Employee 10', 'Operations Specialist', 'Operations', 'employee10@example.com', '555-209', 'active', 'https://randomuser.me/api/portraits/women/39.jpg', '2019-07-19', 'manager-005'),
('emp-011', 'Employee 11', 'Human Resources Specialist', 'Human Resources', 'employee11@example.com', '555-210', 'remote', 'https://randomuser.me/api/portraits/men/40.jpg', '2019-06-29', 'manager-001'),
('emp-012', 'Employee 12', 'Information Technology Specialist', 'Information Technology', 'employee12@example.com', '555-211', 'on-leave', 'https://randomuser.me/api/portraits/women/41.jpg', '2019-06-09', 'manager-002'),
('emp-013', 'Employee 13', 'Finance Specialist', 'Finance', 'employee13@example.com', '555-212', 'active', 'https://randomuser.me/api/portraits/men/42.jpg', '2019-05-20', 'manager-003'),
('emp-014', 'Employee 14', 'Marketing Specialist', 'Marketing', 'employee14@example.com', '555-213', 'remote', 'https://randomuser.me/api/portraits/women/43.jpg', '2019-04-30', 'manager-004'),
('emp-015', 'Employee 15', 'Operations Specialist', 'Operations', 'employee15@example.com', '555-214', 'on-leave', 'https://randomuser.me/api/portraits/men/44.jpg', '2019-04-10', 'manager-005'),
('emp-016', 'Employee 16', 'Human Resources Specialist', 'Human Resources', 'employee16@example.com', '555-215', 'active', 'https://randomuser.me/api/portraits/women/45.jpg', '2019-03-21', 'manager-001'),
('emp-017', 'Employee 17', 'Information Technology Specialist', 'Information Technology', 'employee17@example.com', '555-216', 'remote', 'https://randomuser.me/api/portraits/men/46.jpg', '2019-03-01', 'manager-002'),
('emp-018', 'Employee 18', 'Finance Specialist', 'Finance', 'employee18@example.com', '555-217', 'on-leave', 'https://randomuser.me/api/portraits/women/47.jpg', '2019-02-09', 'manager-003'),
('emp-019', 'Employee 19', 'Marketing Specialist', 'Marketing', 'employee19@example.com', '555-218', 'active', 'https://randomuser.me/api/portraits/men/48.jpg', '2019-01-20', 'manager-004'),
('emp-020', 'Employee 20', 'Operations Specialist', 'Operations', 'employee20@example.com', '555-219', 'remote', 'https://randomuser.me/api/portraits/women/49.jpg', '2018-12-31', 'manager-005');

-- Create absences (for employees 6-20)
-- Current absences
INSERT INTO absences (id, employee_id, type, status, start_date, end_date, notes, approved_by, request_date) VALUES
('abs-001', 'emp-006', 'Vacation', 'pending', CURRENT_DATE(), DATE_ADD(CURRENT_DATE(), INTERVAL 5 DAY), 'Absence notes for Employee 6', NULL, DATE_SUB(CURRENT_DATE(), INTERVAL 10 DAY)),
('abs-002', 'emp-007', 'Sick Leave', 'approved', DATE_ADD(CURRENT_DATE(), INTERVAL 1 DAY), DATE_ADD(CURRENT_DATE(), INTERVAL 6 DAY), 'Absence notes for Employee 7', 'manager-001', DATE_SUB(CURRENT_DATE(), INTERVAL 10 DAY)),
('abs-003', 'emp-008', 'Personal', 'declined', DATE_ADD(CURRENT_DATE(), INTERVAL 2 DAY), DATE_ADD(CURRENT_DATE(), INTERVAL 7 DAY), 'Absence notes for Employee 8', 'manager-001', DATE_SUB(CURRENT_DATE(), INTERVAL 10 DAY)),
('abs-004', 'emp-009', 'Training', 'pending', DATE_ADD(CURRENT_DATE(), INTERVAL 3 DAY), DATE_ADD(CURRENT_DATE(), INTERVAL 8 DAY), 'Absence notes for Employee 9', NULL, DATE_SUB(CURRENT_DATE(), INTERVAL 10 DAY)),
('abs-005', 'emp-010', 'Vacation', 'approved', DATE_ADD(CURRENT_DATE(), INTERVAL 4 DAY), DATE_ADD(CURRENT_DATE(), INTERVAL 9 DAY), 'Absence notes for Employee 10', 'manager-001', DATE_SUB(CURRENT_DATE(), INTERVAL 10 DAY)),
('abs-006', 'emp-011', 'Sick Leave', 'declined', DATE_ADD(CURRENT_DATE(), INTERVAL 5 DAY), DATE_ADD(CURRENT_DATE(), INTERVAL 10 DAY), 'Absence notes for Employee 11', 'manager-001', DATE_SUB(CURRENT_DATE(), INTERVAL 10 DAY)),
('abs-007', 'emp-012', 'Personal', 'pending', DATE_ADD(CURRENT_DATE(), INTERVAL 6 DAY), DATE_ADD(CURRENT_DATE(), INTERVAL 11 DAY), 'Absence notes for Employee 12', NULL, DATE_SUB(CURRENT_DATE(), INTERVAL 10 DAY)),
('abs-008', 'emp-013', 'Training', 'approved', DATE_ADD(CURRENT_DATE(), INTERVAL 7 DAY), DATE_ADD(CURRENT_DATE(), INTERVAL 12 DAY), 'Absence notes for Employee 13', 'manager-001', DATE_SUB(CURRENT_DATE(), INTERVAL 10 DAY)),
('abs-009', 'emp-014', 'Vacation', 'declined', DATE_ADD(CURRENT_DATE(), INTERVAL 8 DAY), DATE_ADD(CURRENT_DATE(), INTERVAL 13 DAY), 'Absence notes for Employee 14', 'manager-001', DATE_SUB(CURRENT_DATE(), INTERVAL 10 DAY)),
('abs-010', 'emp-015', 'Sick Leave', 'pending', DATE_ADD(CURRENT_DATE(), INTERVAL 9 DAY), DATE_ADD(CURRENT_DATE(), INTERVAL 14 DAY), 'Absence notes for Employee 15', NULL, DATE_SUB(CURRENT_DATE(), INTERVAL 10 DAY));

-- Past absences
INSERT INTO absences (id, employee_id, type, status, start_date, end_date, notes, approved_by, request_date) VALUES
('abs-011', 'emp-006', 'Sick Leave', 'approved', DATE_SUB(CURRENT_DATE(), INTERVAL 35 DAY), DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY), 'Past absence for Employee 6', 'manager-001', DATE_SUB(CURRENT_DATE(), INTERVAL 45 DAY)),
('abs-012', 'emp-007', 'Personal', 'approved', DATE_SUB(CURRENT_DATE(), INTERVAL 36 DAY), DATE_SUB(CURRENT_DATE(), INTERVAL 31 DAY), 'Past absence for Employee 7', 'manager-001', DATE_SUB(CURRENT_DATE(), INTERVAL 45 DAY)),
('abs-013', 'emp-008', 'Training', 'approved', DATE_SUB(CURRENT_DATE(), INTERVAL 37 DAY), DATE_SUB(CURRENT_DATE(), INTERVAL 32 DAY), 'Past absence for Employee 8', 'manager-001', DATE_SUB(CURRENT_DATE(), INTERVAL 45 DAY)),
('abs-014', 'emp-009', 'Vacation', 'approved', DATE_SUB(CURRENT_DATE(), INTERVAL 38 DAY), DATE_SUB(CURRENT_DATE(), INTERVAL 33 DAY), 'Past absence for Employee 9', 'manager-001', DATE_SUB(CURRENT_DATE(), INTERVAL 45 DAY)),
('abs-015', 'emp-010', 'Sick Leave', 'approved', DATE_SUB(CURRENT_DATE(), INTERVAL 39 DAY), DATE_SUB(CURRENT_DATE(), INTERVAL 34 DAY), 'Past absence for Employee 10', 'manager-001', DATE_SUB(CURRENT_DATE(), INTERVAL 45 DAY)),
('abs-016', 'emp-011', 'Personal', 'approved', DATE_SUB(CURRENT_DATE(), INTERVAL 40 DAY), DATE_SUB(CURRENT_DATE(), INTERVAL 35 DAY), 'Past absence for Employee 11', 'manager-001', DATE_SUB(CURRENT_DATE(), INTERVAL 45 DAY)),
('abs-017', 'emp-012', 'Training', 'approved', DATE_SUB(CURRENT_DATE(), INTERVAL 41 DAY), DATE_SUB(CURRENT_DATE(), INTERVAL 36 DAY), 'Past absence for Employee 12', 'manager-001', DATE_SUB(CURRENT_DATE(), INTERVAL 45 DAY)),
('abs-018', 'emp-013', 'Vacation', 'approved', DATE_SUB(CURRENT_DATE(), INTERVAL 42 DAY), DATE_SUB(CURRENT_DATE(), INTERVAL 37 DAY), 'Past absence for Employee 13', 'manager-001', DATE_SUB(CURRENT_DATE(), INTERVAL 45 DAY)),
('abs-019', 'emp-014', 'Sick Leave', 'approved', DATE_SUB(CURRENT_DATE(), INTERVAL 43 DAY), DATE_SUB(CURRENT_DATE(), INTERVAL 38 DAY), 'Past absence for Employee 14', 'manager-001', DATE_SUB(CURRENT_DATE(), INTERVAL 45 DAY)),
('abs-020', 'emp-015', 'Personal', 'approved', DATE_SUB(CURRENT_DATE(), INTERVAL 44 DAY), DATE_SUB(CURRENT_DATE(), INTERVAL 39 DAY), 'Past absence for Employee 15', 'manager-001', DATE_SUB(CURRENT_DATE(), INTERVAL 45 DAY));

-- Create performance reviews for all employees
INSERT INTO performance_reviews (id, employee_id, review_date, review_type, overall_score, last_review_date, next_review_date, notes, reviewer_id) VALUES
('review-001', 'manager-001', DATE_SUB(CURRENT_DATE(), INTERVAL 0 DAY), 'Quarterly', 60, DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY), DATE_ADD(CURRENT_DATE(), INTERVAL 90 DAY), 'Performance notes for Manager 1', 'manager-001'),
('review-002', 'manager-002', DATE_SUB(CURRENT_DATE(), INTERVAL 15 DAY), 'Semi-Annual', 61, DATE_SUB(CURRENT_DATE(), INTERVAL 105 DAY), DATE_ADD(CURRENT_DATE(), INTERVAL 85 DAY), 'Performance notes for Manager 2', 'manager-001'),
('review-003', 'manager-003', DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY), 'Annual', 62, DATE_SUB(CURRENT_DATE(), INTERVAL 120 DAY), DATE_ADD(CURRENT_DATE(), INTERVAL 80 DAY), 'Performance notes for Manager 3', 'manager-001'),
('review-004', 'manager-004', DATE_SUB(CURRENT_DATE(), INTERVAL 45 DAY), 'Quarterly', 63, DATE_SUB(CURRENT_DATE(), INTERVAL 135 DAY), DATE_ADD(CURRENT_DATE(), INTERVAL 75 DAY), 'Performance notes for Manager 4', 'manager-001'),
('review-005', 'manager-005', DATE_SUB(CURRENT_DATE(), INTERVAL 60 DAY), 'Semi-Annual', 64, DATE_SUB(CURRENT_DATE(), INTERVAL 150 DAY), DATE_ADD(CURRENT_DATE(), INTERVAL 70 DAY), 'Performance notes for Manager 5', 'manager-001'),
('review-006', 'emp-001', DATE_SUB(CURRENT_DATE(), INTERVAL 75 DAY), 'Annual', 65, DATE_SUB(CURRENT_DATE(), INTERVAL 165 DAY), DATE_ADD(CURRENT_DATE(), INTERVAL 65 DAY), 'Performance notes for Employee 1', 'manager-001'),
('review-007', 'emp-002', DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY), 'Quarterly', 66, DATE_SUB(CURRENT_DATE(), INTERVAL 180 DAY), DATE_ADD(CURRENT_DATE(), INTERVAL 60 DAY), 'Performance notes for Employee 2', 'manager-001'),
('review-008', 'emp-003', DATE_SUB(CURRENT_DATE(), INTERVAL 105 DAY), 'Semi-Annual', 67, DATE_SUB(CURRENT_DATE(), INTERVAL 195 DAY), DATE_ADD(CURRENT_DATE(), INTERVAL 55 DAY), 'Performance notes for Employee 3', 'manager-001'),
('review-009', 'emp-004', DATE_SUB(CURRENT_DATE(), INTERVAL 120 DAY), 'Annual', 68, DATE_SUB(CURRENT_DATE(), INTERVAL 210 DAY), DATE_ADD(CURRENT_DATE(), INTERVAL 50 DAY), 'Performance notes for Employee 4', 'manager-001'),
('review-010', 'emp-005', DATE_SUB(CURRENT_DATE(), INTERVAL 135 DAY), 'Quarterly', 69, DATE_SUB(CURRENT_DATE(), INTERVAL 225 DAY), DATE_ADD(CURRENT_DATE(), INTERVAL 45 DAY), 'Performance notes for Employee 5', 'manager-001'),
('review-011', 'emp-006', DATE_SUB(CURRENT_DATE(), INTERVAL 150 DAY), 'Semi-Annual', 70, DATE_SUB(CURRENT_DATE(), INTERVAL 240 DAY), DATE_ADD(CURRENT_DATE(), INTERVAL 40 DAY), 'Performance notes for Employee 6', 'manager-001'),
('review-012', 'emp-007', DATE_SUB(CURRENT_DATE(), INTERVAL 165 DAY), 'Annual', 71, DATE_SUB(CURRENT_DATE(), INTERVAL 255 DAY), DATE_ADD(CURRENT_DATE(), INTERVAL 35 DAY), 'Performance notes for Employee 7', 'manager-001'),
('review-013', 'emp-008', DATE_SUB(CURRENT_DATE(), INTERVAL 180 DAY), 'Quarterly', 72, DATE_SUB(CURRENT_DATE(), INTERVAL 270 DAY), DATE_ADD(CURRENT_DATE(), INTERVAL 30 DAY), 'Performance notes for Employee 8', 'manager-001'),
('review-014', 'emp-009', DATE_SUB(CURRENT_DATE(), INTERVAL 195 DAY), 'Semi-Annual', 73, DATE_SUB(CURRENT_DATE(), INTERVAL 285 DAY), DATE_ADD(CURRENT_DATE(), INTERVAL 25 DAY), 'Performance notes for Employee 9', 'manager-001'),
('review-015', 'emp-010', DATE_SUB(CURRENT_DATE(), INTERVAL 210 DAY), 'Annual', 74, DATE_SUB(CURRENT_DATE(), INTERVAL 300 DAY), DATE_ADD(CURRENT_DATE(), INTERVAL 20 DAY), 'Performance notes for Employee 10', 'manager-001'),
('review-016', 'emp-011', DATE_SUB(CURRENT_DATE(), INTERVAL 225 DAY), 'Quarterly', 75, DATE_SUB(CURRENT_DATE(), INTERVAL 315 DAY), DATE_ADD(CURRENT_DATE(), INTERVAL 15 DAY), 'Performance notes for Employee 11', 'manager-001'),
('review-017', 'emp-012', DATE_SUB(CURRENT_DATE(), INTERVAL 240 DAY), 'Semi-Annual', 76, DATE_SUB(CURRENT_DATE(), INTERVAL 330 DAY), DATE_ADD(CURRENT_DATE(), INTERVAL 10 DAY), 'Performance notes for Employee 12', 'manager-001'),
('review-018', 'emp-013', DATE_SUB(CURRENT_DATE(), INTERVAL 255 DAY), 'Annual', 77, DATE_SUB(CURRENT_DATE(), INTERVAL 345 DAY), DATE_ADD(CURRENT_DATE(), INTERVAL 5 DAY), 'Performance notes for Employee 13', 'manager-001'),
('review-019', 'emp-014', DATE_SUB(CURRENT_DATE(), INTERVAL 270 DAY), 'Quarterly', 78, DATE_SUB(CURRENT_DATE(), INTERVAL 360 DAY), DATE_ADD(CURRENT_DATE(), INTERVAL 0 DAY), 'Performance notes for Employee 14', 'manager-001'),
('review-020', 'emp-015', DATE_SUB(CURRENT_DATE(), INTERVAL 285 DAY), 'Semi-Annual', 79, DATE_SUB(CURRENT_DATE(), INTERVAL 375 DAY), DATE_ADD(CURRENT_DATE(), INTERVAL -5 DAY), 'Performance notes for Employee 15', 'manager-001'),
('review-021', 'emp-016', DATE_SUB(CURRENT_DATE(), INTERVAL 300 DAY), 'Annual', 80, DATE_SUB(CURRENT_DATE(), INTERVAL 390 DAY), DATE_ADD(CURRENT_DATE(), INTERVAL -10 DAY), 'Performance notes for Employee 16', 'manager-001'),
('review-022', 'emp-017', DATE_SUB(CURRENT_DATE(), INTERVAL 315 DAY), 'Quarterly', 81, DATE_SUB(CURRENT_DATE(), INTERVAL 405 DAY), DATE_ADD(CURRENT_DATE(), INTERVAL -15 DAY), 'Performance notes for Employee 17', 'manager-001'),
('review-023', 'emp-018', DATE_SUB(CURRENT_DATE(), INTERVAL 330 DAY), 'Semi-Annual', 82, DATE_SUB(CURRENT_DATE(), INTERVAL 420 DAY), DATE_ADD(CURRENT_DATE(), INTERVAL -20 DAY), 'Performance notes for Employee 18', 'manager-001'),
('review-024', 'emp-019', DATE_SUB(CURRENT_DATE(), INTERVAL 345 DAY), 'Annual', 83, DATE_SUB(CURRENT_DATE(), INTERVAL 435 DAY), DATE_ADD(CURRENT_DATE(), INTERVAL -25 DAY), 'Performance notes for Employee 19', 'manager-001'),
('review-025', 'emp-020', DATE_SUB(CURRENT_DATE(), INTERVAL 360 DAY), 'Quarterly', 84, DATE_SUB(CURRENT_DATE(), INTERVAL 450 DAY), DATE_ADD(CURRENT_DATE(), INTERVAL -30 DAY), 'Performance notes for Employee 20', 'manager-001');

-- Create performance goals (3 per employee)
-- For managers
INSERT INTO performance_goals (id, employee_id, title, description, progress, status, due_date, review_id) VALUES
-- Goals for Manager 1
('goal-001', 'manager-001', 'Goal 1 for Manager 1', 'Detailed description for goal 1', 0, 'not-started', DATE_ADD(CURRENT_DATE(), INTERVAL 30 DAY), 'review-001'),
('goal-002', 'manager-001', 'Goal 2 for Manager 1', 'Detailed description for goal 2', 0, 'not-started', DATE_ADD(CURRENT_DATE(), INTERVAL 45 DAY), 'review-001'),
('goal-003', 'manager-001', 'Goal 3 for Manager 1', 'Detailed description for goal 3', 0, 'not-started', DATE_ADD(CURRENT_DATE(), INTERVAL 60 DAY), 'review-001'),

-- Goals for Manager 2
('goal-004', 'manager-002', 'Goal 1 for Manager 2', 'Detailed description for goal 1', 50, 'in-progress', DATE_ADD(CURRENT_DATE(), INTERVAL 30 DAY), 'review-002'),
('goal-005', 'manager-002', 'Goal 2 for Manager 2', 'Detailed description for goal 2', 50, 'in-progress', DATE_ADD(CURRENT_DATE(), INTERVAL 45 DAY), 'review-002'),
('goal-006', 'manager-002', 'Goal 3 for Manager 2', 'Detailed description for goal 3', 50, 'in-progress', DATE_ADD(CURRENT_DATE(), INTERVAL 60 DAY), 'review-002'),

-- Goals for Manager 3
('goal-007', 'manager-003', 'Goal 1 for Manager 3', 'Detailed description for goal 1', 100, 'completed', DATE_ADD(CURRENT_DATE(), INTERVAL 30 DAY), 'review-003'),
('goal-008', 'manager-003', 'Goal 2 for Manager 3', 'Detailed description for goal 2', 100, 'completed', DATE_ADD(CURRENT_DATE(), INTERVAL 45 DAY), 'review-003'),
('goal-009', 'manager-003', 'Goal 3 for Manager 3', 'Detailed description for goal 3', 100, 'completed', DATE_ADD(CURRENT_DATE(), INTERVAL 60 DAY), 'review-003'),

-- Goals for Manager 4
('goal-010', 'manager-004', 'Goal 1 for Manager 4', 'Detailed description for goal 1', 0, 'not-started', DATE_ADD(CURRENT_DATE(), INTERVAL 30 DAY), 'review-004'),
('goal-011', 'manager-004', 'Goal 2 for Manager 4', 'Detailed description for goal 2', 0, 'not-started', DATE_ADD(CURRENT_DATE(), INTERVAL 45 DAY), 'review-004'),
('goal-012', 'manager-004', 'Goal 3 for Manager 4', 'Detailed description for goal 3', 0, 'not-started', DATE_ADD(CURRENT_DATE(), INTERVAL 60 DAY), 'review-004'),

-- Goals for Manager 5
('goal-013', 'manager-005', 'Goal 1 for Manager 5', 'Detailed description for goal 1', 50, 'in-progress', DATE_ADD(CURRENT_DATE(), INTERVAL 30 DAY), 'review-005'),
('goal-014', 'manager-005', 'Goal 2 for Manager 5', 'Detailed description for goal 2', 50, 'in-progress', DATE_ADD(CURRENT_DATE(), INTERVAL 45 DAY), 'review-005'),
('goal-015', 'manager-005', 'Goal 3 for Manager 5', 'Detailed description for goal 3', 50, 'in-progress', DATE_ADD(CURRENT_DATE(), INTERVAL 60 DAY), 'review-005');

-- For regular employees (just adding a few as examples - pattern continues)
INSERT INTO performance_goals (id, employee_id, title, description, progress, status, due_date, review_id) VALUES
-- Goals for Employee 1
('goal-016', 'emp-001', 'Goal 1 for Employee 1', 'Detailed description for goal 1', 100, 'completed', DATE_ADD(CURRENT_DATE(), INTERVAL 30 DAY), 'review-006'),
('goal-017', 'emp-001', 'Goal 2 for Employee 1', 'Detailed description for goal 2', 100, 'completed', DATE_ADD(CURRENT_DATE(), INTERVAL 45 DAY), 'review-006'),
('goal-018', 'emp-001', 'Goal 3 for Employee 1', 'Detailed description for goal 3', 100, 'completed', DATE_ADD(CURRENT_DATE(), INTERVAL 60 DAY), 'review-006'),

-- Goals for Employee 2
('goal-019', 'emp-002', 'Goal 1 for Employee 2', 'Detailed description for goal 1', 0, 'not-started', DATE_ADD(CURRENT_DATE(), INTERVAL 30 DAY), 'review-007'),
('goal-020', 'emp-002', 'Goal 2 for Employee 2', 'Detailed description for goal 2', 0, 'not-started', DATE_ADD(CURRENT_DATE(), INTERVAL 45 DAY), 'review-007'),
('goal-021', 'emp-002', 'Goal 3 for Employee 2', 'Detailed description for goal 3', 0, 'not-started', DATE_ADD(CURRENT_DATE(), INTERVAL 60 DAY), 'review-007'),

-- Goals for Employee 3
('goal-022', 'emp-003', 'Goal 1 for Employee 3', 'Detailed description for goal 1', 50, 'in-progress', DATE_ADD(CURRENT_DATE(), INTERVAL 30 DAY), 'review-008'),
('goal-023', 'emp-003', 'Goal 2 for Employee 3', 'Detailed description for goal 2', 50, 'in-progress', DATE_ADD(CURRENT_DATE(), INTERVAL 45 DAY), 'review-008'),
('goal-024', 'emp-003', 'Goal 3 for Employee 3', 'Detailed description for goal 3', 50, 'in-progress', DATE_ADD(CURRENT_DATE(), INTERVAL 60 DAY), 'review-008');

-- Create skill assessments for all employees (5 skills per employee)
-- Skills for managers
INSERT INTO skill_assessments (id, employee_id, name, score, review_id) VALUES
-- Skills for Manager 1
('skill-001', 'manager-001', 'Communication', 85, 'review-001'),
('skill-002', 'manager-001', 'Teamwork', 80, 'review-001'),
('skill-003', 'manager-001', 'Problem Solving', 82, 'review-001'),
('skill-004', 'manager-001', 'Technical Knowledge', 78, 'review-001'),
('skill-005', 'manager-001', 'Leadership', 90, 'review-001'),

-- Skills for Manager 2
('skill-006', 'manager-002', 'Communication', 75, 'review-002'),
('skill-007', 'manager-002', 'Teamwork', 85, 'review-002'),
('skill-008', 'manager-002', 'Problem Solving', 90, 'review-002'),
('skill-009', 'manager-002', 'Technical Knowledge', 95, 'review-002'),
('skill-010', 'manager-002', 'Leadership', 80, 'review-002'),

-- Skills for Manager 3
('skill-011', 'manager-003', 'Communication', 80, 'review-003'),
('skill-012', 'manager-003', 'Teamwork', 75, 'review-003'),
('skill-013', 'manager-003', 'Problem Solving', 85, 'review-003'),
('skill-014', 'manager-003', 'Technical Knowledge', 80, 'review-003'),
('skill-015', 'manager-003', 'Leadership', 85, 'review-003');

-- Skills for regular employees (just adding a few as examples - pattern continues)
INSERT INTO skill_assessments (id, employee_id, name, score, review_id) VALUES
-- Skills for Employee 1
('skill-016', 'emp-001', 'Communication', 70, 'review-006'),
('skill-017', 'emp-001', 'Teamwork', 80, 'review-006'),
('skill-018', 'emp-001', 'Problem Solving', 75, 'review-006'),
('skill-019', 'emp-001', 'Technical Knowledge', 85, 'review-006'),
('skill-020', 'emp-001', 'Leadership', 65, 'review-006'),

-- Skills for Employee 2
('skill-021', 'emp-002', 'Communication', 85, 'review-007'),
('skill-022', 'emp-002', 'Teamwork', 75, 'review-007'),
('skill-023', 'emp-002', 'Problem Solving', 90, 'review-007'),
('skill-024', 'emp-002', 'Technical Knowledge', 95, 'review-007'),
('skill-025', 'emp-002', 'Leadership', 70, 'review-007'),

-- Skills for Employee 3
('skill-026', 'emp-003', 'Communication', 75, 'review-008'),
('skill-027', 'emp-003', 'Teamwork', 85, 'review-008'),
('skill-028', 'emp-003', 'Problem Solving', 80, 'review-008'),
('skill-029', 'emp-003', 'Technical Knowledge', 70, 'review-008'),
('skill-030', 'emp-003', 'Leadership', 65, 'review-008');
