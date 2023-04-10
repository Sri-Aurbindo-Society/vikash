import BaseService from "./base.service";

export default class SchoolService extends BaseService {
  response: any;
  schoolRepository: any;
  schoolModel: any;

  constructor(schoolRepository, schoolModel) {
    super();
    this.schoolRepository = schoolRepository;
    this.schoolModel = schoolModel;

    this.schoolRepository.tableName = "SchoolMaster";
    this.schoolRepository.procedureName = "spSchoolMaster";
    this.schoolRepository.primaryKey = "SchoolID";
    this.schoolRepository.ACTION = "INSERT";
  }

  async getAllAsync() {
    return await this.schoolRepository.getAllRecords();
  }

  async getSingleAsync(id: string) {
    return await this.schoolRepository.getRecordById(id);
  }

  async filterByUdiseCode(param: any) {
    return await this.schoolRepository.filterByUdiseCode(param);
  }

  async filterByStateDistrict(param: any) {
    return await this.schoolRepository.filterByStateDistrict(param);
  }
}
