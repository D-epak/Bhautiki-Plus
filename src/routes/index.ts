import express, {Request, Response} from "express";
import auth from "./auth";
import enquiry from "./enquiry"
const router = express.Router();



const defaultRoutes = [
  {
    path: "/auth",
    route: auth,
  },
  {
    path:"/api/enquiries",
    route:enquiry
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

router.get("/", async (req:Request, res: Response)=>{
  return res.send("Server is running");
});

export default router;
