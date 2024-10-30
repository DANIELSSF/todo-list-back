import 'dotenv/config';
import * as joi from 'joi';
import { AuthEnvs } from '../interfaces';

const envsSchema = joi
  .object({
    JWT_SECRET: joi.string().required(),
    JWT_EXPIRES_IN: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) throw new Error(`Config validation error: ${error.message}`);

const envVars: AuthEnvs = value;

export const authEnvs = {
  jwtSecret: envVars.JWT_SECRET,
  jwtExpiresIn: envVars.JWT_EXPIRES_IN,
};
