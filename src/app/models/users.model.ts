import { BaseModel } from "./base.model";

export default class UsersModel extends BaseModel {
	private _userID: string = null;
	private _username: string = "";
	private _password: string = "";
	private _name: string = "";
	private _contact: string = "";
	private _email: string = "";
	private _dob: string = "";
	private _department: string = "";
	private _gender: string = "";
	private _role: string = "";
	private _autoAuthorizationStatus: string = "";
	private _profilePic: string = "";
	private _otp: string = "";
	private _schoolID: string = "";
	private _gradeID: string = "";
	private _subjectID: string = "";
	private _stateID: string = "";
	private _udiseCode: string = "";
	private _boardID: string = "";

	constructor() {
		// Inherit super constructor
		super();
	}

	public get userID() {
		return this._userID;
	}
	public set userID(__userID: string) {
		this._userID = __userID;
	}
	public get username() {
		return this._username;
	}
	public set username(__username: string) {
		this._username = __username;
	}
	public get password() {
		return this._password;
	}
	public set password(__password: string) {
		this._password = __password;
	}
	public get name() {
		return this._name;
	}
	public set name(__name: string) {
		this._name = __name;
	}
	public get contact() {
		return this._contact;
	}
	public set contact(__contact: string) {
		this._contact = __contact;
	}
	public get email() {
		return this._email;
	}
	public set email(__email: string) {
		this._email = __email;
	}
	public get dob() {
		return this._dob;
	}
	public set dob(__dob: string) {
		this._dob = __dob;
	}
	public get department() {
		return this._department;
	}
	public set department(__department: string) {
		this._department = __department;
	}
	public get gender() {
		return this._gender;
	}
	public set gender(__gender: string) {
		this._gender = __gender;
	}
	public get role() {
		return this._role;
	}
	public set role(__role: string) {
		this._role = __role;
	}
	public get autoAuthorizationStatus() {
		return this._autoAuthorizationStatus;
	}
	public set autoAuthorizationStatus(__autoAuthorizationStatus: string) {
		this._autoAuthorizationStatus = __autoAuthorizationStatus;
	}
	public get profilePic() {
		return this._profilePic;
	}
	public set profilePic(__profilePic: string) {
		this._profilePic = __profilePic;
	}
	public get otp() {
		return this._otp;
	}
	public set otp(__otp: string) {
		this._otp = __otp;
	}
	public get schoolID() {
		return this._schoolID;
	}
	public set schoolID(__schoolID: string) {
		this._schoolID = __schoolID;
	}
	public get gradeID() {
		return this._gradeID;
	}
	public set gradeID(__gradeID: string) {
		this._gradeID = __gradeID;
	}
	public get subjectID() {
		return this._subjectID;
	}
	public set subjectID(__subjectID: string) {
		this._subjectID = __subjectID;
	}
	public get stateID() {
		return this._stateID;
	}
	public set stateID(__stateID: string) {
		this._stateID = __stateID;
	}
	public get boardID() {
		return this._boardID;
	}
	public set boardID(__boardID: string) {
		this._boardID = __boardID;
	}
	public get udiseCode() {
		return this._udiseCode;
	}
	public set udiseCode(__udiseCode: string) {
		this._udiseCode = __udiseCode;
	}
	public get createBy() {
		return this._createBy;
	}
	public set createBy(__createBy: string) {
		this._createBy = __createBy;
	}
}
