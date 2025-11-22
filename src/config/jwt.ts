import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import moment from 'moment';
import jwt from "jsonwebtoken";
import { envConfigs } from './envconfig';

export const generateAuthTokens = (payload:{userId:any ,email?:any, role?:any}) => {
  const accessTokenExpires = moment().add(
    envConfigs.expiration_minutes,
    "minutes"
  );
  
  const accessToken = jwt.sign(JSON.stringify({
    userId: payload.userId,
    email: payload.email,
    role:payload.role,
    exp: accessTokenExpires.unix() // Set expiration time in UNIX timestamp format
  }), envConfigs.jwtsecret);
  return accessToken;
}

const jwtOptions = {
  secretOrKey: envConfigs.jwtsecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    done(null, payload);
  } catch (error) {
    done(error, false);
  }
};

export const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);