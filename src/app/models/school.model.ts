import { BaseModel } from "./base.model";

export default class SchoolModel extends BaseModel {
  private _schoolID: string = null;
  private _schoolName: string = "";
  private _uDiseCode: string = "";
  private _schoolTypeID: string = "";
  private _countryID: string = "";
  private _stateID: string = "";
  private _districtID: string = "";
  private _blockID: string = "";
  private _clusterID: string = "";
  private _villageID: string = "";
  private _address: string = "";
  private _pinCode: string = "";

  constructor() {
    // Inherit super constructor
    super();
  }

  public get schoolID() {
    return this._schoolID;
  }
  public set schoolID(__schoolID: string) {
    this._schoolID = __schoolID;
  }
  public get schoolName() {
    return this._schoolName;
  }
  public set schoolName(__schoolName: string) {
    this._schoolName = __schoolName;
  }
  public get uDiseCode() {
    return this._uDiseCode;
  }
  public set uDiseCode(__uDiseCode: string) {
    this._uDiseCode = __uDiseCode;
  }
  public get schoolTypeID() {
    return this._schoolTypeID;
  }
  public set schoolTypeID(__schoolTypeID: string) {
    this._schoolTypeID = __schoolTypeID;
  }
  public get countryID() {
    return this._countryID;
  }
  public set countryID(__countryID: string) {
    this._countryID = __countryID;
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
  public get blockID() {
    return this._blockID;
  }
  public set blockID(__blockID: string) {
    this._blockID = __blockID;
  }
  public get clusterID() {
    return this._clusterID;
  }
  public set clusterID(__clusterID: string) {
    this._clusterID = __clusterID;
  }
  public get villageID() {
    return this._villageID;
  }
  public set villageID(__villageID: string) {
    this._villageID = __villageID;
  }
  public get address() {
    return this._address;
  }
  public set address(__address: string) {
    this._address = __address;
  }
  public get pinCode() {
    return this._pinCode;
  }
  public set pinCode(__pinCode: string) {
    this._pinCode = __pinCode;
  }
  public get createBy() {
    return this._createBy;
  }
  public set createBy(__createBy: string) {
    this._createBy = __createBy;
  }
}
