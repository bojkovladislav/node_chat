import ApiError from '../exceptions/api.error.js';

export function checkDefaultParams(params) {
  const arrayFromParams = Object.entries(params);

  if (arrayFromParams.length === 1 && arrayFromParams[0][1] === undefined) {
    console.log('yes');
    throw ApiError.badRequest(`You need to provide ${arrayFromParams[0][0]}!`);
  }

  const absentParams = arrayFromParams
    .filter((param) => param[1] === undefined)
    .map((param) => ' ' + param[0]);

  if (absentParams.length) {
    throw ApiError.badRequest(
      `You need to provide the following params:${[...absentParams]}`
    );
  }
}
