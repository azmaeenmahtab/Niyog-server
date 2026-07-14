import { Router } from 'express';
import { jobPost } from '../controllers/jobPostController';
import { validateToken } from '../middlewares/verifyJWTToken';

const router = Router();

router.post('/post-job', validateToken, jobPost);

export default router;
