import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export function generateAccessToken(arg) {
    const token = jwt.sign(arg, process.env.JWT_ACCESS_SECRET, { expiresIn: '1h' });
    return token;
}


export function decodeJwtAccessToken(token) {
    try {
        const response = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        return response;
    } catch (error) {
        return;
    }
}
