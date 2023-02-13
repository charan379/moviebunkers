const jwt = require("jsonwebtoken");

exports.generateJwtToken = async (userObj) =>{
    let token;
    try {
        token = jwt.sign({...userObj}, 'secretkeyappearshere', { expiresIn: "1h" })
    } catch (error) {
        throw new Error("Error! Something went wrong. With Generating Token");s
    }

    return token;
}