import Joi from 'joi'
const ExportPayload = Joi.object({
  targetEmail: Joi.string().email({ tlds: true }).required()
})

export default ExportPayload
