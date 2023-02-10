import InvariantError from '../../../exceptions/InvariantError.js'
import ExportPayload from './schema.js'

const ExportValidator = {
  exportPayload: (payload) => {
    const result = ExportPayload.validate(payload)
    if (result.error) {
      throw new InvariantError(result.error.message)
    }
  }
}

export default ExportValidator
