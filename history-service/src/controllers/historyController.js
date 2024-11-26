const historyService = require('../services/historyService');

class HistoryController {
    async createHistoryRecord(req, res) {
        try {
            const record = await historyService.createHistoryRecord(req.body);
            res.status(201).json(record);
        } catch (error) {
            res.status(400).json({
                message: 'Failed to create history record',
                error: error.message
            });
        }
    }

    async getHistory(req, res) {
        try {
            const filters = {
                shop_id: req.query.shop_id ? parseInt(req.query.shop_id) : undefined,
                plu: req.query.plu,
                dateFrom: req.query.date_from,
                dateTo: req.query.date_to,
                action: req.query.action,
                page: req.query.page ? parseInt(req.query.page) : 1,
                limit: req.query.limit ? parseInt(req.query.limit) : 10
            };

            const history = await historyService.getHistory(filters);
            res.json(history);
        } catch (error) {
            res.status(400).json({
                message: 'Failed to fetch history',
                error: error.message
            });
        }
    }
}

module.exports = new HistoryController();