import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import exp from "constants";

const prisma = new PrismaClient();


/**
 * Handle for the login request
 * Must be a POST request, with 'email' and 'password' in the body
 * Check if the user exists and validate the password
 */
export default async function handler(req, res) {
    if (req.method === "POST") {
        const { email, password } = req.body;

        try{
            const user = prisma.user.findUnique({
                where: {
                    email: email
                }
            });

            // validate the password
            if(user && await bcrypt.compare(password, user.password)){
                res.status(200).json({ message: "Login successful", email: user.email });
            }
            else {
                res.status(401).json({ message: "Invalid credentials" });
            }
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    else {
        res.status(500).json({ message: "Method not allowed" });
    }
}
