import countries from 'i18n-iso-countries';
import { IntlShape } from 'react-intl';
import * as Yup from 'yup';
import { ErrorKeys, errorMessages } from 'components/AddressesManagement/ValidationErrors';
import { Maybe } from 'types/utils';
import JoanieApi from 'api/joanie';

Yup.setLocale({
  mixed: {
    default: (values) => ({ key: ErrorKeys.MIXED_INVALID, values }),
    required: (values) => ({ key: ErrorKeys.MIXED_REQUIRED, values }),
    oneOf: (values) => ({ key: ErrorKeys.MIXED_ONEOF, values }),
  },
  string: {
    max: (values) => ({ key: ErrorKeys.STRING_MAX, values }),
    min: (values) => ({ key: ErrorKeys.STRING_MIN, values }),
  },
});

export const getLocalizedErrorMessage = (
  intl: IntlShape,
  error: Maybe<
    | string
    | {
        key: ErrorKeys;
        values: Record<PropertyKey, string | number | Array<string | number>>;
      }
  >,
) => {
  if (!error) return undefined;

  if (typeof error === 'string' || errorMessages[error.key] === undefined) {
    // If the error has not been translated we return a default error message.
    return intl.formatMessage(errorMessages[ErrorKeys.MIXED_INVALID]);
  }

  return intl.formatMessage(errorMessages[error.key], error.values);
};

let customPaymentAddressForm = {};

const setComplementaryConfigurations = (async () => {
  const response = await JoanieApi().complementaryConfigurations.get();
  customPaymentAddressForm = response.paymentAddressForm || {};
})();

const defineFieldBehavior = (objBehavior: Record<string, any>) => {
  let schemaObj: Yup.AnyObject = {};
  Object.entries(objBehavior).forEach(([key, value]) => {
    switch (value.toString()) {
      case 'optional':
        schemaObj[key] = Yup.string().optional();
        break;
      case 'hidden':
        break;
      case 'required':
        schemaObj[key] = Yup.string().required();    
      }
  });
  schemaObj.country = Yup.string().oneOf(Object.keys(countries.getAlpha2Codes())).required();
  schemaObj.title = Yup.string().required().min(2),
  schemaObj.save = Yup.boolean();
  return schemaObj;
};
console.log(customPaymentAddressForm)
const fieldBehaviorSchema = defineFieldBehavior(customPaymentAddressForm);

// / ! \ If you need to edit the validation schema,
// you should also add/edit error messages above.
console.log(fieldBehaviorSchema)
const schema = Yup.object().shape(fieldBehaviorSchema);



// const schema = Yup.object().shape({
//   address: Yup.string().required(),
//   city: Yup.string().required(),
//   country: Yup.string().oneOf(Object.keys(countries.getAlpha2Codes())).required(),
//   first_name: Yup.string().required(),
//   last_name: Yup.string().required(),
//   vat_id: Yup.string().optional(),
//   postcode: Yup.string().required(),
//   title: Yup.string().required().min(2),
//   save: Yup.boolean(),
// });

export default schema;
