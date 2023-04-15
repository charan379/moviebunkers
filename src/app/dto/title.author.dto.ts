import { ObjectId, Types } from "mongoose";


interface TitleAuthorDTO {
    added_by?: Types.ObjectId;
    last_modified_by?: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

export default TitleAuthorDTO;