const { Op } = require('sequelize');
const History = require('../entities/History');

class HistoryService {
    async createHistoryRecord(data) {
        try {
            return await History.create(data);
        } catch (error) {
            console.error('Error creating history record:', error);
            throw error;
        }
    }

    async getHistory({ shop_id, plu, dateFrom, dateTo, action, page = 1, limit = 10 }) {
        try {
            const whereClause = {};

            if (shop_id) {
                whereClause.shop_id = shop_id;
            }

            if (plu) {
                whereClause.plu = plu;
            }

            if (action) {
                whereClause.action = action;
            }

            if (dateFrom || dateTo) {
                whereClause.timestamp = {};
                if (dateFrom) {
                    whereClause.timestamp[Op.gte] = new Date(dateFrom);
                }
                if (dateTo) {
                    whereClause.timestamp[Op.lte] = new Date(dateTo);
                }
            }

            const offset = (page - 1) * limit;

            const { count, rows } = await History.findAndCountAll({
                where: whereClause,
                limit,
                offset,
                order: [['timestamp', 'DESC']]
            });

            return {
                items: rows,
                pagination: {
                    total: count,
                    page,
                    pages: Math.ceil(count / limit),
                    limit
                }
            };
        } catch (error) {
            console.error('Error fetching history:', error);
            throw error;
        }
    }
}

module.exports = new HistoryService();