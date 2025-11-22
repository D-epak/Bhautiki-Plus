import { Request, Response, NextFunction } from "express";

export default function rbac(allowedRoles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req['user'];

            //console.log(user,"...........")

            if (!user) {
                return res.status(401).json({
                    status: false,
                    message: "Unauthorized"
                });
            }

            if (!allowedRoles.includes(user.role)) {
                return res.status(403).json({
                    status: false,
                    message: "Access denied. You do not have permission."
                });
            }
            //console.log("...................role",user.role)
            next();

        } catch (error: any) {
            return res.status(500).json({
                status: false,
                message: error.message || "Internal server error"
            });
        }
    };
}
