import { validator } from '@ioc:Adonis/Core/Validator'
import DOMPurify from 'isomorphic-dompurify'
import { DateTime } from 'luxon'

validator.rule(
  'accepted',
  async (termsAccepted, _, { pointer, arrayExpressionPointer, errorReporter }) => {
    if (typeof termsAccepted !== 'boolean') {
      return
    }

    if (!termsAccepted) {
      errorReporter.report(pointer, 'accepted', 'Not Accepted', arrayExpressionPointer)
    }
  },
  () => {
    return {
      async: true,
    }
  }
)

validator.rule(
  'plaintextMax',
  (value, [maxLength], { pointer, arrayExpressionPointer, errorReporter, mutate }) => {
    if (value) {
      if (typeof maxLength !== 'number') {
        errorReporter.report(
          pointer,
          'plaintextMax',
          'Validation misconfigured',
          arrayExpressionPointer
        )
      }

      const sanitized = DOMPurify.sanitize(value, {
        ALLOWED_TAGS: ['p', 'br', 'strong', 'i', 'u', 'ul', 'ol', 'li'],
        ALLOWED_ATTR: [],
      })

      const clean = DOMPurify.sanitize(value, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
      })

      if (clean.length > maxLength) {
        errorReporter.report(pointer, 'accepted', 'Input too long', arrayExpressionPointer)
      }

      mutate(sanitized)
    }
  }
)

validator.rule(
  'numericEnumIncludes',
  (value, [acceptedValues], { pointer, arrayExpressionPointer, errorReporter }) => {
    if (acceptedValues.length === 0) {
      errorReporter.report(
        pointer,
        'numericEnumIncludes',
        'Validation misconfigured',
        arrayExpressionPointer
      )
    }
    const numericAcceptedValues = acceptedValues.filter((x) => typeof x === 'number')

    if (!numericAcceptedValues.includes(value)) {
      errorReporter.report(
        pointer,
        'numericEnumIncludes',
        'Does not include',
        arrayExpressionPointer
      )
    }
  }
)

validator.rule('dateMax', async (ends, _, { pointer, arrayExpressionPointer, errorReporter }) => {
  if (ends) {
    const oneMonthFromNow = new Date(
      DateTime.local().plus({ month: 1 }).toFormat('dd-MM-yyyy').toString()
    )

    if (ends > oneMonthFromNow) {
      errorReporter.report(
        pointer,
        'dateMax',
        'Date extends post date limit',
        arrayExpressionPointer
      )
    }
  }
})
