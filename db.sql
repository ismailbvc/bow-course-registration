use master
go

-- create db if not exists
if db_id('BowCourseReg') is null
  create database BowCourseReg
go

-- switch to db
use BowCourseReg

-- create tables

if not exists (select * from sysobjects where name='Programs' and xtype='U')
  create table Programs (
    id bigint primary key identity,
    code varchar(20) not null,
    name varchar(100) not null,
    unique(code)
  )
go

if not exists (select * from sysobjects where name='Learners' and xtype='U')
  create table Learners (
    studentID bigint primary key identity,
    first_name varchar(100) not null,
    last_name varchar(100) not null,
    email varchar(100) not null,
    phone varchar(50) not null,
    dob date not null,
    department varchar(100) not null,
    program_id bigint references Programs(id),
    username varchar(100) not null,
    password varchar(200) not null,
    sessions varchar(500) default null,
    unique(username, email)
  )
go

if not exists (select * from sysobjects where name='Admins' and xtype='U')
  create table Admins (
    id bigint primary key identity,
    first_name varchar(100) not null,
    last_name varchar(100) not null,
    email varchar(100) not null,
    username varchar(100) not null,
    password varchar(200) not null,
    sessions varchar(500) default null,
    unique(username, email)
  )
go

if not exists (select * from sysobjects where name='Courses' and xtype='U')
  create table Courses (
    courseId bigint primary key identity,
    name varchar(100) not null,
    code varchar(20) not null,
    term int not null check(term in (1,2,3,4)),
    start_date date not null,
    end_date date not null,
    program_id bigint not null references Programs(id),
    unique(code)
  )
go

if not exists (select * from sysobjects where name='StudentCourses' and xtype='U')
  create table StudentCourses (
    studentID bigint not null references Learners(studentID),
    courseId bigint not null references Courses(courseId),
    primary key (studentID, courseId)
  )
go

if not exists (select * from sysobjects where name='Inquiries' and xtype='U')
  create table Inquiries (
    id bigint primary key identity,
    studentID bigint not null references Learners(studentID),
    subject varchar(100) not null,
    message varchar(max) not null,
    date datetime not null
  )
go

-- sample data insertion

-- admin users // user[0]: username: admin, password: password
insert into Admins (first_name, last_name, email, username, password)
    values ('Ismail', 'El', 'i@example.com', 'admin', 'this-will-not-work-since-not-encrypted')

-- programs
SET IDENTITY_INSERT Programs ON

insert into Programs (id, code, name)
    values (1, 'IT', 'Information Technology'), (2, 'MGMT', 'Project Management')

SET IDENTITY_INSERT Programs OFF

-- courses
SET IDENTITY_INSERT Courses ON

insert into Courses (courseId, name, code, term, start_date, end_date, program_id) values
    (1, 'Project management1', 'Pr111', 1, '2021-09-01', '2021-12-24', 1),
    (2, 'C++ Programming Fundamentals', 'C++111', 1, '2021-09-01', '2021-12-24', 1),
    (3, 'Computer Maintenance', 'CompM1111', 1, '2021-09-01', '2021-12-24', 1),
    (4, 'Information Security1', 'IS1111', 1, '2021-09-01', '2021-12-24', 1),
    (5, 'Networking', 'Net222', 2, '2022-01-01', '2022-04-24', 1),
    (6, 'Web technology', 'Web222', 2, '2022-01-01', '2022-04-24', 1),
    (7, 'Project Management', 'Pro222', 2, '2022-01-01', '2022-04-24', 1),
    (8, 'Advanced Project management1', 'Pr333', 3, '2022-09-01', '2022-12-24', 1),
    (9, 'Advanced C++ Programming Fundamentals', 'C++333', 3, '2022-09-01', '2022-12-24', 1),
    (10, 'Advanced Computer Maintenance', 'CompM333', 3, '2022-09-01', '2022-12-24', 1),
    (11, 'Advanced Information Security1', 'IS333', 3, '2022-09-01', '2022-12-24', 1),
    (12, 'Advanced Networking', 'Net223', 4, '2023-01-01', '2023-04-24', 1),
    (13, 'Advanced Web technology', 'Web223', 4, '2023-01-01', '2023-04-24', 1),
    (14, 'Advanced Project Management', 'Pro223', 4, '2023-01-01', '2023-04-24', 1)

SET IDENTITY_INSERT Courses OFF
