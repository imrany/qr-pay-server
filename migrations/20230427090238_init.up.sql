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
    phone_number varchar,
    full_name varchar not null,
    type:varchar not null,
    registration_number:varchar not null primary key,
    id_number:varchar,
    year_of_entry:varchar not null,
    year_of_exit:varchar not null,
    academic_year:varchar not null,
    semester: int not null,
    campus:varchar not null,
    course:varchar not null
);
create index student_idx on students (id_number);


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
