import express from "express";
import {
  projectCtrl,
  serviceCtrl,
  testimonialCtrl,
  contactCtrl,
  statCtrl,
  createContact,
} from "../condroller/contentController.js";
import { checkToken } from "../middleware/jwtmid.js";

const router = express.Router();

// Public
router.get("/projects", projectCtrl.getAll);
router.get("/services", serviceCtrl.getAll);
router.get("/testimonials", testimonialCtrl.getAll);
router.get("/stats", statCtrl.getAll);
router.post("/contacts", createContact);

// Protected CRUD — projects
router.post("/projects", checkToken, projectCtrl.create);
router.get("/projects/:id", checkToken, projectCtrl.getOne);
router.put("/projects/:id", checkToken, projectCtrl.update);
router.delete("/projects/:id", checkToken, projectCtrl.remove);

// services
router.post("/services", checkToken, serviceCtrl.create);
router.get("/services/:id", checkToken, serviceCtrl.getOne);
router.put("/services/:id", checkToken, serviceCtrl.update);
router.delete("/services/:id", checkToken, serviceCtrl.remove);

// testimonials
router.post("/testimonials", checkToken, testimonialCtrl.create);
router.get("/testimonials/:id", checkToken, testimonialCtrl.getOne);
router.put("/testimonials/:id", checkToken, testimonialCtrl.update);
router.delete("/testimonials/:id", checkToken, testimonialCtrl.remove);

// stats
router.post("/stats", checkToken, statCtrl.create);
router.get("/stats/:id", checkToken, statCtrl.getOne);
router.put("/stats/:id", checkToken, statCtrl.update);
router.delete("/stats/:id", checkToken, statCtrl.remove);

// contacts (admin)
router.get("/contacts", checkToken, contactCtrl.getAll);
router.get("/contacts/:id", checkToken, contactCtrl.getOne);
router.put("/contacts/:id", checkToken, contactCtrl.update);
router.delete("/contacts/:id", checkToken, contactCtrl.remove);

export default router;
