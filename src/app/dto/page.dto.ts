/**
 * Data Transfer Object for a paginated list of items
 * @interface
 */
export default interface PageDTO {
    /** The current page number */
    page: number,
    /** The total number of pages */
    total_pages: number,
    /** The total number of items in the list */
    total_results: number,
    /** An optional object specifying the sort order of the list */
    sort_order?: Object,
    /** The list of items on the current page */
    list: any[],
}
