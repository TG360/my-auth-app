import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";


const prisma = new PrismaClient();

export default async function handler(req, res) {
    // check if request method is POST

    if (req.method === "POST") {
        const { email, password } = req.body;

        // hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                },
            });

            res.status(201).json({ message: "User created successfully", email: user.email });
        }
        catch (error) {
            console.error(error);
            res.status(400).json({ message: "Email already Exists" });
        }
    }
    else {
        res.status(500).json({ message: "Method not allowed" });
    }
}