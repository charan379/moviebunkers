
/**
 * AgeRatings object stores certification and age ranges for different regions.
 */
const AgeRatings = {
    IN: [ // India
        { certification: "U", age: [0, 11] },
        { certification: "U/A 7+", age: [7, 12] },
        { certification: "U/A 13+", age: [13, 16] },
        { certification: "U/A 16+", age: [16, 18] },
        { certification: "UA", age: [12, 17] },
        { certification: "A", age: [18, 21] },
        { certification: "S", age: [21, 26] },
        { certification: "MB-26", age: [21, 26] },
    ],

    DE: [ // germany
        { certification: "0", age: [0, 5] },
        { certification: "6", age: [6, 11] },
        { certification: "12", age: [12, 15] },
        { certification: "16", age: [16, 17] },
        { certification: "18", age: [18, 21] },
        { certification: "Educational", age: [22, 26] },
        { certification: "MB-26", age: [21, 26] },
    ]
};

export default AgeRatings;
