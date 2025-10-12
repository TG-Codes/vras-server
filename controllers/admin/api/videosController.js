// Validator
const { Validator } = require('node-input-validator');

// Common Response
const { response } = require('../../../config/response');

// Model
const { Op } = require('sequelize');
const { Video } = require('../../../models/Video');

const index = async (req, res) => {
    try {
        let {
            page,
            length
        } = req.query;
        page = page > 0 ? parseInt(page) : 1;
        length  = length > 0 ? parseInt(length) : 10;
        let offset = (page - 1) * length;

        const { count: total, rows: videos } = await Video.findAndCountAll({
            order: [
                ['id', 'DESC']
            ],
            limit: length,
            offset: offset
        });

        return response(res, { videos, total }, 'Videos list.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const store = async (req, res) => {
    try {
        const validator = new Validator(req.body, {
            url: 'required',
        });
        const matched = await validator.check();
        if (!matched) {
            return response(res, validator.errors, 'validation', 422);
        }

        let errors = {};
        const {
            url
        } = req.body;

        const nameCount = await Video.count({
            where: {
                url: { [Op.eq]: url }
            }
        });
        if (nameCount > 0) {
            errors['url'] = {
                message: 'The url already exists.',
                rule: 'unique'
            };
        }

        if (Object.keys(errors).length) {
            return response(res, errors, 'validation', 422);
        }

        const video = new Video();
        video.url = url;
        await video.save();

        return response(res, video, 'Video saved successfully.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const show = async (req, res) => {
    try {
        const { id } = req.params;

        const video = await Video.findOne({
            where: {
                id: { [Op.eq]: id }
            }
        });
        if (!video) {
            return response(res, video, 'Video not found.', 404);
        }

        return response(res, video, 'Video details.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const update = async (req, res) => {
    try {
        const validator = new Validator(req.body, {
            url: 'required',
        });
        const matched = await validator.check();
        if (!matched) {
            return response(res, validator.errors, 'Validation', 422);
        }

        let errors = {};
        const { id } = req.params;
        const {
            url
        } = req.body;

        const nameCount = await Video.count({
            where: {
                [Op.and]: [
                    { url: { [Op.eq]: url } },
                    { id: { [Op.ne]: id } }
                ]
            }
        });
        if (nameCount > 0) {
            errors['url'] = {
                message: 'The url already exists.',
                rule: 'unique'
            };
        }

        if (Object.keys(errors).length) {
            return response(res, errors, 'validation', 422);
        }

        const video = await Video.findOne({
            where: {
                id: { [Op.eq]: id }
            }
        });
        if (!video) {
            return response(res, video, 'Video not found.', 404);
        }

        video.url = url;
        await video.save();

        return response(res, video, 'Video updated successfully.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const destroy = async (req, res) => {
    try {
        const { id } = req.params;

        const video = await Video.findOne({
            where: {
                id: { [Op.eq]: id }
            }
        });
        if (!video) {
            return response(res, video, 'Video not found.', 404);
        }

        await video.destroy();

        return response(res, video, 'Video deleted successfully.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

module.exports = {
    index,
    store,
    show,
    update,
    destroy
};