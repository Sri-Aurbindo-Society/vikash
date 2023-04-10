import { Response } from "express";
import { ApiResponse } from "../interface/apiResponse";
export default class ApplicationException extends Error {
  message: string = "An unexpected error ocurred.";

  constructor(message: string = "An unexpected error ocurred.") {
    super(message);

    this.message = message;
  }

  handleException(err: any, res: Response) {
    var data;

    if (err.success == false && err.status == "ERROR" && err.outMessage != "") {
      data = this.customErrorData(this.message, err.message, err);
    } else {
      //data = this.customErrorData(this.message, err.originalError.message, err);
      data = this.customErrorData(this.message, this.message, this.message);
    }
    res.status(400).send(data);
  }

  customErrorData(_message: string, _originalError: string, _err: string): any {
    var returnData = {
      code: 400,
      error: true,
      message: _message,
      originalError: _originalError,
      manualMessage: this.manualMessage(_originalError),
      err: _err,
    };

    return returnData;
  }

  manualMessage(errMessage: string): any {
    if (
      errMessage
        .toLocaleLowerCase()
        .includes("violation of primary key constraint")
    ) {
      return "Details already exists..!";
    } else if (
      errMessage
        .toLocaleLowerCase()
        .includes("violation of unique key constraint")
    ) {
      return "Details already exists..!";
    } else if (
      errMessage
        .toLocaleLowerCase()
        .includes("incorrect syntax near the keyword 'for'")
    ) {
      return "Update called, but ID not pass ..!";
    } else {
      return errMessage;
    }
  }
  handleResultOutput(result: any, action: string): any {
    if (result.recordsets.length == 0 && result.rowsAffected[0] == 1)
      return true;

    var outStatus = result.recordset[0].OutStatus;
    var outMessage = result.recordset[0].OutMessage;
    var lastID = result.recordset[0].LastID;

    // var sqlUserName = result.recordset[0].UserName;
    // var errorNumber = result.recordset[0].ErrorNumber;
    // var errorState = result.recordset[0].ErrorState;
    // var errorSeverity = result.recordset[0].ErrorSeverity;
    // var errorLine = result.recordset[0].ErrorLine;
    // var errorProcedure = result.recordset[0].ErrorProcedure;
    // var errorMessage = result.recordset[0].ErrorMessage;
    // var errorTable = result.recordset[0].ErrorTable;
    // var errorColumn = result.recordset[0].ErrorColumn;
    // var errorDescription = result.recordset[0].ErrorDescription;
    // var errorDateTime = result.recordset[0].ErrorDateTime;

    if (outStatus == "ERROR") {
      var errorID = result.recordset[0].ErrorID;
      let error: any = {
        code: errorID,
        message: outMessage,
        status: outStatus,
        success: false,
      };
      throw error;
    } else {
      let apiResponse: ApiResponse;
      return (apiResponse = {
        Status: "Success",
        Error: false,
        ErrorCode: "",
        Message: `Record has been ${action} successfully`,
        Result: lastID,
      });
      return lastID; //result.recordset[0].LastID;
    }
  }
}
