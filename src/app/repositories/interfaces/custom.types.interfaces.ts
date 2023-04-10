import { FilterQuery } from "mongoose"


export type FindAllQuery = {
    query: FilterQuery<any>,
    sort: any,
    limit: number,
    page: number,

}