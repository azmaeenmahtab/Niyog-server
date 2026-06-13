import { Router } from 'express';
import { jobPost } from '../controllers/jobPostController';

const router = Router();

router.post('/post-job', jobPost);

export default router;
