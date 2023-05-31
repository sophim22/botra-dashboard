import jwt from 'jsonwebtoken';
import {authConfig} from './';

export const generateToken = (user) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        phone: user.phone,
        id: user.id,
      },
      authConfig.secret,
      {
        algorithm: authConfig.algorithms[0],
        expiresIn: '48h'
      },
      (err, token) => {
        if (err) {
          return reject(err);
        }
        if (!token) {
          return new Error('Empty token');
        }
        console.log({token})

        return resolve(token);
      }
    )
  })
}

export const verifyToken = async (token) => jwt.verify(token, authConfig.secret);

export const clearSession = async (token) => {
  const invalid = await redis.invokeToken(token);
  return invalid;
}