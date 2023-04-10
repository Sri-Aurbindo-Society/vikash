import BaseService from "./base.service";
import Validator from "validatorjs";

export default class DashboardService extends BaseService {
  dashboardRepository: any;

  constructor(dashboardRepository) {
    super();
    this.dashboardRepository = dashboardRepository;
  }
}
