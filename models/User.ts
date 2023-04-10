import mongoose, { Schema, Types, Model, HydratedDocument } from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import testUser from "../testUser";

export interface User {
    googleId?: string;
    email: string;
    name: string;
    password?: string;
    provider: 'local' | 'google';
    credits: number;
    createdAt: Date;
    updatedAt: Date;
    imageUrl?: string;
    surveys?: number;
}

interface UserMethods {
    generateToken(): string;
    toJSON(): Pick<User, 'email' | 'name' | 'provider' | 'credits'>;
    verifyPassword: (enteredPassword: string) => Promise<boolean>;
}

type UserModel = Model<User, {}, UserMethods> & {
    isTestUser(data: { email: string, password: string }): boolean;
    createTestUser(): HydratedDocument<User> & UserMethods;
}

const userSchema = new Schema<User, UserModel, UserMethods>({
    googleId: {
        type: String
    },
    email: {
        required: true,
        type: String
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String
    },
    provider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local'
    },
    credits: {
        type: Number,
        default: 10
    },
    imageUrl: {
        type: String
    }
}, {
    timestamps: true
})

userSchema.virtual('surveys', {
    ref: 'Survey',
    localField: '_id',
    foreignField: 'user',
    count: true
});

userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password!, 8);
    }
    next()
})

userSchema.methods.generateToken = function (this: HydratedDocument<User>) {
    const _id = this._id;
    const token = jwt.sign({ _id, googleId: this.googleId }, process.env.JWT_SECRET!, { expiresIn: '24h' });
    return token;
}

userSchema.method('toJSON', function (this: HydratedDocument<User>) {
    const userObject = this.toObject({ virtuals: true });
    delete userObject.password;
    delete userObject.googleId;
    return userObject;
})

userSchema.method('verifyPassword', async function (this: HydratedDocument<User>, enteredPassword: string) {
    const isMatch = await bcrypt.compare(enteredPassword, this.password!);
    return isMatch;
})

// Check if the user is a test User
userSchema.static('isTestUser', function ({ email, password }: { email: string, password: string }) {
    return email === testUser.email && password === testUser.password;
})

// Create a test user if it does not already exist
userSchema.static('createTestUser', async function () {
    let user: HydratedDocument<User> & UserMethods | null = await this.findOne({ email: testUser.email, password: testUser.password, provider: 'local' });
    if (!user) {
        user = await this.create(testUser);
    }
    return user;
})

//@ts-ignore
export default mongoose.models.User as UserModel || mongoose.model<User, UserModel>('User', userSchema);