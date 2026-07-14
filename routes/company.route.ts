import { Router } from 'express';
import { GetCompanyController, RegisterCompanyController, getAllCompanies , updateCompanyStatusController, deleteCompanyController} from "../controllers/companyController"
import { validateToken } from '../middlewares/verifyJWTToken';
const router = Router();

router.post('/register-company', validateToken, RegisterCompanyController);
router.get('/recruiter-company', validateToken, GetCompanyController);
router.get('/admin/company/all', validateToken, getAllCompanies);
router.patch('/admin/company/update/status/:id', validateToken, updateCompanyStatusController);
router.delete('/admin/company/delete/:id', validateToken, deleteCompanyController);

export default router;
