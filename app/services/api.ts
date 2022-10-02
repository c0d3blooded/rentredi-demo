import axios from "axios";
import { User } from "../models/user";

/**
 * Adds a new user
 * @param name
 * @param zipCode
 */
export const addUser = (name: string, zip_code: string) =>
  axios.post<User>("/users", { name, zip_code });

/**
 * Updates an existing user
 * @param id
 * @param name
 * @param zipCode
 */
export const updateUser = (id: string, name: string, zip_code: string) =>
  axios.put<User>(`/users/${id}`, { name, zip_code });

/**
 * Deletes an existing user
 * @param id
 * @returns
 */
export const deleteUser = (id: string) => axios.delete<string>(`/users/${id}`);
