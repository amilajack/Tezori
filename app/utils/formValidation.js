import _ from 'lodash';
import fs from 'fs';

function minLength(length, name) {
  return `${name} must be at least ${length} characters.`
}

function hasLength(length, name) {
  return `${name} must be exactly ${length} characters.`
}

export function displayError(validations) {
  for (let i = 0; i < validations.length; i++) {
    const error = hasError(validations[i].value, validations[i].type, validations[i].name);
    if (error) {
      return error;
    }
  }

  return false;
}
/**
 *
 * @param value { string | string[] }
 * @param validateType { string }
 * @returns { false | string }
 */
export default function hasError(value, validateType, name) {
  switch(validateType) {
    case 'validAmount':
      if ( !_.isFinite(value) ) {
        return `Amount is not valid.`;
      }
      break;
    case 'posNum':
      if ( value < 1 ) {
        return `${name} is too small.`;
      }
      break;
    case 'validAddress':
      if ( value.length < 36 ) {
        return hasLength(36, 'Address');
      }

      if ( !RegExp('^tz1|^KT1').test(value)) {
        return `Address must begin with tz1 or KT1.`;
      }
      break;
    case 'notEmpty':
      if ( !value ) {
        return `${name} must not be empty.`;
      }
      break;
    case 'locationFilled':
      if ( !value.length ) {
        return 'Must upload a wallet.';
      }
      break;
    // case 'validJS':
    //   try {
    //       JSON.parse(fs.readFileSync(value));
    //   } catch (e) {
    //       return 'Corrupt .tezwallet file';
    //   }
    //   break;
    case 'minLength8':
      if ( value.length < 8 ) {
        return minLength(8, name);
      }
      break;
    case 'samePassPhrase':
      if ( !(Array.isArray(value ) && value.length == 2) ) {
        return '[ERR] Not valid parameters.';
      }

      if ( value[0] !== value[1] ) {
        return `${name} must be equal.`;
      }
      break;
  }
  return false;
}
