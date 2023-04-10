import { asClass, InjectionMode, createContainer } from "awilix";

import App from "./app";
import AppConfig from "./configs/app.config";
import DBConfig from "./configs/db.config";
import Database from "./db/database";
import ApplicationException from "./Exceptions/application.exception";

// Models
import UsersModel from "./models/users.model";
import AdminModel from "./models/admin.model";
import SubjectGradeMappingModel from "./models/subjectGradeMapping.model";
import PageContentMasterModel from "./models/pageContentMaster.model";

// Repositories
import UsersRepository from "./repositories/users.repository";
import UsersService from "./services/users.services";

import DashboardRepository from "./repositories/dashboard.repository";
import DashboardService from "./services/dashboard.services";

import CommonRepository from "./repositories/common.repository";
import CommonService from "./services/common.service";

import AdminRepository from "./repositories/admin.repository";
import SubjectGradeMappingRepository from "./repositories/subjectGradeMapping.repository";
import PageContentMasterRepository from "./repositories/pageContentMaster.repository";

// Services
import LanguagesRepository from "./repositories/languages.repository";
import LanguagesService from "./services/languages.services";
import LanguagesModel from "./models/languages.model";
import IdeaRepository from "./repositories/idea.repository";
import IdeaService from "./services/idea.services";
import IdeaModel from "./models/idea.model";
import AdminService from "./services/admin.service";
import SubjectGradeMappingService from "./services/subjectGradeMapping.service";
import PageContentMasterService from "./services/pageContentMaster.service";
import PageRepository from "./repositories/page.repository";
import PageService from "./services/page.services";
import PageModel from "./models/page.model";
import SchoolRepository from "./repositories/school.repository";
import SchoolService from "./services/school.services";
import SchoolModel from "./models/school.model";
import DistrictRepository from "./repositories/district.repository";
import DistrictService from "./services/district.services";
import DistrictModel from "./models/district.model";

export default class Injector {
  instance: any;
  constructor() {
    this.instance = this._createContainer();
  }

  run(callback) {
    const app = this.instance.resolve("app");
    app.start(this.instance, callback);
  }

  _createContainer() {
    const container = createContainer({
      injectionMode: InjectionMode.CLASSIC,
    });

    container.register({
      app: asClass(App).singleton(),

      // Application Configuration
      appConfig: asClass(AppConfig).singleton(),

      // Database Configuration
      dbConfig: asClass(DBConfig).singleton(),

      // Database Object
      database: asClass(Database).singleton(),

      // Application Exception
      appException: asClass(ApplicationException).singleton(),

      // Repositories
      adminRepository: asClass(AdminRepository).singleton(),
      subjectGradeMappingRepository: asClass(
        SubjectGradeMappingRepository
      ).singleton(),
      pageContentMasterRepository: asClass(
        PageContentMasterRepository
      ).singleton(),
      commonRepository: asClass(CommonRepository).singleton(),
      usersRepository: asClass(UsersRepository).singleton(),
      dashboardRepository: asClass(DashboardRepository).singleton(),
      languagesRepository: asClass(LanguagesRepository).singleton(),
      ideaRepository: asClass(IdeaRepository).singleton(),
      pageRepository: asClass(PageRepository).singleton(),
      schoolRepository: asClass(SchoolRepository).singleton(),
      districtRepository: asClass(DistrictRepository).singleton(),

      // Services
      adminService: asClass(AdminService).singleton(),
      subjectGradeMappingService: asClass(
        SubjectGradeMappingService
      ).singleton(),
      pageContentMasterService: asClass(PageContentMasterService).singleton(),
      commonService: asClass(CommonService).singleton(),
      usersService: asClass(UsersService).singleton(),
      dashboardService: asClass(DashboardService).singleton(),
      languagesService: asClass(LanguagesService).singleton(),
      ideaService: asClass(IdeaService).singleton(),
      pageService: asClass(PageService).singleton(),
      schoolService: asClass(SchoolService).singleton(),
      districtService: asClass(DistrictService).singleton(),

      // Models
      adminModel: asClass(AdminModel).singleton(),
      subjectGradeMappingModel: asClass(SubjectGradeMappingModel).singleton(),
      pageContentMasterModel: asClass(PageContentMasterModel).singleton(),
      usersModel: asClass(UsersModel).singleton(),
      languagesModel: asClass(LanguagesModel).singleton(),
      ideaModel: asClass(IdeaModel).singleton(),
      pageModel: asClass(PageModel).singleton(),
      schoolModel: asClass(SchoolModel).singleton(),
      districtModel: asClass(DistrictModel).singleton(),
    });

    return container;
  }
}
