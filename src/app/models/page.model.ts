import { BaseModel } from "./base.model";

export default class PageModel extends BaseModel {
  private _pageID: string = null;
  private _pageName: string = "";
  private _pageType: string = "";
  private _description: string = "";

  constructor() {
    // Inherit super constructor
    super();
  }

  public get pageID() {
    return this._pageID;
  }
  public set pageID(__pageID: string) {
    this._pageID = __pageID;
  }
  public get pageName() {
    return this._pageName;
  }
  public set pageName(__pageName: string) {
    this._pageName = __pageName;
  }
  public get pageType() {
    return this._pageType;
  }
  public set pageType(__pageType: string) {
    this._pageType = __pageType;
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
