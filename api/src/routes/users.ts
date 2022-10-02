const express = require("express");
const cors = require("cors");
const Ajv = require("ajv/dist/jtd");
import { Request, Response } from "express";
const router = express.Router();
import HttpStatus from "http-status-codes";
// firebase dependencies
import { getDatabase, ref, get, set, child, push } from "firebase/database";
import { createUserSchema, updateUserSchema } from "../schema/users";
import { getWeatherInformation } from "../services/openWeatherApi";
import { User } from "../models/users";
import { Weather } from "../models/weather";

// schema validator
const ajv = new Ajv();
const userRef = ref(getDatabase(), "/users");

router.get(
  "/users/:userId",
  async (req: Request<{ userId: string }>, res: Response) => {
    const { userId } = req.params;
    if (!userId) {
      res.status(HttpStatus.BAD_REQUEST).send("Missing id query");
      return;
    }
    const snapshot = await get(child(userRef, userId));

    if (!snapshot.exists()) {
      res.status(HttpStatus.NOT_FOUND).send("User not found");
      return;
    }
    // send response
    res.json(snapshot.val());
  }
);

router.post("/users", async (req: Request, res: Response) => {
  // validate inputs
  const valid = ajv.validate(createUserSchema, req.body);
  if (!valid) {
    console.error(ajv.errors);
    res.status(HttpStatus.BAD_REQUEST).send(ajv.errors);
    return;
  }

  const { name, zip_code } = req.body as User;
  let weatherInformation: Weather;
  try {
    weatherInformation = await getWeatherInformation(zip_code);
  } catch (e: unknown) {
    console.log(e);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send("Could not connect to Weather API");
    return;
  }
  // get a new uuid and add a new user
  const id = await push(userRef).key;
  if (!id) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send("Could not save the user");
    return;
  }
  // set the user information
  const {
    coord: { lat, lon },
    timezone,
  } = weatherInformation;
  const newUser: User = {
    id,
    name,
    zip_code,
    latitude: lat,
    longitude: lon,
    timezone,
  };
  // save to Firebase
  try {
    await set(child(userRef, id), newUser);
  } catch (e: unknown) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send("Could not create the user");
    return;
  }
  console.log(`user created: ${id}`);
  res.json(newUser);
});

router.put(
  "/users/:userId",
  async (req: Request<{ userId: string }>, res: Response) => {
    const { userId } = req.params;
    if (!userId) {
      res.status(HttpStatus.BAD_REQUEST).send("Missing id query");
      return;
    }
    // validate inputs
    const valid = ajv.validate(updateUserSchema, req.body);
    if (!valid) {
      console.error(ajv.errors);
      res.status(HttpStatus.BAD_REQUEST).send(ajv.errors);
      return;
    }

    const { name, zip_code } = req.body as User;
    let weatherInformation: Weather;
    try {
      weatherInformation = await getWeatherInformation(zip_code);
    } catch (e: unknown) {
      console.log(e);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send("Could not connect to Weather API");
      return;
    }
    // set the user information
    const {
      coord: { lat, lon },
      timezone,
    } = weatherInformation;
    const newUser: User = {
      id: userId,
      name,
      zip_code,
      latitude: lat,
      longitude: lon,
      timezone,
    };
    // save to Firebase
    try {
      await set(child(userRef, userId), newUser);
    } catch (e: unknown) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send("Could not update the user");
      return;
    }
    console.log(`user updated: ${userId}`);
    res.json(newUser);
  }
);

router.delete(
  "/users/:userId",
  async (req: Request<{ userId: string }>, res: Response) => {
    const { userId } = req.params;
    // delete from Firebase
    try {
      await set(child(userRef, userId), null);
    } catch (e: unknown) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send("Could not delete the user");
      return;
    }
    console.log(`user deleted: ${userId}`);
    // send response
    res.send(userId);
  }
);

module.exports = router;
