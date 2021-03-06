const express = require ("express");
const router = express.Router ();

const mainController = require ("../controllers/mainController");

router.get ("/", mainController.raiz);
router.get ("/index",mainController.index);
router.get ("/nosotros",mainController.nosotros);

//SEARCH
router.post ("/search", mainController.searchProduct);


module.exports = router;
