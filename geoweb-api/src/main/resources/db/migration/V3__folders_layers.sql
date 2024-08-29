create table folder
(
    id             uuid    not null default gen_random_uuid() primary key,
    name_kk        varchar(400),
    name_en        varchar(400),
    name_ru        varchar(400),
    parent_id      uuid references folder (id),
    description_kk varchar(2000),
    description_en varchar(2000),
    description_ru varchar(2000),
    is_public      boolean not null default false,
    img_url        varchar(2000),
    rank           integer not null default 0
);

create table style
(
    id         uuid not null default gen_random_uuid() primary key,
    style_name varchar(400),
    style_json text
);

create table layer
(
    id                      uuid         not null default gen_random_uuid() primary key,
    name_kk                 varchar(400),
    name_en                 varchar(400),
    name_ru                 varchar(400),
    description_kk          varchar(1000),
    description_en          varchar(1000),
    description_ru          varchar(1000),
    layername               varchar(200) not null unique,
    geometry_type           varchar(100) not null,
    base_layer              boolean      not null default false,
    url                     varchar(1000),
    check_intersection      boolean      not null default true,
    style_id                uuid references style (id),
    layer_type              varchar(100),
    is_block_layer          boolean      not null default false,
    is_dynamic              boolean      not null default false,
    is_public               boolean      not null default false,
    dynamic_identity_column varchar(500)
);

create index idx__layer__layername on layer (layername);

create table folder_layer
(
    folder_id uuid not null references folder (id),
    layer_id  uuid not null references layer (id),
    unique (folder_id, layer_id)
);

create table layer_attr
(
    id              uuid         not null default gen_random_uuid() primary key,
    name_kk         varchar(400),
    name_en         varchar(400),
    name_ru         varchar(400),
    attrname        varchar(200) not null,
    attr_type       varchar(200) not null,
    short_info      boolean,
    full_info       boolean,
    layer_id        uuid         not null references layer (id),
    dictionary_code varchar(1000),
    rank            integer      not null default 0
);

create index idx__layer_attr__layer_id on layer_attr (layer_id);