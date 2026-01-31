const { Op, literal, QueryTypes } = require('sequelize');
const { Sale, Route, sequelize } = require('../models');
const saleRepository = require('../repositories/sale.repository');

class AnalyticsService {
  constructor() {
    this.dimensionMap = {
      status: 'status',
      route: 'routeId',
      purpose: 'purpose'
    };
  }

  async getSalesStats(filters = {}, user, options = {}) {
    try {
      const where = this._buildWhereClause(filters, user);
      const { groupBy = 'month', distributionBy = 'status' } = options;

      const [summary, timeSeries, distribution, topRoutes] = await Promise.all([
        this._getSummaryData(where),
        this._getTimeSeriesData(where, groupBy),
        this._getDistributionData(where, distributionBy),
        this._getTopRoutesData(where)
      ]);

      return {
        totalAmount: summary.totalAmount,
        timeSeries: timeSeries,
        distribution: distribution,
        topRoutes: topRoutes,
        summary: {
          totalCount: summary.totalCount,
          uniqueRoutes: summary.uniqueRoutes,
          uniqueStatuses: summary.uniqueStatuses,
          averagePrice: summary.averagePrice,
          maxPrice: summary.maxPrice,
          minPrice: summary.minPrice
        }
      };
    } catch (error) {
      console.error('AnalyticsService error:', error);
      throw error;
    }
  }

  _buildWhereClause(filters = {}, user) {
    const where = {};
   
    if (filters.fromDate) {
      where.saleDate = { [Op.gte]: filters.fromDate };
    }
    if (filters.toDate) {
      where.saleDate = { ...where.saleDate, [Op.lte]: filters.toDate };
    }
    
    if (user && user.role !== 'admin') {
      where.createdBy = user.id;
    }

    return where;
  }

  async _getSummaryData(where) {
    try {
      const result = await Sale.findOne({
        attributes: [
          [sequelize.fn('COUNT', sequelize.col('*')), 'totalCount'],
          [sequelize.fn('SUM', sequelize.col('price')), 'totalAmount'],
          [sequelize.fn('AVG', sequelize.col('price')), 'averagePrice'],
          [sequelize.fn('MAX', sequelize.col('price')), 'maxPrice'],
          [sequelize.fn('MIN', sequelize.col('price')), 'minPrice'],
          [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('routeId'))), 'uniqueRoutes'],
          [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('status'))), 'uniqueStatuses']
        ],
        where,
        raw: true
      });

      return {
        totalCount: parseInt(result?.totalCount || 0),
        totalAmount: parseFloat(result?.totalAmount || 0),
        averagePrice: parseFloat(result?.averagePrice || 0),
        maxPrice: parseFloat(result?.maxPrice || 0),
        minPrice: parseFloat(result?.minPrice || 0),
        uniqueRoutes: parseInt(result?.uniqueRoutes || 0),
        uniqueStatuses: parseInt(result?.uniqueStatuses || 0)
      };
    } catch (error) {
      console.error('Error in _getSummaryData:', error);
      throw error;
    }
  }

  async _getTimeSeriesData(where, groupBy) {
    try {
      let format, interval;
      switch (groupBy) {
        case 'day':
          format = 'YYYY-MM-DD';
          interval = 'day';
          break;
        case 'week':
          format = 'YYYY-"W"WW';
          interval = 'week';
          break;
        case 'month':
        default:
          format = 'YYYY-MM';
          interval = 'month';
          break;
      }

      const query = `
        SELECT 
          TO_CHAR("saleDate", :format) as period,
          COUNT(*) as count,
          COALESCE(SUM(price), 0) as amount
        FROM sales
        ${Object.keys(where).length > 0 ? 'WHERE' : ''}
        ${where.saleDate && where.saleDate[Op.gte] ? `"saleDate" >= :fromDate` : ''}
        ${where.saleDate && where.saleDate[Op.lte] ? (where.saleDate[Op.gte] ? ' AND ' : '') + `"saleDate" <= :toDate` : ''}
        ${where.createdBy ? (where.saleDate ? ' AND ' : '') + `"createdBy" = :userId` : ''}
        GROUP BY TO_CHAR("saleDate", :format)
        ORDER BY period ASC
      `;

      const replacements = {
        format: format,
        ...(where.saleDate && where.saleDate[Op.gte] && { fromDate: where.saleDate[Op.gte] }),
        ...(where.saleDate && where.saleDate[Op.lte] && { toDate: where.saleDate[Op.lte] }),
        ...(where.createdBy && { userId: where.createdBy })
      };

      const results = await sequelize.query(query, {
        replacements: replacements,
        type: QueryTypes.SELECT
      });

      return results.map(item => ({
        period: item.period,
        count: parseInt(item.count || 0),
        amount: parseFloat(item.amount || 0)
      }));
    } catch (error) {
        console.error('Error in _getTimeSeriesData:', error);
        throw error;
    }
  }

    async _getDistributionData(where, dimension) {
        try {
            const dimensionField = this.dimensionMap[dimension] || 'status';
           
            if (dimension === 'route') {
            const query = `
                SELECT 
                r.name as key,
                COUNT(s.id) as count,
                COALESCE(SUM(s.price), 0) as amount
                FROM routes r
                LEFT JOIN sales s ON r.id = s."routeId"
                ${Object.keys(where).length > 0 ? 'WHERE' : ''}
                ${where.saleDate && where.saleDate[Op.gte] ? `s."saleDate" >= :fromDate` : ''}
                ${where.saleDate && where.saleDate[Op.lte] ? (where.saleDate[Op.gte] ? ' AND ' : '') + `s."saleDate" <= :toDate` : ''}
                ${where.createdBy ? ((where.saleDate ? ' AND ' : '') + `s."createdBy" = :userId`) : ''}
                GROUP BY r.id, r.name
                ORDER BY amount DESC
            `;

            const replacements = {
                ...(where.saleDate && where.saleDate[Op.gte] && { fromDate: where.saleDate[Op.gte] }),
                ...(where.saleDate && where.saleDate[Op.lte] && { toDate: where.saleDate[Op.lte] }),
                ...(where.createdBy && { userId: where.createdBy })
            };

            const results = await sequelize.query(query, {
                replacements: replacements,
                type: QueryTypes.SELECT
            });

            return results.map(item => ({
                key: item.key || 'Не указано',
                amount: parseFloat(item.amount || 0),
                count: parseInt(item.count || 0)
            }));
            }

            const results = await Sale.findAll({
            attributes: [
                dimensionField,
                [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
                [sequelize.fn('SUM', sequelize.col('Sale.price')), 'amount']
            ],
            where,
            group: [dimensionField],
            order: [[sequelize.fn('SUM', sequelize.col('Sale.price')), 'DESC']],
            raw: true
            });

            return results.map(item => ({
            key: item[dimensionField] || 'Не указано',
            amount: parseFloat(item.amount || 0),
            count: parseInt(item.count || 0)
            }));
        } catch (error) {
            console.error('Error in _getDistributionData:', error);
            throw error;
        }
    }

    async _getTopRoutesData(where, limit = 5) {
        try {
            const routeStats = await Sale.findAll({
            attributes: [
                'routeId',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
                [sequelize.fn('SUM', sequelize.col('Sale.price')), 'amount']
            ],
            where,
            group: ['routeId'],
            order: [[sequelize.fn('SUM', sequelize.col('Sale.price')), 'DESC']],
            limit: limit,
            raw: true
            });

            const routeIds = routeStats.map(stat => stat.routeId);
            const routes = await Route.findAll({
            where: { id: routeIds },
            attributes: ['id', 'name'],
            raw: true
            });

            const routesMap = {};
            routes.forEach(route => {
            routesMap[route.id] = route.name;
            });

            return routeStats.map((stat, index) => ({
            id: stat.routeId,
            name: routesMap[stat.routeId] || 'Неизвестный маршрут',
            rank: index + 1,
            count: parseInt(stat.count || 0),
            amount: parseFloat(stat.amount || 0)
            }));
        } catch (error) {
            console.error('Error in _getTopRoutesData:', error);
            throw error;
        }
    }
}

module.exports = new AnalyticsService();