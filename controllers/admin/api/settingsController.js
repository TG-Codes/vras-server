// Validator
const { Validator } = require('node-input-validator');

// Common Response
const { response } = require('../../../config/response');

// Model
const { Op } = require('sequelize');
const { Setting } = require('../../../models/Setting');

const index = async (req, res) => {
    try {
        let {
            page,
            length
        } = req.query;
        page = page > 0 ? parseInt(page) : 1;
        length = length > 0 ? parseInt(length) : 10;
        let offset = (page - 1) * length;

        const { count: total, rows: settings } = await Setting.findAndCountAll({
            order: [
                ['key', 'ASC']
            ],
            limit: length,
            offset: offset
        });

        const filteredSettings = settings.filter(setting => setting.key !== 'pricing');

        return response(res, { settings: filteredSettings, total: filteredSettings.length }, 'Settings list.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
};

const store = async (req, res) => {
    try {
        const validator = new Validator(req.body, {
            key: 'required',
            value: 'required',
        });
        const matched = await validator.check();
        if (!matched) {
            return response(res, validator.errors, 'validation', 422);
        }

        let errors = {};
        const {
            key,
            value
        } = req.body;

        const keyCount = await Setting.count({
            where: {
                key: { [Op.eq]: key }
            }
        });
        if (keyCount > 0) {
            errors['key'] = {
                message: 'The key already exists.',
                rule: 'unique'
            };
        }

        if (Object.keys(errors).length) {
            return response(res, errors, 'validation', 422);
        }

        const setting = new Setting();
        setting.key = key;
        setting.value = value;
        await setting.save();

        return response(res, setting, 'Setting saved successfully.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const show = async (req, res) => {
    try {
        const { id } = req.params;

        const setting = await Setting.findOne({
            where: {
                id: { [Op.eq]: id }
            }
        });
        if (!setting) {
            return response(res, setting, 'Setting not found.', 404);
        }

        return response(res, setting, 'Setting details.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const update = async (req, res) => {
    try {
        const validator = new Validator(req.body, {
            key: 'sometimes',
            value: 'required',
        });
        const matched = await validator.check();
        if (!matched) {
            return response(res, validator.errors, 'Validation failed', 422);
        }

        let errors = {};
        const { identifier } = req.params;
        let {
            key,
            value
        } = req.body;
        let keyCount = {};
        let setting = {};
        let id = null;

        if (parseInt(identifier)) {
            console.log("checking id", identifier);
            id = identifier;
            setting = await Setting.findByPk(id);
            keyCount = await Setting.count({
                where: {
                    [Op.and]: [
                        { key: { [Op.eq]: setting?.key  } },
                        { id: { [Op.ne]: id } }
                    ]
                }
            });
        } else {
            console.log("checking key", identifier);
            setting = await Setting.findOne({
                where:{
                    key: { [Op.eq] : identifier }
                }
            })
            id = setting?.id;
            keyCount = await Setting.count({
                where: {
                    [Op.and]: [
                        { key: { [Op.eq]: identifier  } },
                        { id: { [Op.ne]: id } }
                    ]
                }
            });
        }

        if (keyCount > 0) {
            errors['key'] = {
                message: 'The key already exists.',
                rule: 'unique'
            };
        }

        if (Object.keys(errors).length) {
            return response(res, errors, 'Validation failed', 422);
        }

        setting = await Setting.findOne({
            where: {
                id: { [Op.eq]: id }
            }
        });
        if (!setting) {
            return response(res, setting, 'Setting not found.', 404);
        }

        setting.key = key;
        setting.value = value;
        await setting.save();

        return response(res, setting, 'Setting updated successfully.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
};

const keyUpdate = async (req, res) => {
    try {
        const validator = new Validator(req.body, {
            value: 'required',
        });
        const matched = await validator.check();
        if (!matched) {
            return response(res, validator.errors, 'Validation', 422);
        }

        let errors = {};
        const { key } = req.params;
        const { value } = req.body;

        if (key === 'pricing-admin-setting') {
            const setting = await Setting.findOne({
                where: { key: { [Op.eq]: key } }
            });

            if (!setting) {
                return response(res, null, 'Setting with this key not found.', 404);
            }

            setting.value = value;
            await setting.save();

            return response(res, setting, 'Setting updated successfully.', 200);
        } else {
            return response(res, null, 'Invalid key for updating.', 400);
        }
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
};

const destroy = async (req, res) => {
    try {
        const { id } = req.params;

        const setting = await Setting.findOne({
            where: {
                id: { [Op.eq]: id }
            }
        });
        if (!setting) {
            return response(res, setting, 'Setting not found.', 404);
        }

        await setting.destroy();

        return response(res, setting, 'Setting deleted successfully.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

module.exports = {
    index,
    store,
    show,
    update,
    destroy,
    keyUpdate
};