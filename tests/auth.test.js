// tests/auth.test.js
import { expect } from "chai";
import request from "supertest";
import mongoose from "mongoose";
import app from "../server.js";
import user from "../model/user.model.js";

describe("Authentication API Tests", () => {
  let authToken;

  before(async () => {
    await mongoose.connect(process.env.MONGO_URL);
  });

  after(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await user.deleteMany({});
    const existingUser = new user({
      email: "test@example.com",
      name: "Test User",
      password: "testpassword",
    });
    await existingUser.save();
  });

  afterEach(async () => {
    // await user.deleteMany({});
  });

  it("should register a new user", async () => {
    const res = await request(app).post("/user/register").send({
      email: "newuser@example.com",
      name: "New User",
      password: "newpassword",
    });
    expect(res.status).to.equal(200);
  });

  it("should not register a user with the same email", async () => {
    const res = await request(app).post("/user/register").send({
      email: "test@example.com",
      name: "Duplicate User",
      password: "duplicatepassword",
    });
    expect(res.status).to.equal(400);
  });

  it("should log in an existing user", async () => {
    const res = await request(app)
      .post("/user/login")
      .send({ email: "test@example.com", password: "testpassword" });
    authToken = res.body.token;
  });

  it("should not log in with incorrect password", async () => {
    const res = await request(app)
      .post("/user/login")
      .send({ email: "test@example.com", password: "incorrectpassword" });
    expect(res.status).to.equal(404);
  });

  it("should logout a user", async () => {
    const res = await request(app)
      .post("/user/logout")
      .set("Authorization", authToken);
    expect(res.status).to.equal(200);
  });

  it("should not logout with an invalid token", async () => {
    const res = await request(app)
      .post("/user/logout")
      .set("Authorization", "invalidtoken");
    expect(res.status).to.equal(401);
  });

  it("should refresh the authentication token", async () => {
    const res = await request(app)
      .post("/user/refresh-auth-token")
      .set("Authorization", authToken);
    expect(res.status).to.equal(200);
    expect(res.body.token).to.be.a("string");
  });

  it("should not refresh token with an invalid token", async () => {
    const res = await request(app)
      .post("/user/refresh-auth-token")
      .set("Authorization", "invalidtoken");
    expect(res.status).to.equal(401);
  });

  it("should not refresh token after logging out", async () => {
    await request(app).post("/user/logout").set("Authorization", authToken);

    const res = await request(app)
      .post("/user/refresh-auth-token")
      .set("Authorization", authToken);
    expect(res.status).to.equal(401);
  });

  it("should not register a user with invalid input", async () => {
    const res = await request(app).post("/user/register").send({
      email: "newuser@example.com",
      name: "New User",
    });
    expect(res.status).to.equal(500);
  });
});
