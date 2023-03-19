
import { Schema } from "mongoose";


export const authorExtendableSchema: Schema = new Schema(
    {
        added_by: {
            type: Schema.Types.ObjectId,
            ref: 'user',
        },
        last_modified_by: {
            type: Schema.Types.ObjectId,
            ref: 'user',
        },
    },
);


export default authorExtendableSchema;