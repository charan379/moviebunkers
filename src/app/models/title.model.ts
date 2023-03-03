import mongoose, { Model, Schema } from "mongoose";
import ITitle from "./interfaces/title.interface";


const titleSchema: Schema<ITitle> = new Schema<ITitle>(
    {},
    {
        collection: "titles",
    }
);

const TitleModel: Model<ITitle> = mongoose.model<ITitle>("title", titleSchema);

export default TitleModel;