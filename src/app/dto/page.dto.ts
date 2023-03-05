import TitleDTO from "./title.dto";
import { UserDTO } from "./user.dto";

export default  interface PageDTO {
    page: number,
    total_pages: number,
    total_results: number,
    sort_order?: Object,
    list: any[],
}