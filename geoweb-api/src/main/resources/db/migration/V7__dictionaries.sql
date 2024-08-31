create table dictionary
(
    id      uuid         not null default gen_random_uuid() primary key,
    code    varchar(100) not null unique,
    name_kk varchar(500),
    name_ru varchar(500),
    name_en varchar(500),
    is_tree boolean      not null default false
);

create index idx__dictionary__code on dictionary (code);

create table entry
(
    id            uuid    not null default gen_random_uuid() primary key,
    code          varchar(100),
    kk            varchar(1000),
    ru            varchar(1000),
    en            varchar(1000),
    dictionary_id uuid    not null references dictionary (id),
    parent_id     uuid references entry (id),
    has_child     boolean not null default false,
    rank          integer not null default 0,
    unique (dictionary_id, code)
);

create index idx__entry__dictionary_id__rank on entry (dictionary_id, rank asc);
create index idx__entry__parent_id__rank on entry (parent_id, rank asc);
create index idx__entry__dictionary_id__parent_id__rank on entry (dictionary_id, parent_id, rank asc);
create index idx__entry__dictionary_id__code on entry (dictionary_id, code);