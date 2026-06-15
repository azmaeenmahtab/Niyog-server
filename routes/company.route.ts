import { Router } from 'express';
import { GetCompanyController, RegisterCompanyController } from "../controllers/companyController"
const router = Router();

router.post('/register-company', RegisterCompanyController);
router.get('/recruiter-company', GetCompanyController);

export default router;
