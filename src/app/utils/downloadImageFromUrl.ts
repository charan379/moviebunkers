import path from "path";
import fs from 'fs';
import https from 'https'

function downloadImageFromUrl(imageUrl: string, imageNameToBeSaved: string): Promise<string> {

    // Generate a unique filename for the image
    const uniqueId = 'image_' + imageNameToBeSaved;
    const filename = Buffer.from(uniqueId).toString('base64url') + path.extname(imageUrl);

    // Set the path for the public directory
    const publicDir = path.join(__dirname, '../../../public/images');

    // Create the full path for the image file
    const imagePath = path.join(publicDir, filename);

    console.log("written path: " + imagePath)
    return new Promise((resolve, reject) => {
        // Use https.get() to download the image data and fs.createWriteStream() to write the data to the new file
        https.get(imageUrl, function (response) {
            if (response.statusCode === 200) {
                const writeStream = fs.createWriteStream(imagePath);
                response.pipe(writeStream);
                console.log("before written file: " + filename)
                // Once the file is saved, resolve the Promise with the filename
                writeStream.on('finish', function () {
                    console.log("written file: " + filename)
                    resolve(filename);
                });
            } else {
                reject(`Failed to download image. Status code: ${response.statusCode}`);
            }
        }).on('error', function (error) {
            reject(error);
            console.log(error)
        });
    });
}

export default downloadImageFromUrl;
