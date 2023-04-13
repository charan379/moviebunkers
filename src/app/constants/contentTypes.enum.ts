/**
 * An enumeration of content types.
 * @readonly
 * @enum {string}
 * @property {string} VIDEO - Video content.
 * @property {string} IMAGE - Image content.
 * @property {string} ZIP - Compressed file content.
 * @property {string} FOLDER - Folder content.
 */
enum ContentType {
    VIDEO = 'Video',
    IMAGE = 'Image',
    ZIP = 'Zip',
    FOLDER = 'Folder'
}

export default ContentType;
