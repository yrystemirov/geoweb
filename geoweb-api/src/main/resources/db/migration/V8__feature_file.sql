create table feature_file
(
    id           uuid         not null default gen_random_uuid() primary key,
    layername    varchar(200) not null,
    gid          integer      not null,
    filename     varchar(200) not null,
    content_type varchar(200) not null,
    size         integer      not null,
    minio_bucket varchar(200) not null,
    minio_object varchar(200) not null
);

create index idx__feature_file__layername__gid__filename_asc on feature_file (layername, gid, filename asc);