import connectDB from "@/app/config/connectDB.js";
import User from "../../../models/user.js";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import twilio from "twilio";
import { MongoClient } from "mongodb";

export async function POST(req) {
  await connectDB();
  try {
    // Validate the request body
    const body = await req.json();
    console.log("USER", body);
    const { email, username, password, phone } = body;
    if (!username || !email || !password || !phone) {
      return NextResponse.json(
        { success: false, message: "Invalid request body" },
        { status: 400 }
      );
    }

    // Check if the user already exists
    let alreadyUser = await User.findOne({
      $or: [{ username, email, phone }],
    });

    if (alreadyUser) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 400 }
      );
    }

    // send otp on user phone
    const mongoClient = new MongoClient(process.env.MONGODB_URL);
    await mongoClient.connect();
    const otps = mongoClient.db().collection("otps");
    await otps.insertOne({
      phone: phone,
      otp: hashedOtp,
      expiry: Date.now() + 10 * 60 * 1000, // OTP expires after 10 minutes
    });
    await mongoClient.close();

    // Hashed the password
    if (req.body.password) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body?.password, salt);
      req.body.password = hash;
    }

    // Create a user and save to the database
    const user = new User(body);
    await user.save();

    //genrate token
    const refreshToken = jwt.sign(
      {
        sessionId: user?._id,
      },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "30d",
      }
    );

    return NextResponse.json(
      { status: true, message: "User created successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.log("Error:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
