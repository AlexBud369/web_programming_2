const { Op } = require('sequelize');

class BaseController {
    constructor(model) {
        this.model = model;
        this.searchFields = this.model.searchFields || ['title', 'name', 'description'];
        this.fieldMapping = {
            'createdAt': 'created_at',
            'updatedAt': 'updated_at',
            'startDate': 'start_date',
            'endDate': 'end_date',
            'passwordHash': 'password_hash'
        };
    }

    getAll = async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            let sortBy = req.query.sortBy || 'created_at'; 
            const sortOrder = req.query.sortOrder || 'ASC';
            const search = req.query.search || '';

            if (this.fieldMapping[sortBy]) {
                sortBy = this.fieldMapping[sortBy];
            }

            const offset = (page - 1) * limit;
            const where = {};

            const filterFields = ['page', 'limit', 'sortBy', 'sortOrder', 'search'];
            Object.keys(req.query).forEach(key => {
                if (!filterFields.includes(key) && req.query[key] !== '') {
                    const fieldName = this.fieldMapping[key] || key;
                    where[fieldName] = req.query[key];
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
            console.error('Ошибка в getAll:', error.message);
            res.status(500).json({ 
                success: false, 
                error: 'Ошибка при получении данных',
                details: error.message 
            });
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