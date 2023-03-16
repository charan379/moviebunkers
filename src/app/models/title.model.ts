import mongoose, { Model, Schema } from "mongoose";
import ITitle from "./interfaces/title.interface";


const titleSchema: Schema<ITitle> = new Schema<ITitle>(
    {
        // added_by: {
        //     type: Schema.Types.ObjectId,
        //     ref: 'user',
        // },
        // last_modified_by: {
        //     type: Schema.Types.ObjectId,
        //     ref: 'user',
        // },
    },
    {
        collection: "titles",
    }
);

const TitleModel: Model<ITitle> = mongoose.model<ITitle>("title", titleSchema);

export default TitleModel;