import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const treeIcons = {
    check: <FontAwesomeIcon className="rct-icon rct-icon-check" icon="check-square" size="lg" />,
    uncheck: <FontAwesomeIcon className="rct-icon rct-icon-uncheck" icon={['fas', 'square']} size="lg" />,
    halfCheck: <FontAwesomeIcon className="rct-icon rct-icon-half-check" icon="check-square" />,
    expandClose: <FontAwesomeIcon className="rct-icon rct-icon-expand-close" icon="chevron-right" />,
    expandOpen: <FontAwesomeIcon className="rct-icon rct-icon-expand-open" icon="chevron-down" />,
    expandAll: <FontAwesomeIcon className="rct-icon rct-icon-expand-all" icon="plus-square" />,
    collapseAll: <FontAwesomeIcon className="rct-icon rct-icon-collapse-all" icon="minus-square" />,
    parentClose: <FontAwesomeIcon className="rct-icon rct-icon-parent-close" icon="folder" />,
    parentOpen: <FontAwesomeIcon className="rct-icon rct-icon-parent-open" icon="folder-open" />,
    leaf: <FontAwesomeIcon className="rct-icon rct-icon-leaf-close" icon="file" />,
};
