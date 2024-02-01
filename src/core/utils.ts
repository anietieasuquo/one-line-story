import { Entity, EntityMap, SortOrder } from '../../shared/core.d';

const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    return `${year}-${month}-${day}@${hours}:${minutes}`;
};

const sort = <T extends Entity>(
    list: T[],
    order: SortOrder = SortOrder.DESC
): T[] => {
    return list.sort((a: T, b: T): number => {
        if (a.dateCreated && b.dateCreated) {
            if (a.dateCreated > b.dateCreated) {
                return order === SortOrder.DESC ? -1 : 1;
            } else if (a.dateCreated < b.dateCreated) {
                return order === SortOrder.DESC ? 1 : -1;
            }
        }
        return 0;
    });
};

const addToMap = <T extends Entity>(map: EntityMap<T>, item: T, key: string, sortOrder: SortOrder = SortOrder.DESC): EntityMap<T> => {
    const _map: EntityMap<T> = map || {};
    const list: T[] = _map[key] || [];
    const index = list.findIndex((i: T) => i.id === item.id);
    if (index !== -1) {
        list.splice(index, 1);
    }
    _map[key] = sort<T>([...list, item], sortOrder);
    return _map;
};

const combineMap = <T extends Entity>(base: EntityMap<T>, second: T[], key: string, sortOrder: SortOrder = SortOrder.DESC): EntityMap<T> => {
    const _map: EntityMap<T> = base || {};
    second.forEach((item: T) => {
        const _list: T[] = _map[key] || [];
        const index = _list.findIndex((i: T) => i.id === item.id);
        if (index !== -1) {
            _list.splice(index, 1);
        }
        _map[key] = sort<T>([..._list, item], sortOrder);
    });
    return _map;
};

const addToListUniqueSorted = <T extends Entity>(list: T[], item: T, sortOrder: SortOrder = SortOrder.DESC): T[] => {
    const index = list.findIndex((i: T) => i.id === item.id);
    if (index !== -1) {
        list.splice(index, 1);
    }
    return sort<T>([...list, item], sortOrder);
};

const updateListItem = <T extends Entity>(list: T[], item: Partial<T>, sortOrder: SortOrder = SortOrder.DESC): T[] => {
    const index = list.findIndex((i: T) => i.id === item.id);
    if (index !== -1) {
        list.splice(index, 1, { ...list[index], ...item });
    }
    return sort<T>([...list], sortOrder);
};

const mapErrorMessage = (error: any): string => {
    if (error) {
        console.error('mapErrorMessage => ', error);
        if (error.response && error.response.data && error.response.data.message) return error.response.data.message;
        if (error.response && error.response.data) return error.response.data;
    }

    return 'An error occurred';
}

export { formatDate, sort, addToMap, combineMap, addToListUniqueSorted, updateListItem, mapErrorMessage };
