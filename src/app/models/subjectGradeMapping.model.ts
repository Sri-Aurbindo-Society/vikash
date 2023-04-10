import { BaseModel } from "./base.model";

export default class SubjectGradeMappingModel extends BaseModel {
  private _subjectGradeMappingID: string = null;
  private _subjectID: string = "";
  private _gradeID: string = "";

  constructor() {
    // Inherit super constructor
    super();
  }

  public get subjectGradeMappingID() {
    return this._subjectGradeMappingID;
  }
  public set subjectGradeMappingID(__subjectGradeMappingID: string) {
    this._subjectGradeMappingID = __subjectGradeMappingID;
  }
  public get subjectID() {
    return this._subjectID;
  }
  public set subjectID(__subjectID: string) {
    this._subjectID = __subjectID;
  }
  public get gradeID() {
    return this._gradeID;
  }
  public set gradeID(__gradeID: string) {
    this._gradeID = __gradeID;
  }

  public get createBy() {
    return this._createBy;
  }
  public set createBy(__createBy: string) {
    this._createBy = __createBy;
  }
}
