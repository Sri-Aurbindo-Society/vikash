import BaseService from "./base.service";
import Validator from "validatorjs";
import bcryptjs from "bcryptjs";
import JWTHelper from "../helpers/jwt.helper";
import emailvalidator from "email-validator";
import { Admin } from "../interface/admin";
import adminRegistrationRule from "../validations/adminRegistration.rule";
import adminLogInRule from "../validations/adminLogIn.rule";
import axios from "axios";
import adminForgotPasswordRule from "../validations/adminForgotPassword.rule";

export default class SubjectGradeMappingService extends BaseService {
  response: any;
  subjectGradeMappingRepository: any;
  subjectGradeMappingModel: any;
  JWTHelper: any;

  constructor(subjectGradeMappingRepository, subjectGradeMappingModel) {
    super();
    this.subjectGradeMappingRepository = subjectGradeMappingRepository;
    this.subjectGradeMappingModel = subjectGradeMappingModel;
    this.JWTHelper = new JWTHelper();

    this.subjectGradeMappingRepository.tableName = "subjectGradeMapping";
    this.subjectGradeMappingRepository.procedureName = "spsubjectGradeMapping";
    this.subjectGradeMappingRepository.primaryKey = "subjectGradeMappingID";
    this.subjectGradeMappingRepository.ACTION = "INSERT";
  }

  async getAllAsync() {
    return await this.subjectGradeMappingRepository.getAllRecords();
  }
  async getSingleAsync(id: string) {
    return await this.subjectGradeMappingRepository.getRecordById(id);
  }

  // get subject by gradeID
  async subjectByGradeID(gradeID): Promise<any> {
    return this.subjectGradeMappingRepository
      .subjectByGradeID(gradeID)
      .then(async (result) => {
        return result;
      });
  }
}
