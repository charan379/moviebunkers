import IUser from "@src/app/models/interfaces/user.interface"
import { FilterQuery, SortOrder, SortValues } from "mongoose"


export type FindAllQuery = {
    query?: FilterQuery<any>,
    sort?: any,
    limit: number,
    page: number,

}