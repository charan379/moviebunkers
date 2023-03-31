import fs from 'fs';
import path from "path";

async function deleteImage(imageName: string) {

    const imagePath = path.join(__dirname, `../../../public/images/${imageName}`);
    fs.unlink(imagePath, (err) => {
        if (err) {
            //  do nothing 
            console.log(err)
        };
    });
}

export default deleteImage