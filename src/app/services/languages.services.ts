import BaseService from "./base.service";

export default class LanguagesService extends BaseService {
  response: any;
  languagesRepository: any;
  languagesModel: any;

  constructor(languagesRepository, languagesModel) {
    super();
    this.languagesRepository = languagesRepository;
    this.languagesModel = languagesModel;

    this.languagesRepository.tableName = "LanguageMaster";
    this.languagesRepository.procedureName = "spLanguageMaster";
    this.languagesRepository.primaryKey = "LanguageID";
    this.languagesRepository.ACTION = "INSERT";
  }

  async getAllAsync() {
    return await this.languagesRepository.getAllRecords();
  }

  async getSingleAsync(id: string) {
    return await this.languagesRepository.getRecordById(id);
  }
}
