import { Router } from 'express';
import { GetAllCompaniesController, RegisterCompanyController } from "../controllers/companyController"
const router = Router();

router.post('/register-company', RegisterCompanyController);
router.get('/all-companies', GetAllCompaniesController);

export default router;
