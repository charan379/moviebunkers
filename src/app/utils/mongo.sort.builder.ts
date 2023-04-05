interface SortObject {
    [key: string]: number;
}

/**
 * Builds a MongoDB sort object based on the provided `sort_by` string.
 *
 * @param {string} sort_by - The string containing the sort fields and directions.
 * @returns {SortObject} - The MongoDB sort object.
 * @throws {Error} - If any of the sort elements are invalid.
 */
export default function buildMongoSortObject(sort_by: string): SortObject {
    const sortFields: SortObject = {};

    // If sort_by is not provided or is empty, sort by createdAt in descending order
    if (!sort_by) {
        return { createdAt: -1 };
    }

    const sortElementRegex = /^[a-zA-Z0-9]\w+\.(desc|asc)$/;

    // Split sort_by into individual sort elements and iterate over them
    const sortElements: string[] = sort_by.split(",");
    sortElements.forEach((element) => {
        // Check if the sort element matches the expected pattern
        if (!element.match(sortElementRegex)) {
            throw new Error(`Invalid sort element: ${element}`);
        }

        // Split the element into key and direction
        const [key, direction] = element.split(".");

        // Add the sort field to the sort object with the corresponding direction
        if (direction === "desc") {
            sortFields[key] = -1;
        } else {
            sortFields[key] = 1;
        }
    });

    return sortFields;
}