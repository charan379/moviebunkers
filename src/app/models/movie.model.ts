import mongoose, { Model, Schema } from "mongoose";
import authorExtendableSchema from "./extendable.schemas/author.extendable.schema";
import baseTitleExtendableSchema from "./extendable.schemas/base.title.extendable.schema";
import IMovie from "./interfaces/movie.interface";


export const movieSchema: Schema<IMovie> = new Schema<IMovie>(
    {},
    {
        timestamps: {
            createdAt: true,
            updatedAt: true,
        },
        collection: "titles",
    }
).add(baseTitleExtendableSchema.add(authorExtendableSchema));

const MovieModel: Model<IMovie> = mongoose.model<IMovie>("movie", movieSchema);

export default MovieModel;