create table dictionary
(
    id      uuid         not null default gen_random_uuid() primary key,
    code    varchar(100) not null unique,
    nameKk  varchar(500) not null,
    nameRu  varchar(500) not null,
    nameEn  varchar(500) not null,
    is_tree boolean      not null default false
);

create index idx__dictionary__code on dictionary (code);

create table entry
(
    id            uuid          not null default gen_random_uuid() primary key,
    code          varchar(100)  not null,
    kk            varchar(1000) not null,
    ru            varchar(1000) not null,
    en            varchar(1000) not null,
    dictionary_id uuid          not null references dictionary (id),
    parent_id     uuid references entry (id),
    has_child     boolean       not null default false,
    rank          integer       not null default 0,
    unique (dictionary_id, code)
);

create index idx__entry__dictionary_id__rank on entry (dictionary_id, rank asc);
create index idx__entry__parent_id__rank on entry (parent_id, rank asc);
create index idx__entry__dictionary_id__parent_id__rank on entry (dictionary_id, parent_id, rank asc);
create index idx__entry__dictionary_id__code on entry (dictionary_id, code);