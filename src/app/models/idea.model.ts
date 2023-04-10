import { BaseModel } from "./base.model";

export default class IdeaModel extends BaseModel {
  private _ideaID: string = null;
  private _title: string = "";
  private _description: string = "";
  private _link: string = "";
  private _strategy: string = "";
  private _objective: string = "";
  private _resources: string = "";
  private _implementDuration: string = "";
  private _step1Text: string = "";
  private _step1File: string = "";
  private _step2Text: string = "";
  private _step2File: string = "";
  private _step3Text: string = "";
  private _step3File: string = "";
  private _step4Text: string = "";
  private _step4File: string = "";

  constructor() {
    // Inherit super constructor
    super();
  }

  public get ideaID() {
    return this._ideaID;
  }
  public set ideaID(__ideaID: string) {
    this._ideaID = __ideaID;
  }
  public get title() {
    return this._title;
  }
  public set title(__title: string) {
    this._title = __title;
  }
  public get description() {
    return this._description;
  }
  public set description(__description: string) {
    this._description = __description;
  }
  public get link() {
    return this._link;
  }
  public set link(__link: string) {
    this._link = __link;
  }
  public get strategy() {
    return this._strategy;
  }
  public set strategy(__strategy: string) {
    this._strategy = __strategy;
  }
  public get objective() {
    return this._objective;
  }
  public set objective(__objective: string) {
    this._objective = __objective;
  }
  public get resources() {
    return this._resources;
  }
  public set resources(__resources: string) {
    this._resources = __resources;
  }
  public get implementDuration() {
    return this._implementDuration;
  }
  public set implementDuration(__implementDuration: string) {
    this._implementDuration = __implementDuration;
  }
  public get step1Text() {
    return this._step1Text;
  }
  public set step1Text(__step1Text: string) {
    this._step1Text = __step1Text;
  }
  public get step1File() {
    return this._step1File;
  }
  public set step1File(__step1File: string) {
    this._step1File = __step1File;
  }
  public get step2Text() {
    return this._step2Text;
  }
  public set step2Text(__step2Text: string) {
    this._step2Text = __step2Text;
  }
  public get step2File() {
    return this._step2File;
  }
  public set step2File(__step2File: string) {
    this._step2File = __step2File;
  }
  public get step3Text() {
    return this._step3Text;
  }
  public set step3Text(__step3Text: string) {
    this._step3Text = __step3Text;
  }
  public get step3File() {
    return this._step3File;
  }
  public set step3File(__step3File: string) {
    this._step3File = __step3File;
  }
  public get step4Text() {
    return this._step4Text;
  }
  public set step4Text(__step4Text: string) {
    this._step4Text = __step4Text;
  }
  public get step4File() {
    return this._step4File;
  }
  public set step4File(__step4File: string) {
    this._step4File = __step4File;
  }
  public get createBy() {
    return this._createBy;
  }
  public set createBy(__createBy: string) {
    this._createBy = __createBy;
  }
}
