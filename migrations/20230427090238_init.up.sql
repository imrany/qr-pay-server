-- Add up migration script here
create table users(
    phone_number varchar not null primary key,
    access_token varchar,
    username varchar not null,
    password varchar not null,
    lastLogin varchar,
    userPlatform varchar,
);
create index user_idx on users (phone_number);

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
