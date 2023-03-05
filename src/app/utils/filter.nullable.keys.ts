

function FilterNullableKeys(object: object) {
    
    return Object.entries(object)
    .filter(([_, value]) => {
        return (value !== null && value !== "" && value !== undefined)
    })
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
}

export default FilterNullableKeys;