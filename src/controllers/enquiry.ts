import { Request, Response, NextFunction } from "express";
import dbservices from "../services/dbservices";

export default class Enquiry {

static enquiry = async (req: Request, res: Response) => {
        try {
            const user = req["user"]; // added by auth middleware
            const { studentName, studentEmail, studentPhone, course } = req.body;

            const enquiry = await dbservices.Enquiry.createEnquiry(
                studentName,
                studentEmail,
                studentPhone,
                course,
                user.userId
            );

            return res.status(200).json({
                status: true,
                message: "Enquiry created successfully",
                data: enquiry
            });

        } catch (error: any) {
            //console.log("ENQUIRY CREATE ERROR:", error);
            return res.status(500).json({ status: false, message: error.message });
        }
    };

        // LIST ENQUIRIES
    static list= async (req: Request, res: Response)=> {
        try {
            const user = req['user'];

            // GET page & limit FROM QUERY
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const { data, total, totalPages } = await dbservices.Enquiry.listEnquiries(user ,page , limit);

            return res.status(200).json({
                status: true,
                message: "Enquiries fetched successfully",
                data: data
            });

        } catch (error: any) {
            //console.log("CONTROLLER ERROR (list):", error.message);
            return res.status(500).json({ status: false, message: error.message });
        }
    }


    static async getById(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const user = req['user'];

            const enquiry = await dbservices.Enquiry.getEnquiryById(id, user);

            if (!enquiry) {
                return res.status(404).json({
                    status: false,
                    message: "Enquiry not found"
                });
            }

            return res.status(200).json({
                status: true,
                message: "Enquiry fetched successfully",
                data: enquiry
            });

        } catch (error: any) {
            //console.log("CONTROLLER ERROR (getById):", error.message);
            return res.status(500).json({ status: false, message: error.message });
        }
    }



    static async updateStatus(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const { status, comment } = req.body;
            const user = req['user'];

            const updated = await dbservices.Enquiry.updateStatus(id, status, comment, user?.userId);

            return res.status(200).json({
                status: true,
                message: "Enquiry status updated",
                data: updated
            });

        } catch (error: any) {
            //console.log("CONTROLLER ERROR (updateStatus):", error.message);
            return res.status(500).json({ status: false, message: error.message });
        }
    }

}