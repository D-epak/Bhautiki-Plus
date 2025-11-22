import express from "express"
import controllers from "../controllers"
import { authenticateUser } from "../middleware"
import rbac from "../middleware/role"


const router=express.Router()

router.post('/' ,authenticateUser ,rbac(["ADMIN", "FRONT_DESK"]),controllers.Enquiry.enquiry)
router.get("/", authenticateUser, rbac(["ADMIN", "FRONT_DESK"]), controllers.Enquiry.list);
router.get("/:id", authenticateUser, rbac(["ADMIN", "FRONT_DESK"]), controllers.Enquiry.getById);
router.put("/:id/status", authenticateUser, rbac(["ADMIN"]), controllers.Enquiry.updateStatus);


export default router