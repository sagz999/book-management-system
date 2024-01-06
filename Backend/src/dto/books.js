import Ajv from "ajv";

/**
 * @type {Ajv}
 */
const ajv = new Ajv({ allErrors: true, allowUnionTypes: true });

const addBookSchema = {
  type: "object",
  additionalProperties: false,
  required: ["title","userId"],
  properties: {
    title: { type: "string", minLength: 1, maxLength: 50 },
    userId: { type: "string", minLength: 24, maxLength: 24 }
  },
};

const editBookSchema = {
  type: "object",
  additionalProperties: false,
  required: ["published"],
  properties: {
    published: { type: "boolean" },
  },
};

export const publishBookDto = ajv.compile(addBookSchema);
export const editBookDto = ajv.compile(editBookSchema);

export default {};
