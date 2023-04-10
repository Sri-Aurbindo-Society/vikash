import { BaseModel } from "./base.model";

export default class AdminModel extends BaseModel {
  private _adminID: string = null;
  private _username: string = "";
  private _name: string = "";
  private _email: string = "";
  private _password: string = "";
  private _adminRoleID: string = "";
  private _mobile: string = "";
  private _profilePic: string = "";

  constructor() {
    // Inherit super constructor
    super();
  }

  public get adminID() {
    return this._adminID;
  }
  public set adminID(__adminID: string) {
    this._adminID = __adminID;
  }
  public get username() {
    return this._username;
  }
  public set username(__username: string) {
    this._username = __username;
  }
  public get name() {
    return this._name;
  }
  public set name(__name: string) {
    this._name = __name;
  }
  public get email() {
    return this._email;
  }
  public set email(__email: string) {
    this._email = __email;
  }
  public get password() {
    return this._password;
  }
  public set password(__password: string) {
    this._password = __password;
  }

  public get adminRoleID() {
    return this._adminRoleID;
  }
  public set adminRoleID(__adminRoleID: string) {
    this._adminRoleID = __adminRoleID;
  }

  public get mobile() {
    return this._mobile;
  }
  public set mobile(__mobile: string) {
    this._mobile = __mobile;
  }

  public get profilePic() {
    return this._profilePic;
  }
  public set profilePic(__profilePic: string) {
    this._profilePic = __profilePic;
  }

  public get createBy() {
    return this._createBy;
  }
  public set createBy(__createBy: string) {
    this._createBy = __createBy;
  }
}
