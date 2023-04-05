import buildMongoSortObject from '@utils/mongo.sort.builder';

describe('buildMongoSortObject', () => {
    it('should return the default sort object if no sort fields are provided', () => {
        const result = buildMongoSortObject('');
        expect(result).toEqual({ createdAt: -1 });
    });

    it('should return the expected sort object for a single sort field', () => {
        const result = buildMongoSortObject('name.asc');
        expect(result).toEqual({ name: 1 });
    });

    it('should return the expected sort object for multiple sort fields', () => {
        const result = buildMongoSortObject('age.desc,name.asc');
        expect(result).toEqual({ age: -1, name: 1 });
    });

    it('should throw an error for an invalid sort element', () => {
        expect(() => buildMongoSortObject('invalid_sort_field')).toThrowError('Invalid sort element: invalid_sort_field');
    });
});
