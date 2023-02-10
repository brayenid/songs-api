import InvariantError from '../../../exceptions/InvariantError.js'
import ImageHeadersSchema from './schema.js'

const UploadValidator = {
  validateImageHeaders: (headers) => {
    const validationResult = ImageHeadersSchema.validate(headers)

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  }
}

export default UploadValidator
