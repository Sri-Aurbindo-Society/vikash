import { Idea } from "../interface/idea";
import ideaRule from "../validations/idea.rule";
import BaseService from "./base.service";
import Validator from "validatorjs";

export default class IdeaService extends BaseService {
  response: any;
  ideaRepository: any;
  ideaModel: any;

  constructor(ideaRepository, ideaModel) {
    super();
    this.ideaRepository = ideaRepository;
    this.ideaModel = ideaModel;

    this.ideaRepository.tableName = "IdeaMaster";
    this.ideaRepository.procedureName = "spIdeaMaster";
    this.ideaRepository.primaryKey = "IdeaID";
    this.ideaRepository.ACTION = "INSERT";
  }

  async getAllAsync() {
    return await this.ideaRepository.getAllRecords();
  }

  async getIdeaList() {
    return await this.ideaRepository.getIdeaList();
  }

  async getSingleAsync(id: string) {
    return await this.ideaRepository.getRecordById(id);
  }

  async addNew(data: Idea): Promise<boolean> {
    let validation = new Validator(data, ideaRule);

    if (validation.passes()) {
      this.ideaModel.ideaID = data.ID;
      this.ideaModel.title = data.Title;
      this.ideaModel.description = data.Description;
      this.ideaModel.link = data.Link;
      this.ideaModel.createBy =
        "0x6730ADA6BEA6FA8C20764A11FD19E6C3A576C635BD4D3AC2D1009C621FDC1B65";

      return this.ideaRepository.createRecord(this.ideaModel);
    } else {
      return validation.errors;
    }
  }

  async update(data: Idea): Promise<boolean> {
    this.ideaModel.ideaID = data.ID;
    this.ideaModel.title = data.Title;
    this.ideaModel.description = data.Description;
    this.ideaModel.link = data.Link;
    this.ideaModel.createBy =
      "0x6730ADA6BEA6FA8C20764A11FD19E6C3A576C635BD4D3AC2D1009C621FDC1B65";

    return this.ideaRepository.updateRecord(data.ID, this.ideaModel);
  }

  async delete(id: string) {
    return await this.ideaRepository.delete(id);
  }

  async activate(id: string) {
    return await this.ideaRepository.activate(id);
  }

  async deactivate(id: string) {
    return await this.ideaRepository.deactivate(id);
  }
}
