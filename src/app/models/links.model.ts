import mongoose, { Model, Schema } from "mongoose";
import ILink from "./interfaces/ILinks";
import ContentType from "@constants/contentTypes.enum";
import LinkType from "@constants/linkTypes.enum";
import ContentQuality from "@constants/contenetQuality.enum";


const linkSchema: Schema<ILink> = new Schema<ILink>(
    {
        parentId: {
            type: Schema.Types.ObjectId,
        },
        contentType: {
            type: String,
            enum: [...Object.values(ContentType)],
            required: [true, "content type required"],
        },
        languages: {
            type: [Object],
            _id: false,
        },
        linkType: {
            type: String,
            enum: [...Object.values(LinkType)],
            required: [true, 'link type is required']
        },
        quality: {
            type: [String],
            enum: [...Object.values(ContentQuality)],
            required: [true, 'atleast one quality type is required']
        },
        link: {
            type: String,
            required: [true, 'link is required']
        },
        title: {
            type: String,
            required: [true, 'title is required']
        },
        remarks: {
            type: String
        }
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: true,
        },
        collection: "links"
    }
);

const LinkModel: Model<ILink> = mongoose.model<ILink>("Link", linkSchema);

export default LinkModel;