import "dotenv/config";
import * as CryptoJS from 'crypto-js';

export const authConfig = {
	algorithms: ['HS256'],
	secret: process.env.JWT_SECRET,
};


export const encryptMessage = (message) => {
	if(!message) return '';
	return CryptoJS.AES.encrypt(message, process.env.ENCRYPT_SECRET_KEY).toString();
}

export const decryptMessage = (hash) => {
	if(!hash) return '';
	return CryptoJS.AES.decrypt(hash, process.env.ENCRYPT_SECRET_KEY).toString(CryptoJS.enc.Utf8);
}