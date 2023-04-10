import ContentQuality from "@constants/contenetQuality.enum";
import ContentType from "@constants/contentTypes.enum";
import LinkType from "@constants/linkTypes.enum";
import mongoose, { ObjectId } from "mongoose";
import LanguageDTO from "./language.dto";

interface LinkDTO {
    _id: ObjectId
    parentId: mongoose.Types.ObjectId;
    contentType: ContentType;
    languages: LanguageDTO[];
    linkType: LinkType;
    quality: ContentQuality[];
    link: string;
    title: string;
    remarks: string;
    createdAt: Date;
    updatedAt: Date;
}

export default LinkDTO;