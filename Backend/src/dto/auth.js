import Ajv from 'ajv'

/**
 * @type {Ajv}
 */
const ajv = new Ajv({ allErrors: true, allowUnionTypes: true })

const authSchema = {
  
    type: 'object',
    additionalProperties: false,
    required: ['username',  'password'],
    properties: {
      username: { type: 'string', minLength: 4, maxLength: 50 },
      password: { type: 'string', minLength: 8 }
    }
  
}


export const authDto = ajv.compile(authSchema)

export default {}
