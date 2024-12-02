const express = require("express");
const { getAddressTransactions } = require("../controllers/transactionsController.js");
const requireAuth = require("../middleware/requireAuth.js");

const router = express.Router();

router.use(requireAuth);

// GET /api/transactions/:address
router.get("/:address", getAddressTransactions);

module.exports = router;
