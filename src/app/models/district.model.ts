import { BaseModel } from "./base.model";

export default class DistrictModel extends BaseModel {
  private _districtID: string = null;
  private _stateID: string = "";
  private _districtName: string = "";
  private _districtCode: string = "";
  private _nativeLanguageName: string = "";

  constructor() {
    // Inherit super constructor
    super();
  }

  public get districtName() {
    return this._districtName;
  }
  public set districtName(__districtName: string) {
    this._districtName = __districtName;
  }
  public get districtCode() {
    return this._districtCode;
  }
  public set districtCode(__districtCode: string) {
    this._districtCode = __districtCode;
  }
  public get nativeLanguageName() {
    return this._nativeLanguageName;
  }
  public set nativeLanguageName(__nativeLanguageName: string) {
    this._nativeLanguageName = __nativeLanguageName;
  }
  public get stateID() {
    return this._stateID;
  }
  public set stateID(__stateID: string) {
    this._stateID = __stateID;
  }
  public get districtID() {
    return this._districtID;
  }
  public set districtID(__districtID: string) {
    this._districtID = __districtID;
  }
  public get createBy() {
    return this._createBy;
  }
  public set createBy(__createBy: string) {
    this._createBy = __createBy;
  }
}
