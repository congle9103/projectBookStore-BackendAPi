import bcrypt from "bcrypt";
import { CallbackWithoutResultAndOptionalError } from "mongoose";

// Middleware hash password
export async function hashPassword(this: any, next: CallbackWithoutResultAndOptionalError) {
    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err as any);
    }
}

// Method so sánh password
export async function comparePassword(this: any, candidatePassword: string) {
    return bcrypt.compare(candidatePassword, this.password);
}
