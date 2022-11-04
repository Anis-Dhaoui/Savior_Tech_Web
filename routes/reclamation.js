const express = require("express");

const {
  addReclamation,
  reclamationsByUser,
  traiterReclamation,
  reclamationById,
  getAllReclamations,
} = require("../controllers/reclamation");
const { requireSignin } = require("../controllers/auth");
const { userByUsername } = require("../controllers/user");

const router = express.Router();

router.post("/reclamation/add/:userName",  addReclamation);
router.get("/reclamation/get/:userName", reclamationsByUser);
router.put("/reclamation/approve/:userName/:reclamationId",requireSignin,traiterReclamation);
router.get("/reclamation/getall/:userName", requireSignin, getAllReclamations);
// any route containing username our app will first execute userByUsername()
router.param("userName", userByUsername);
router.param("reclamationId", reclamationById);

module.exports = router;
