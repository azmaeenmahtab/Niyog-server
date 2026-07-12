import { Router } from 'express';
import { GetCompanyController, RegisterCompanyController, getAllCompanies , updateCompanyStatusController, deleteCompanyController} from "../controllers/companyController"
const router = Router();

router.post('/register-company', RegisterCompanyController);
router.get('/recruiter-company', GetCompanyController);
router.get('/admin/company/all', getAllCompanies);
router.patch('/admin/company/update/status/:id', updateCompanyStatusController);
router.delete('/admin/company/delete/:id', deleteCompanyController);

export default router;
