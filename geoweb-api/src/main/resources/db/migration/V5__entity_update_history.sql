create table entity_update_history
(
    id          uuid        not null default gen_random_uuid() primary key,
    entity_type varchar(50) not null,
    entity_id   uuid        not null,
    user_id     uuid        not null,
    action      varchar(20) not null,
    date        timestamp
);

create index idx__entity_update_history__entity_type__entity_id on entity_update_history (entity_type, entity_id, date desc)