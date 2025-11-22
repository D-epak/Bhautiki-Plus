import * as dotenv from "dotenv";
import { z } from "zod";

// Load the default environment variables first
dotenv.config();

const currentEnv = process.env.NODE_ENV ?? "development";

// Load environment specific overrides if present (e.g. .env.production)
dotenv.config({
  path: `.env.${currentEnv}`,
  override: true,
});

const envVarsSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  PORT: z.string().default("8080").transform((value) => parseInt(value, 10)),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  EXPIRATION_MINUTES :z.string(),
  SMTP_HOST:z.string(),
  SMTP_PORT:z.string(),
  SMTP_USER:z.string(),
  SMTP_PASS:z.string(),
  FROM_EMAIL:z.string(),
});

const envVars = envVarsSchema.parse({
  ...process.env,
  NODE_ENV: currentEnv,
});

export const envConfigs = {
  nodeEnv: envVars.NODE_ENV,
  port: envVars.PORT,
  jwtsecret: envVars.JWT_SECRET,
  db_url: envVars.DATABASE_URL,
  expiration_minutes:envVars.EXPIRATION_MINUTES ,
  smtp_host:envVars.SMTP_HOST,
  smtp_port:envVars.SMTP_PORT,
  smtp_user:envVars.SMTP_USER,
  smtp_pass:envVars. SMTP_PASS,
  from_email:envVars. FROM_EMAIL
};







