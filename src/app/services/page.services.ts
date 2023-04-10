import BaseService from "./base.service";
import Validator from "validatorjs";
import { Page } from "../interface/page";
import pageRule from "../validations/page.rule";

export default class PageService extends BaseService {
  response: any;
  pageRepository: any;
  pageModel: any;

  constructor(pageRepository, pageModel) {
    super();
    this.pageRepository = pageRepository;
    this.pageModel = pageModel;

    this.pageRepository.tableName = "PageMaster";
    this.pageRepository.procedureName = "spPageMaster";
    this.pageRepository.primaryKey = "PageID";
    this.pageRepository.ACTION = "INSERT";
  }

  async getAllAsync() {
    return await this.pageRepository.getAllRecords();
  }

  async getSingleAsync(id: string) {
    return await this.pageRepository.getRecordById(id);
  }

  async getTIAImages() {
    return await this.pageRepository.getTIAImages();
  }

  async validatePageCreate(data: Page): Promise<any> {
    let validation = new Validator(data, pageRule);
    if (validation.passes()) {
      this.pageModel.pageName = data.PageName;
      this.pageModel.pageType = data.PageType;
      this.pageModel.description = data.Description;
      this.pageModel.createBy = data.CreateBy;
      return this.pageRepository
        .createRecord(this.pageModel)
        .then(async (result) => {
          return result;
        });
    } else {
      return validation.errors;
    }
  }

  async validatePageUpdate(data: Page): Promise<any> {
    let validation = new Validator(data, pageRule);
    if (validation.passes()) {
      this.pageModel.pageID = data.ID;
      this.pageModel.pageName = data.PageName;
      this.pageModel.pageType = data.PageType;
      this.pageModel.description = data.Description;
      this.pageModel.createBy = data.CreateBy;
      return this.pageRepository
        .updateRecord(data.ID, this.pageModel)
        .then(async (result) => {
          return result;
        });
    } else {
      return validation.errors;
    }
  }

  async delete(id: string) {
    return await this.pageRepository.delete(id);
  }
  async activate(id: string) {
    return await this.pageRepository.activate(id);
  }
  async deactivate(id: string) {
    return await this.pageRepository.deactivate(id);
  }
}
