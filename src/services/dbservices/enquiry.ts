import { desc, eq, inArray, sql } from 'drizzle-orm';
import postgresdb from '../../config/db';
import logger from '../../config/logger';
import { enquiries, enquiryComments, users } from '../../models/schema';

export  default class Enquiry {

        // CREATE ENQUIRY
    static createEnquiry =async(studentName ,studentEmail ,studentPhone ,course ,createdBy)=> {
        try {
            //console.log(studentEmail,studentName,studentPhone,course ,createdBy)
            const result = await postgresdb
                .insert(enquiries)
                .values({
                    studentName:studentName,
                    studentEmail:studentEmail,
                    studentPhone:studentPhone,
                    course:course,
                    createdBy:createdBy,
                })
                .returning();

            return result[0];

        } catch (error: any) {
            //console.log("SERVICE ERROR (createEnquiry):", error.message);
            throw new Error("Failed to create enquiry");
        }
    }

    static  listEnquiries=async(user , page , limit)=>{
    try {
        const offset = (page - 1) * limit;

        // 1️⃣ Build base query based on role
        const baseQuery = postgresdb
            .select()
            .from(enquiries);

        const countQuery = postgresdb
            .select({ count: sql<number>`count(*)` })
            .from(enquiries);

        if (user.role !== "ADMIN") {
            baseQuery.where(eq(enquiries.createdBy, user.userId));
            countQuery.where(eq(enquiries.createdBy, user.userId));
        }

        // 2️⃣ Fetch paginated data
        const data = await baseQuery
            .limit(limit)
            .offset(offset);

        // 3️⃣ Get total count
        const totalRow = await countQuery;
        const total = Number(totalRow[0].count);
        const totalPages = Math.ceil(total / limit);

        return { data, total, totalPages };

    } catch (error: any) {
        //console.log("SERVICE ERROR (listEnquiries):", error.message);
        throw new Error("Failed to fetch enquiries");
    }
}


        // GET ENQUIRY BY ID
    static  getEnquiryById= async(id, user)=>{
        try {
            const enquiry = await postgresdb
                .select()
                .from(enquiries)
                .where(eq(enquiries.id, id));
            if (enquiry.length === 0) return null;

            return enquiry[0];

        } catch (error: any) {
            //console.log("SERVICE ERROR (getEnquiryById):", error.message);
            throw new Error(error.message);
        }
    }


     // UPDATE STATUS (ADMIN ONLY)
    // UPDATE STATUS (ADMIN ONLY)
static async updateStatus(id, status, comment, adminId) {
    try {
        const result = await postgresdb.transaction(async (tx) => {

            // 1️⃣ Update Enquiry Status
            const updated = await tx
                .update(enquiries)
                .set({ status })
                .where(eq(enquiries.id, id))
                .returning();

            if (updated.length === 0) {
                throw new Error("Enquiry not found");
            }

            // 2️⃣ Insert Comment (only if exists)
            if (comment) {
                await tx.insert(enquiryComments).values({
                    enquiryId: id,
                    comment,
                    createdBy: adminId
                });
            }

            return updated[0];  // Return updated enquiry
        });

        return result;

    } catch (error: any) {
        //console.log("SERVICE ERROR (updateStatus):", error.message);
        throw new Error("Failed to update enquiry status");
    }
}

}