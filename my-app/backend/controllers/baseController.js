const { Op } = require('sequelize');

class BaseController {
    constructor(model) {
        this.model = model;
        this.searchFields = this.model.searchFields || ['title', 'name', 'description'];
    }

    getAll = async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const sortBy = req.query.sortBy || 'createdAt';
            const sortOrder = req.query.sortOrder || 'ASC';
            const search = req.query.search || '';

            const offset = (page - 1) * limit;
            const where = {};

            const filterFields = ['page', 'limit', 'sortBy', 'sortOrder', 'search'];
            Object.keys(req.query).forEach(key => {
                if (!filterFields.includes(key) && req.query[key] !== '') {
                    where[key] = req.query[key];
                }
            });

            if (search) {
                const searchConditions = this.searchFields.map(field => ({
                    [field]: { [Op.iLike]: `%${search}%` } 
                }));
                where[Op.and] = [
                ...(where[Op.and] || []),
                { [Op.or]: searchConditions }
                ];
            }

            const { count, rows } = await this.model.findAndCountAll({
                where,
                order: [[sortBy, sortOrder]],
                limit,
                offset,
            });

            res.json({
                success: true,
                data: rows,
                pagination: {
                totalItems: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                itemsPerPage: limit
                }
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Ошибка при получении данных' });
        }
    };

   getById = async (req, res) => {
        try {
            const record = await this.model.findByPk(req.params.id);
            
            if (!record) {
                return res.status(404).json({
                    success: false,
                    error: 'Запись не найдена'
                });
            }
            
            res.json({
                success: true,
                data: record
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    };

    exists = async (req, res) => {
        try {
            const record = await this.model.findByPk(req.params.id);
            res.json({
                success: true,
                exists: !!record
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    };

  create = async (req, res) => {
    try {
      const record = await this.model.create(req.body);
      
      res.status(201).json({
        success: true,
        data: record
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  update = async (req, res) => {
    try {
      const record = await this.model.findByPk(req.params.id);
      
      if (!record) {
        return res.status(404).json({
          success: false,
          error: 'Запись не найдена'
        });
      }
      
      await record.update(req.body);
      res.json({
        success: true,
        data: record
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  delete = async (req, res) => {
    try {
      const record = await this.model.findByPk(req.params.id);
      
      if (!record) {
        return res.status(404).json({
          success: false,
          error: 'Запись не найдена'
        });
      }
      
      await record.destroy();
      res.json({
        success: true,
        message: 'Запись успешно удалена'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };
}

module.exports = BaseController;