const { Router } = require('express');
const historyController = require('../controllers/historyController');

const router = Router();

// POST /api/history - создание записи в истории
router.post('/', (req, res) => historyController.createHistoryRecord(req, res));

// GET /api/history - получение истории с фильтрами и пагинацией
router.get('/', (req, res) => historyController.getHistory(req, res));

module.exports = router;