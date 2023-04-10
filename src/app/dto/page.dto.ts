
export default  interface PageDTO {
    page: number,
    total_pages: number,
    total_results: number,
    sort_order?: Object,
    list: any[],
}