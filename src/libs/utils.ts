import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { extname } from 'path';
import * as IGateway from '../gateways/interfaces';

/**
 * @description Check Memory Info
 * @public
 * @param {string} memName
 * @returns {void}
 */
export function memInfo(memName: string): void {
  Logger.log(
    `Function ${memName} used memory: ${Math.round(
      (process.memoryUsage().heapUsed / 1024 / 1024) * 100,
    ) / 100} MB`,
    'Memory-Info',
    true,
  );
}

/**
 * @description Check if is Json string
 * @public
 * @param {string} str
 * @returns {boolean}
 */
export function isJsonString(str: string): boolean {
  try {
    const json = JSON.parse(str);
    return typeof json === 'object';
  } catch (error) {
    return false;
  }
}

/**
 * @description Add Month by Date
 * @public
 * @param {Date} date
 * @param {number} months
 * @returns {Date}
 */
export function addMonths(date: Date, months: number) {
  const d = date.getDate();
  date.setMonth(date.getMonth() + +months);
  if (date.getDate() !== d) {
    date.setDate(0);
  }
  return date;
}

/**
 * @description Check if is empty object
 * @public
 * @param {{ [key: string]: any; }} obj
 * @returns {boolean}
 */
export function isEmptyObj(obj: { [key: string]: any }): boolean {
  for (const property in obj) {
    // following es-lint rule no-prototype-builtins, do not access object prototype directly
    if (Object.prototype.hasOwnProperty.call(obj, property)) return false;
  }
  return true;
}

export function isImageFilter(req, file, cb) {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/))
    return cb(new Error('Not Allowed File'), false);
  cb(null, true);
}

export function editFileName(req, file, cb) {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  cb(null, `${name}-${randomName}${fileExtName}`);
}

export function formatErrorMessage(
  errorMsg: string,
): IGateway.IErrorStruct | null {
  const errorMsgStr: string = errorMsg.split('-')[1];
  if (!errorMsgStr) return null;
  errorMsgStr.replace(/\/\n/gi, '');
  return isJsonString(errorMsgStr) ? JSON.parse(errorMsgStr) : null;
}

export function ExceptionHandler(error: Error): void {
  const errorStruct: IGateway.IErrorStruct = formatErrorMessage(error.message);
  if (!errorStruct) {
    throw new HttpException(
      {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
  throw new HttpException(
    {
      status: errorStruct.statusCode,
      error: errorStruct.message || errorStruct.error,
    },
    errorStruct.statusCode,
  );
}
