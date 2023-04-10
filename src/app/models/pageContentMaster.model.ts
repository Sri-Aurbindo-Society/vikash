import { BaseModel } from "./base.model";

export default class PageContentMasterModel extends BaseModel {
  private _pageContentID: string = null;
  private _pageID: string = "";
  private _pageContentTitle: string = "";
  private _shortDescription: string = "";
  private _description: string = "";

  constructor() {
    // Inherit super constructor
    super();
  }
  public get pageContentID() {
    return this._pageContentID;
  }
  public set pageContentID(__pageContentID: string) {
    this._pageContentID = __pageContentID;
  }
  public get pageID() {
    return this._pageID;
  }
  public set pageID(__pageID: string) {
    this._pageID = __pageID;
  }
  public get pageContentTitle() {
    return this._pageContentTitle;
  }
  public set pageContentTitle(__pageContentTitle: string) {
    this._pageContentTitle = __pageContentTitle;
  }
  public get shortDescription() {
    return this._shortDescription;
  }
  public set shortDescription(__shortDescription: string) {
    this._shortDescription = __shortDescription;
  }
  public get description() {
    return this._description;
  }
  public set description(__description: string) {
    this._description = __description;
  }
  public get createBy() {
    return this._createBy;
  }
  public set createBy(__createBy: string) {
    this._createBy = __createBy;
  }
}
