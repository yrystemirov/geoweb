create table refresh_token
(
    id       uuid          not null default gen_random_uuid() primary key,
    username varchar(100)  not null,
    token    varchar(2000) not null,
    expiry   timestamp     not null
);

create index idx__refresh_token__token_expiry on refresh_token (token, expiry);

create table users
(
    id           uuid         not null default gen_random_uuid() primary key,
    username     varchar(100) not null unique,
    password     varchar(100) not null,
    email        varchar(100),
    name         varchar(100),
    phone_number varchar(50) unique,
    created_date timestamp,
    deleted_date timestamp
);

create index idx__users__username on users (username);

create table role
(
    id   uuid not null default gen_random_uuid() primary key,
    name varchar(100)
);

create table user_role
(
    id      uuid not null default gen_random_uuid() primary key,
    user_id uuid not null references users (id),
    role_id uuid not null references role (id)
);