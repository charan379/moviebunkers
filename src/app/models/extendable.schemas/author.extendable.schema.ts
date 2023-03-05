
import { Schema } from "mongoose";


export const authorExtendableSchema : Schema = new Schema(
    {
        added_by: {
            type: String,
            default:"dev",
        },
        last_modified_by: {
            type: String,
            default: "dev"
        },
    },
);


export default authorExtendableSchema;