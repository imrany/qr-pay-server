-- Add up migration script here
create table users(
    phone_number varchar not null primary key,
    username varchar not null,
    password varchar not null,
    lastLogin varchar not null,
    userPlatform varchar not null
);
create index user_idx on users (phone_number);

create table students(
    phone_number varchar(14),
    full_name varchar(255) not null,
    type varchar(10) DEFAULT 'student' not null,
    registration_number varchar(100) not null primary key,
    id_number varchar(30) unique,
    year_of_entry varchar(4) not null,
    year_of_exit varchar(4) not null,
    academic_year varchar(10) not null,
    semester int not null,
    campus varchar(100) not null,
    course varchar(255) not null
);
create index student_idx on students (registration_number);

create table access_records(
    registration_number varchar(100) not null,
    access_time varchar not null,
    PRIMARY KEY (access_time),
    FOREIGN KEY (registration_number) REFERENCES students(registration_number)
);
create index access_record_idx on access_records (access_time);

-- transaction
-- create table mpesa_transactions(
--     phoneNumber int not null,
--     amount int not null,
--     MerchantRequestID varchar not null primary key,
--     ResultCode varchar not null,
--     ResultDesc varchar not null,
--     MpesaReceiptNo varchar not null,
--     TransactionDate varchar not null
-- );
-- create index mpesa_idx on mpesa_transactions (MerchantRequestID);
