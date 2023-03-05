import TitleType from "@constants/titile.types.enum";
import mongoose, { Model, Schema } from "mongoose";
import authorExtendableSchema from "./extendable.schemas/author.extendable.schema";
import baseTitleExtendableSchema from "./extendable.schemas/base.title.extendable.schema";
import tvExtendableSchema from "./extendable.schemas/tv.extendable.schema";
import ITv from "./interfaces/tv.interface";



const tvSchema: Schema<ITv> = new Schema<ITv>(
    {
        // title_type
        title_type: {
            type: String,
            enum: [TitleType.TV],
            required: [true, "titile type required"],
        },
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: true,
        },
        collection: "titles",
    }
).add(baseTitleExtendableSchema.add(tvExtendableSchema.add(authorExtendableSchema)));


const TvModel: Model<ITv> = mongoose.model<ITv>("tv", tvSchema);

export default TvModel;