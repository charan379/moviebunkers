import ContentQuality from "@constants/contenetQuality.enum";
import ContentType from "@constants/contentTypes.enum";
import LinkType from "@constants/linkTypes.enum";
import { ObjectId } from "mongoose";

interface ILink {
    parentId: ObjectId;
    contentType: ContentType;
    linkType: LinkType;
    quality: ContentQuality[];
    link: string;
    createdAt: Date;
    updatedAt: Date;
}

export default ILink;