import { desc, eq, inArray } from 'drizzle-orm';
import postgresdb from '../../config/db';
import logger from '../../config/logger';
import { users } from '../../models/schema';

export  default class Auth {

    static getUserByEmail = async(email)=>{
        try {
            return postgresdb.select().from(users).where(eq(email , users.email))
        } catch (error) {
            throw new Error
        }
    }


static createUser = async ({ email, name, password }) => {
    try {
        return await postgresdb
            .insert(users)
            .values({name,email,password})
            .returning();   
    } catch (error) {
        //console.log("DB ERROR:", error);
        throw new Error("Database Error");
    }
}


static verifyUser = async (email: string) => {
    try {
        const updated = await postgresdb
            .update(users)
            .set({ isVerified: true })
            .where(eq(users.email, email))
            .returning();

        return updated.length > 0 ? updated[0] : null;

    } catch (error) {
        //console.log("DB ERROR:", error);
        throw new Error("Database Error");
    }
}

}