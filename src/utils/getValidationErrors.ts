import { ValidationError } from 'yup'

interface Errors {
  [key: string]: string
}

export default function getValidationErrors (error: ValidationError) : Errors {
  const validationErrors: Errors = error.inner.reduce(
    (result: Errors, error) => {
      result[error.path] = error.message
      return result
    }, {})

  return validationErrors
}
