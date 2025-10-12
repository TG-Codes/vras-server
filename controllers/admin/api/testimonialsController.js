// Validator
const { Validator } = require('node-input-validator');

// Common Response
const { response } = require('../../../config/response');

// Model
const { Op } = require('sequelize');
const { Testimonial } = require('../../../models/Testimonial');

const index = async (req, res) => {
    try {
        let {
            page,
            length
        } = req.query;
        page = page > 0 ? parseInt(page) : 1;
        length  = length > 0 ? parseInt(length) : 10;
        let offset = (page - 1) * length;

        const { count: total, rows: testimonials } = await Testimonial.findAndCountAll({
            order: [
                ['id', 'DESC']
            ],
            limit: length,
            offset: offset
        });

        return response(res, { testimonials, total }, 'Testimonials list.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const store = async (req, res) => {
    try {
        const validator = new Validator(req.body, {
            name: 'required',
            message: 'required',
        });
        const matched = await validator.check();
        if (!matched) {
            return response(res, validator.errors, 'validation', 422);
        }

        let errors = {};
        const {
            name,
            message
        } = req.body;

        const nameCount = await Testimonial.count({
            where: {
                name: { [Op.eq]: name }
            }
        });
        if (nameCount > 0) {
            errors['name'] = {
                message: 'The name already exists.',
                rule: 'unique'
            };
        }

        if (Object.keys(errors).length) {
            return response(res, errors, 'validation', 422);
        }

        const testimonial = new Testimonial();
        testimonial.name = name;
        testimonial.message = message;
        await testimonial.save();

        return response(res, testimonial, 'Testimonial saved successfully.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const show = async (req, res) => {
    try {
        const { id } = req.params;

        const testimonial = await Testimonial.findOne({
            where: {
                id: { [Op.eq]: id }
            }
        });
        if (!testimonial) {
            return response(res, testimonial, 'Testimonial not found.', 404);
        }

        return response(res, testimonial, 'Testimonial details.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const update = async (req, res) => {
    try {
        const validator = new Validator(req.body, {
            name: 'required',
            message: 'required',
        });
        const matched = await validator.check();
        if (!matched) {
            return response(res, validator.errors, 'Validation', 422);
        }

        let errors = {};
        const { id } = req.params;
        const {
            name,
            message
        } = req.body;

        const nameCount = await Testimonial.count({
            where: {
                [Op.and]: [
                    { name: { [Op.eq]: name } },
                    { id: { [Op.ne]: id } }
                ]
            }
        });
        if (nameCount > 0) {
            errors['name'] = {
                message: 'The name already exists.',
                rule: 'unique'
            };
        }

        if (Object.keys(errors).length) {
            return response(res, errors, 'validation', 422);
        }

        const testimonial = await Testimonial.findOne({
            where: {
                id: { [Op.eq]: id }
            }
        });
        if (!testimonial) {
            return response(res, testimonial, 'Testimonial not found.', 404);
        }

        testimonial.name = name;
        testimonial.message = message;
        await testimonial.save();

        return response(res, testimonial, 'Testimonial updated successfully.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const destroy = async (req, res) => {
    try {
        const { id } = req.params;

        const testimonial = await Testimonial.findOne({
            where: {
                id: { [Op.eq]: id }
            }
        });
        if (!testimonial) {
            return response(res, testimonial, 'Testimonial not found.', 404);
        }

        await testimonial.destroy();

        return response(res, testimonial, 'Testimonial deleted successfully.', 200);
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