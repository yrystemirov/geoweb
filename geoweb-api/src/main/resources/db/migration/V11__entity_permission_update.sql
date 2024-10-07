drop table entity_permission;

create table entity_permission
(
    id          uuid         not null default gen_random_uuid() primary key,
    entity_type varchar(50)  not null,
    entity_id   uuid         not null,
    role_id     uuid         not null references role (id),
    permissions varchar(500) not null
);

create unique index uidx__entity_permission__entity_type__entity_id__role_id on entity_permission (entity_type, entity_id, role_id);
create index idx__data_entity_permission__entity_type__entity_id__role_id on entity_permission (entity_type, entity_id, role_id);