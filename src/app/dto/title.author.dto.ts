import { ObjectId } from "mongoose";


interface TitleAuthorDTO {
    added_by?: ObjectId;
    last_modified_by?: ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

export default TitleAuthorDTO;