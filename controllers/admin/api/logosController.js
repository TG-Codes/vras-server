// Validator
const { Validator } = require('node-input-validator');

// Upload Helper
const { upload, thumbnail } = require('../../../helpers/uploads');

// Common Response
const { response } = require('../../../config/response');

// Model
const { Op } = require('sequelize');
const { Logo } = require('../../../models/Logo');

const index = async (req, res) => {
    try {
        let {
            page,
            length
        } = req.query;
        page = page > 0 ? parseInt(page) : 1;
        length = length > 0 ? parseInt(length) : 10;
        let offset = (page - 1) * length;

        const { count: total, rows: logos } = await Logo.findAndCountAll({
            order: [
                ['id', 'DESC']
            ],
            limit: length,
            offset: offset
        });

        return response(res, { logos, total }, 'Logos list.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const store = async (req, res) => {
    try {
        upload(
            [
                { name: 'image', maxCount: 1 },
                // { name: 'anotherImage', maxCount: 1 }
            ],
            ["image/jpeg", "image/jpg", "image/png"],
            'logos' // folder
        )(req, res, async (err) => {
            if (err) {
                return response(res, req.body, err.message, 500);
            }

            const validator = new Validator(req.body, {
                // name: 'required',
            });
            const matched = await validator.check();
            if (!matched) {
                return response(res, validator.errors, 'validation', 422);
            }

            let errors = {};
            if (req.fileValidationError) {
                errors['image'] = {
                    message: req.fileValidationError,
                    rule: 'file'
                };
            }

            const {
                // name
            } = req.body;

            // const nameCount = await Logo.count({
            //     where: {
            //         name: { [Op.eq]: name }
            //     }
            // });
            // if (nameCount > 0) {
            //     errors['name'] = {
            //         message: 'The name already exists.',
            //         rule: 'unique'
            //     };
            // }

            if (Object.keys(errors).length) {
                return response(res, errors, 'validation', 422);
            }

            const logo = new Logo();
            if (req.files && Object.keys(req.files).length) {
                let image = req.files['image'][0];
                logo.image = await thumbnail(image.path, image.destination, image.filename);
            }
            await logo.save();

            return response(res, logo, 'Logo saved successfully.', 200);
        });
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const show = async (req, res) => {
    try {
        const { id } = req.params;

        const logo = await Logo.findOne({
            where: {
                id: { [Op.eq]: id }
            }
        });
        if (!logo) {
            return response(res, logo, 'Logo not found.', 404);
        }

        return response(res, logo, 'Logo details.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const update = async (req, res) => {
    try {
        upload(
            [
                { name: 'image', maxCount: 1 },
                // { name: 'anotherImage', maxCount: 1 }
            ],
            ["image/jpeg", "image/jpg", "image/png"],
            'logos' // folder
        )(req, res, async (err) => {
            if (err) {
                return response(res, req.body, err.message, 500);
            }

            const validator = new Validator(req.body, {
                // name: 'required',
            });
            const matched = await validator.check();
            if (!matched) {
                return response(res, validator.errors, 'Validation', 422);
            }

            let errors = {};
            if (req.fileValidationError) {
                errors['image'] = {
                    message: req.fileValidationError,
                    rule: 'file'
                };
            }

            const { id } = req.params;
            const {
                // name
            } = req.body;

            // const nameCount = await Logo.count({
            //     where: {
            //         [Op.and]: [
            //             { name: { [Op.eq]: name } },
            //             { id: { [Op.ne]: id } }
            //         ]
            //     }
            // });
            // if (nameCount > 0) {
            //     errors['name'] = {
            //         message: 'The name already exists.',
            //         rule: 'unique'
            //     };
            // }

            if (Object.keys(errors).length) {
                return response(res, errors, 'validation', 422);
            }

            const logo = await Logo.findOne({
                where: {
                    id: { [Op.eq]: id }
                }
            });
            if (!logo) {
                return response(res, logo, 'Logo not found.', 404);
            }

            if (req.files && Object.keys(req.files).length) {
                let image = req.files['image'][0];
                logo.image = await thumbnail(image.path, image.destination, image.filename);
            }
            await logo.save();

            return response(res, logo, 'Logo updated successfully.', 200);
        });
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const destroy = async (req, res) => {
    try {
        const { id } = req.params;

        const logo = await Logo.findOne({
            where: {
                id: { [Op.eq]: id }
            }
        });
        if (!logo) {
            return response(res, logo, 'Logo not found.', 404);
        }

        await logo.destroy();

        return response(res, logo, 'Logo deleted successfully.', 200);
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