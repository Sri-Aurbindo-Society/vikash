export default class BaseService {
  constructor() {}

  // common function to conver buffer keys into hash
  __convert_hash(key): string {
    let hashKey: any;
    if (key != null) {
      hashKey = "0x" + Buffer.from(key).toString("hex").toUpperCase();
    } else {
      hashKey = null;
    }
    return hashKey;
  }

  getFirstError(validationErrors: any): any {
    var errors = Object.values(validationErrors)[0];
    errors = Object.values(errors)[0];
    return {
      count: validationErrors.length,
      message: errors[0],
    };
  }
}
