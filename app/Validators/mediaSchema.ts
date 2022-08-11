import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default schema.object.optional().members({
  uuid: schema.string.optional({}),
  source: schema.string({ trim: true }, [rules.maxLength(255)]),
  title: schema.string.optional({ trim: true }, [rules.maxLength(255)]),
  credit: schema.string.optional({ trim: true }),
})
