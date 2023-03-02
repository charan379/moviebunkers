import mongoose, { Model, Schema } from "mongoose";
import IMovie from "./interfaces/movie.interface";
import ITv from "./interfaces/tv.interface";


const titleSchema: Schema<IMovie | ITv> = new Schema<IMovie | ITv>(
    {},
    {
        collection: "titles",
    }
);

const TitleModel: Model<IMovie | ITv> = mongoose.model<IMovie | ITv>("title", titleSchema);

export default TitleModel;