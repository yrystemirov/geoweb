alter table layer
    drop column base_layer,
    drop column check_intersection,
    drop column is_block_layer,
    drop column is_dynamic,
    drop column dynamic_identity_column;

alter table layer_attr
    drop column short_info,
    drop column full_info;