import Joi from "joi";
import { ObjectIdSchema } from "./common.joi.schemas";
import ContentType from "@constants/contentTypes.enum";
import LinkType from "@constants/linkTypes.enum";
import ContentQuality from "@constants/contenetQuality.enum";
import { languageSchema } from "./common.title.joi.schemas";


const linkSchema: Joi.ObjectSchema = Joi.object({
    parentId: ObjectIdSchema.required().example('64134d08661b4da2fb891d48'),
    contentType: Joi.string().valid(...Object.values(ContentType)).required().example(ContentType.VIDEO),
    languages: Joi.array().items(languageSchema),
    linkType: Joi.string().valid(...Object.values(LinkType)).required().example(LinkType.DIRECT_FILE),
    quality: Joi.array().items(Joi.string().valid(...Object.values(ContentQuality))).required().example([ContentQuality.VIDEO_1080, ContentQuality.VIDEO_HD]),
    link: Joi.string().required().example('http://103.237.37.181/server1/Movies/South_Indian/Hindi%20Dubbed/2019/Saaho%20%282019%29%20Hindi%20Dubbed%20Proper%20720p/Saaho.2019.Hindi.1080p.NF.WEBRip.mp4'),
    title: Joi.string().required().example('Saaho.2019.Hindi.1080p.NF.WEBRip.mp4'),
    remarks: Joi.string().example("not working").allow(""),
})

export default linkSchema