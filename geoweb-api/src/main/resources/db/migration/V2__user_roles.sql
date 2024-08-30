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
    name         varchar(100) not null,
    phone_number varchar(50) unique,
    created_date timestamp,
    blocked      boolean      not null default false
);

create index idx__users__username on users (username);
create index idx__users__phone_number on users (phone_number);

create table role
(
    id          uuid         not null default gen_random_uuid() primary key,
    code        varchar(100) not null,
    name        varchar(100) not null,
    description varchar(1000)
);

create table user_role
(
    id      uuid not null default gen_random_uuid() primary key,
    user_id uuid not null references users (id),
    role_id uuid not null references role (id),
    unique (user_id, role_id)
);

insert into users (id, username, password, name, created_date)
values ('f47c4b38-8b95-4637-9a73-9f3631ad0b28', 'admin',
        '$2a$12$54mjQy8bfpW0beaTSMaZMu3iVm4tZyV83tfCVIIsuFVS6xXShdTRi',
        'Администратор', '2024-01-01');

insert into role (id, code, name)
values ('001eb4b9-b0f1-463c-8598-24f7a470b793', 'ADMIN', 'Администратор');

insert into user_role(user_id, role_id)
values ('f47c4b38-8b95-4637-9a73-9f3631ad0b28', '001eb4b9-b0f1-463c-8598-24f7a470b793');