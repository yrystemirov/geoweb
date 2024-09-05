create table entity_permission
(
    id          uuid        not null default gen_random_uuid() primary key,
    entity_type varchar(50) not null,
    entity_id   uuid        not null,
    role_id     uuid        not null,
    permission  varchar(20) not null
);

create unique index uidx__entity_perm__entity_type__entity_id__role_id__perm on entity_permission (entity_type, entity_id, role_id, permission);
create index idx__data_entity_perm__entity_type__entity_id__role_id on entity_permission (entity_type, entity_id, role_id);
create index idx__data_entity_perm__entity_type__entity_id__role_id__perm on entity_permission (entity_type, entity_id, role_id, permission);