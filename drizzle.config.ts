import {envConfigs} from "./src/config/envconfig"

export default ({
  dialect: "postgresql", 
  schema: "./src/models/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url:envConfigs.db_url
  },
});