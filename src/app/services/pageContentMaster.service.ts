import BaseService from "./base.service";
import Validator from "validatorjs";
import bcryptjs from "bcryptjs";
import JWTHelper from "../helpers/jwt.helper";
import emailvalidator from "email-validator";
import axios from "axios";

export default class PageContentMasterService extends BaseService {
  response: any;
  pageContentMasterRepository: any;
  pageContentMasterModel: any;
  JWTHelper: any;

  constructor(pageContentMasterRepository, pageMasterModel) {
    super();
    this.pageContentMasterRepository = pageContentMasterRepository;
    this.pageContentMasterModel = pageMasterModel;
    this.JWTHelper = new JWTHelper();

    this.pageContentMasterRepository.tableName = "pageContentMaster";
    this.pageContentMasterRepository.procedureName = "sppageContentMaster";
    this.pageContentMasterRepository.primaryKey = "pageContentID";
    this.pageContentMasterRepository.ACTION = "INSERT";
  }

  async getAllAsync() {
    return await this.pageContentMasterRepository.getAllRecords();
  }
  async getSingleAsync(id: string) {
    return await this.pageContentMasterRepository.getRecordById(id);
  }

  //   // get subject by gradeID
  //   async subjectByGradeID(gradeID): Promise<any> {
  //     return this.subjectGradeMappingRepository
  //       .subjectByGradeID(gradeID)
  //       .then(async (result) => {
  //         return result;
  //       });
  //   }
}
