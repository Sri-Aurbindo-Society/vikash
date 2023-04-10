import { BaseModel } from "./base.model";

export default class LanguagesModel extends BaseModel {
  private _languageID: string = null;
  private _languageName: string = "";
  private _languageCode: string = "";

  constructor() {
    // Inherit super constructor
    super();
  }

  public get languageID() {
    return this._languageID;
  }
  public set languageID(__languageID: string) {
    this._languageID = __languageID;
  }
  public get languageName() {
    return this._languageName;
  }
  public set languageName(__languageName: string) {
    this._languageName = __languageName;
  }
  public get languageCode() {
    return this._languageCode;
  }
  public set languageCode(__languageCode: string) {
    this._languageCode = __languageCode;
  }
  public get createBy() {
    return this._createBy;
  }
  public set createBy(__createBy: string) {
    this._createBy = __createBy;
  }
}
