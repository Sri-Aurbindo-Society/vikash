import BaseService from "./base.service";

export default class DistrictService extends BaseService {
  response: any;
  districtRepository: any;
  districtModel: any;

  constructor(districtRepository, districtModel) {
    super();
    this.districtRepository = districtRepository;
    this.districtModel = districtModel;

    this.districtRepository.tableName = "DistrictMaster";
    this.districtRepository.procedureName = "spDistrictMaster";
    this.districtRepository.primaryKey = "DistrictID";
    this.districtRepository.ACTION = "INSERT";
  }

  async getAllAsync() {
    return await this.districtRepository.getAllRecords();
  }

  async getSingleAsync(id: string) {
    return await this.districtRepository.getRecordById(id);
  }

  async filterByStateID(param: any) {
    return await this.districtRepository.filterByStateID(param);
  }
}
