import ContentQuality from "@constants/contenetQuality.enum";
import ContentType from "@constants/contentTypes.enum";
import LinkType from "@constants/linkTypes.enum";
import LanguageDTO from "./language.dto";
import ILink from "@models/interfaces/ILinks";

/**
 * Represents a data transfer object for a link document.
 */
interface LinkDTO {
    _id: string;
    parentId: string;
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

/**
 * Maps an instance of `ILink` to an instance of `LinkDTO`.
 * 
 * @param {ILink} link - The `ILink` instance to map to a `LinkDTO`.
 * @returns {LinkDTO} The newly created `LinkDTO` instance.
 */
export function ilinkToLinkDTOMapper(link: ILink): LinkDTO {
    const linkDTO: LinkDTO = {
        _id: link._id?.toString(),
        parentId: link?.parentId.toString(),
        contentType: link?.contentType,
        languages: link?.languages,
        linkType: link?.linkType,
        quality: link?.quality,
        link: link?.link,
        title: link?.title,
        remarks: link?.remarks,
        createdAt: link?.createdAt,
        updatedAt: link?.updatedAt
    }

    return linkDTO
}
