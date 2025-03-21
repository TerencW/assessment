USE master;
GO

IF NOT EXISTS (
    SELECT [name] 
    FROM sys.databases 
    WHERE [name] = 'CAFEABC'
)
BEGIN
    PRINT 'Database CAFEABC does not exist. Creating...';
    CREATE DATABASE CAFEABC;
END
ELSE
BEGIN
    PRINT 'Database CAFEABC already exists.';
END
GO

USE CAFEABC;
GO


--------------------------------------------------
-- 1. Drop existing tables if they exist (optional)
--------------------------------------------------
IF OBJECT_ID('dbo.EmployeeCafe', 'U') IS NOT NULL
    DROP TABLE dbo.EmployeeCafe;
GO

IF OBJECT_ID('dbo.Employee', 'U') IS NOT NULL
    DROP TABLE dbo.Employee;
GO

IF OBJECT_ID('dbo.Cafe', 'U') IS NOT NULL
    DROP TABLE dbo.Cafe;
GO


-----------------------------------
-- 2. Create the Employee table
-----------------------------------
CREATE TABLE dbo.Employee
(
    [employee_id]		VARCHAR(9)   NOT NULL,
    [name]				VARCHAR(10) NOT NULL,
    [email_address]		VARCHAR(255) NOT NULL,
    [phone_number]		CHAR(8)      NOT NULL,
    [gender]			VARCHAR(6)   NOT NULL,


    CONSTRAINT PK_Employee PRIMARY KEY CLUSTERED ([employee_id]),

    -- Check constraint: ID in the format "UI" + 7 alphanumeric
    CONSTRAINT CK_Employee_ID_Format
        CHECK ([employee_id] LIKE 'UI[0-9A-Za-z][0-9A-Za-z][0-9A-Za-z][0-9A-Za-z][0-9A-Za-z][0-9A-Za-z][0-9A-Za-z]'),

    -- Check constraint: Phone starts with 8 or 9 and is 8 digits
    CONSTRAINT CK_Employee_Phone_Format
        CHECK ([phone_number] LIKE '[89]%[0-9][0-9][0-9][0-9][0-9][0-9][0-9]'),
	
    -- Check constraint: Gender is either "Male" or "Female"
    CONSTRAINT CK_Employee_Gender
        CHECK ([gender] IN ('Male', 'Female')),

    -- Simple email format check (real-world email validation might be more complex)
    CONSTRAINT CK_Employee_Email_Format
        CHECK ([email_address] LIKE '%_@__%.__%')
);
GO


-------------------------------
-- 3. Create the Cafe table
-------------------------------
CREATE TABLE dbo.Cafe
(
    [cafe_id]			UNIQUEIDENTIFIER NOT NULL,
    [name]				NVARCHAR(10)    NOT NULL UNIQUE,
    [description]		NVARCHAR(256)    NOT NULL,
    [logo]				NVARCHAR(MAX)    NULL,      -- optional
    [location]			NVARCHAR(255)    NOT NULL,

    CONSTRAINT PK_Cafe PRIMARY KEY CLUSTERED ([cafe_id])
);
GO


---------------------------------------------------------------------------------
-- 4. Create a link table: Which employee works for which café, and start date
--    Enforce that each employee can only work for one café (unique constraint)
---------------------------------------------------------------------------------
CREATE TABLE dbo.EmployeeCafe
(
    [employee_id] VARCHAR(9)        NOT NULL,
    [cafe_id]     UNIQUEIDENTIFIER  NOT NULL,
    [start_date]  DATE              NOT NULL,

    -- Each row references a single employee and a single cafe.
    -- The PK is employee_id, ensuring the same employee cannot appear twice.
    CONSTRAINT PK_EmployeeCafe PRIMARY KEY ([employee_id]),

    -- Foreign Key to Employee
    CONSTRAINT FK_EmployeeCafe_EmployeeID 
        FOREIGN KEY (employee_id) REFERENCES Employee(employee_id) ON DELETE CASCADE,

    -- Foreign Key to Cafe
    CONSTRAINT FK_EmployeeCafe_CafeID
        FOREIGN KEY ([cafe_id]) REFERENCES dbo.Cafe ([cafe_id])
);
GO


INSERT INTO dbo.Employee ([employee_id], [name], [email_address], [phone_number], [gender]) VALUES
    ('UI9897692', 'AliceJ', 'alicej@test.com', '96759746', 'Male'),
    ('UI1402441', 'BobSmith', 'bobsmith@test.com', '87640990', 'Female'),
    ('UI9516287', 'CharlieX', 'charliex@test.com', '97714170', 'Male'),
    ('UI4832584', 'DavidXX', 'davidxx@test.com', '81553417', 'Female'),
    ('UI8744761', 'EveBrown', 'evebrown@test.com', '92760463', 'Male'),
    ('UI4528674', 'Franklin', 'franklin@test.com', '96860625', 'Female'),
    ('UI3106762', 'GraceLee', 'gracelee@test.com', '94262165', 'Male'),
    ('UI6174459', 'HankWang', 'hankwang@test.com', '89734937', 'Female'),
    ('UI7491006', 'IvyJones', 'ivyjones@test.com', '97862532', 'Male'),
    ('UI3884112', 'JackBlack', 'jackblack@test.com', '97604534', 'Female'),
    ('UI5783011', 'KathyAnn', 'kathyann@test.com', '82090372', 'Male'),
    ('UI2016124', 'LiamScott', 'liamscott@test.com', '89658440', 'Female'),
    ('UI9435784', 'MonaLisa', 'monalisa@test.com', '84717745', 'Male'),
    ('UI2529117', 'NathanXu', 'nathanxu@test.com', '82378843', 'Female'),
    ('UI2021470', 'OliviaChen', 'oliviachen@test.com', '85374790', 'Male'),
    ('UI5495188', 'PaulGray', 'paulgray@test.com', '84622469', 'Female'),
    ('UI6664438', 'QuincyLu', 'quincylu@test.com', '93088974', 'Male'),
    ('UI3286008', 'RachelTan', 'racheltan@test.com', '88867571', 'Female'),
    ('UI3467310', 'SteveKim', 'stevekim@test.com', '88197343', 'Male'),
    ('UI1185048', 'TinaWong', 'tinawong@test.com', '86481178', 'Female');





INSERT INTO dbo.Cafe ([cafe_id], [name], [description], [logo], [location]) VALUES
    (NEWID(), 'Downtown', 'A cozy place to enjoy coffee.', NULL, '123 Main St'),
    (NEWID(), 'Parkside', 'A cozy place to enjoy coffee.', NULL, '45 Park Ave'),
    (NEWID(), 'Sunset', 'A cozy place to enjoy coffee.', NULL, '56 Sunset Blvd'),
    (NEWID(), 'MorningG', 'A cozy place to enjoy coffee.', NULL, '78 Sunrise Rd'),
    (NEWID(), 'BeanSpot', 'A cozy place to enjoy coffee.', NULL, '99 Elm St'),
    (NEWID(), 'BrewChill', 'A cozy place to enjoy coffee.', NULL, '112 Maple Ave'),
    (NEWID(), 'Hillside', 'A cozy place to enjoy coffee.', NULL, '200 Hill Rd'),
    (NEWID(), 'CafeAroma', 'A cozy place to enjoy coffee.', NULL, '150 Market St'),
    (NEWID(), 'GoldenCup', 'A cozy place to enjoy coffee.', NULL, '65 Golden Ave'),
    (NEWID(), 'CaffeineX', 'A cozy place to enjoy coffee.', NULL, '20 Queen St'),
    (NEWID(), 'Roasters', 'A cozy place to enjoy coffee.', NULL, '31 Baker St'),
    (NEWID(), 'LatteHub', 'A cozy place to enjoy coffee.', NULL, '81 River Rd'),
    (NEWID(), 'Espresso', 'A cozy place to enjoy coffee.', NULL, '10 Main Plaza'),
    (NEWID(), 'CozyCup', 'A cozy place to enjoy coffee.', NULL, '5 Pine St'),
    (NEWID(), 'MochaFix', 'A cozy place to enjoy coffee.', NULL, '99 Coffee Blvd'),
    (NEWID(), 'JavaJunc', 'A cozy place to enjoy coffee.', NULL, '45 Cross Rd'),
    (NEWID(), 'CaramelC', 'A cozy place to enjoy coffee.', NULL, '19 Sunset Dr'),
    (NEWID(), 'DarkBrew', 'A cozy place to enjoy coffee.', NULL, '77 Oak St'),
    (NEWID(), 'PourOver', 'A cozy place to enjoy coffee.', NULL, '21 Vine St'),
    (NEWID(), 'SteamyBn', 'A cozy place to enjoy coffee.', NULL, '108 Front St');

DECLARE @SampleCafeID UNIQUEIDENTIFIER;
SET @SampleCafeID = (SELECT TOP 1 [cafe_id] FROM dbo.Cafe ORDER BY [name] desc);
DECLARE @SampleCafeID1 UNIQUEIDENTIFIER;
SET @SampleCafeID1 = (SELECT TOP 1 [cafe_id] FROM dbo.Cafe ORDER BY [name] asc);

INSERT INTO dbo.EmployeeCafe ([employee_id], [cafe_id], [start_date]) VALUES
    ('UI9897692', @SampleCafeID1, '2023-01-04'),
    ('UI1402441', @SampleCafeID, '2023-12-16'),
    ('UI9516287', @SampleCafeID, '2024-05-02'),
    ('UI4832584', @SampleCafeID, '2024-08-21'),
    ('UI8744761', @SampleCafeID1, '2024-10-04'),
    ('UI4528674', @SampleCafeID, '2023-08-14'),
    ('UI3106762', @SampleCafeID, '2023-01-04'),
    ('UI6174459', @SampleCafeID1, '2023-01-04'),
    ('UI7491006', @SampleCafeID, '2024-11-26'),
    ('UI3884112', @SampleCafeID1, '2024-04-21'),
    ('UI5783011', @SampleCafeID, '2024-09-27'),
    ('UI2016124', @SampleCafeID, '2023-05-27'),
    ('UI9435784', @SampleCafeID, '2024-10-08'),
    ('UI2529117', @SampleCafeID, '2024-06-16'),
    ('UI2021470', @SampleCafeID1, '2024-06-24'),
    ('UI5495188', @SampleCafeID, '2024-03-26'),
    ('UI6664438', @SampleCafeID, '2024-07-17'),
    ('UI3286008', @SampleCafeID1, '2024-10-06'),
    ('UI3467310', @SampleCafeID, '2023-05-02'),
    ('UI1185048', @SampleCafeID1, '2024-09-12');


GO

