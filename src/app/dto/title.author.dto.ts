import { ObjectId } from "mongoose";
import { UserDTO } from "./user.dto";


interface TitleAuthorDTO {
    added_by?: ObjectId;
    last_modified_by?: ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

export default TitleAuthorDTO;