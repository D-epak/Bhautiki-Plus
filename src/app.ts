import express from "express";
import cors from "cors"
import { envConfigs } from "./config/envconfig";
import logger from "./config/logger";
import router from "./routes";
import passport from "passport";
import { jwtStrategy } from "./config/jwt";
import { apiLimiter } from "./middleware/api-limiter";



const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use(cors({ origin: "*"}));
passport.use('jwt', jwtStrategy);
app.use("/", apiLimiter);
app.use("/", router);


app.listen(envConfigs.port, () => {
  logger.info(`Server started on ${envConfigs.port}`);
})
