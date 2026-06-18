import { Router, type IRouter } from "express";
import healthRouter from "./health";
import studentsRouter from "./students";
import lessonsRouter from "./lessons";
import wordsRouter from "./words";
import progressRouter from "./progress";
import aiRouter from "./ai";
import favoritesRouter from "./favorites";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(studentsRouter);
router.use(lessonsRouter);
router.use(wordsRouter);
router.use(progressRouter);
router.use(aiRouter);
router.use(favoritesRouter);
router.use(adminRouter);

export default router;
