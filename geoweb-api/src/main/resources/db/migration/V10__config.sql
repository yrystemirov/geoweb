create table config
(
    id          uuid         not null default gen_random_uuid() primary key,
    name_kk     varchar(200),
    name_ru     varchar(200),
    name_en     varchar(200),
    config_type varchar(200) not null,
    config_data text         not null
);