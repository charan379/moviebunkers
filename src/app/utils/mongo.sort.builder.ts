

export default async function MongoSortBuilder(sort_by: string) {

    const elementRegex: RegExp = /(^[a-zA-Z0-9]\w+\.(desc$|asc$))/;

    let sortElementsObject: object = {};

    const sortElementsArray : string[] = sort_by.split(",");

    for (let index: number = 0; index < sortElementsArray.length; index++) {
        const element = sortElementsArray[index];

        if (element.match(elementRegex)) {
            const [key, value] = element.split(".");
            sortElementsObject = { ...sortElementsObject, [key]: value };
        }
    }

    if (Object.keys(sortElementsObject).length === 0) return {createdAt: 'desc'};

    return sortElementsObject;

    
}