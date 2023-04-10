import BaseService from "./base.service";
import Validator from "validatorjs";
import emailvalidator from "email-validator";

export default class CommonService extends BaseService {
	response: any;
	commonRepository: any;

	constructor(commonRepository) {
		super();
		this.commonRepository = commonRepository;
	}

	// Get all schools
	async getAllSchools() {
		return await this.commonRepository.getAllSchools();
	}

	// Get all schools
	async getSchools(keyword: any) {
		return await this.commonRepository.getAllSchools(
			keyword.trim()
		);
	}

	// Get all states
	async getAllStates() {
		return await this.commonRepository.getAllStates();
	}

	// Get all districts
	async getAllDistricts() {
		return await this.commonRepository.getAllDistricts();
	}

	// Get all blocks
	async getAllBlocks() {
		return await this.commonRepository.getAllBlocks();
	}

	// Get all clusters
	async getAllClusters() {
		return await this.commonRepository.getAllClusters();
	}

	// Get all boards
	async getAllBoards() {
		return await this.commonRepository.getAllBoards();
	}

	// Get all grades
	async getAllGrades() {
		return await this.commonRepository.getAllGrades();
	}

	// Get all subjects
	async getAllSubjects() {
		return await this.commonRepository.getAllSubjects();
	}
}
