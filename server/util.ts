import { Entity } from '../shared/core';

const isEmpty = (arg: any): boolean => {
    if (arg === undefined || arg === null) return true;
    return arg.length === 0;
};

const isAnyEmpty = <T>(...args: T[]): boolean => {
    if (!args || args.length === 0) return true;
    for (const arg of args) {
        if (isEmpty(arg)) return true;
    }

    return false;
};

const includes = <T extends Entity>(array: T[], value: T, field?: keyof T): boolean => {
    if (array.length === 0) return false;
    if (field) return array.findIndex((item: T) => item[field] === value[field]) !== -1;
    return array.findIndex((item: T) => item.id === value.id) !== -1;
};

const createId = (): string => {
    return Math.floor(100000000 + Math.random() * 900000000).toString(); //Should be improved
}

export { isEmpty, isAnyEmpty, includes, createId };
