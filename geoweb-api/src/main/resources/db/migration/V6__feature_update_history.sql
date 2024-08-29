create table feature_update_history
(
    id        uuid         not null default gen_random_uuid() primary key,
    layername varchar(200) not null,
    gid       integer      not null,
    user_id   uuid         not null,
    action    varchar(20)  not null,
    date      timestamp
);

create index idx__feature_update_history__layername on feature_update_history (layername, date desc);
create index idx__feature_update_history__layername__user_id on feature_update_history (layername, user_id, date desc);
create index idx__feature_update_history__layername__gid on feature_update_history (layername, gid, date desc);
create index idx__feature_update_history__user_id on feature_update_history (user_id, date desc);