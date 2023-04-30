import ContentQuality from "@constants/contenetQuality.enum";
import ContentType from "@constants/contentTypes.enum";
import LinkType from "@constants/linkTypes.enum";
import LanguageDTO from "@dto/language.dto";
import mongoose from "mongoose";

interface ILink {
    _id: mongoose.Types.ObjectId;
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

export default ILink;