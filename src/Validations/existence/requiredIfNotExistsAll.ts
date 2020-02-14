/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import { SyncValidation } from '@ioc:Adonis/Core/Validator'
import { getFieldValue, ensureValidArgs } from '../../utils'

const RULE_NAME = 'requiredIfNotExistsAll'
const DEFAULT_MESSAGE = 'requiredIfNotExistsAll validation failed'

/**
 * Ensure the value exists. `null`, `undefined` and `empty string`
 * fails the validation
 */
export const requiredIfNotExistsAll: SyncValidation<{ fields: string[] }> = {
  compile (_, __, args) {
    ensureValidArgs(RULE_NAME, args)
    const [fields] = args

    /**
     * Ensure "fields" are defined
     */
    if (!fields) {
      throw new Error(`${RULE_NAME}: expects an array of "fields"`)
    }

    /**
     * Ensure "fields" is an array
     */
    if (!Array.isArray(fields)) {
      throw new Error(`${RULE_NAME}: expects "fields" to be an array`)
    }

    return {
      allowUndefineds: true,
      async: false,
      name: RULE_NAME,
      compiledOptions: { fields },
    }
  },
  validate (
    value,
    compiledOptions,
    { root, tip, errorReporter, pointer, arrayExpressionPointer },
  ) {
    const allFieldsMissing = compiledOptions.fields.every((field) => {
      const otherFieldValue = getFieldValue(field, root, tip)
      return otherFieldValue === undefined || otherFieldValue === null
    })

    if (allFieldsMissing && !value && value !== false && value !== 0) {
      errorReporter.report(pointer, RULE_NAME, DEFAULT_MESSAGE, arrayExpressionPointer)
    }
  },
}
