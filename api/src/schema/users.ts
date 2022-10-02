import Ajv, { JTDSchemaType } from "ajv/dist/jtd";

// create/update user
interface InputUserRequest {
  name: string;
  zip_code: string;
}

// @ts-ignore
const inputUserSchema: JTDSchemaType<InputUserRequest> = {
  properties: {
    name: { type: "string" },
    zip_code: { type: "string" },
  },
};

export {
  inputUserSchema as createUserSchema,
  inputUserSchema as updateUserSchema,
};
