// Validator
const { Validator } = require('node-input-validator');

// Upload Helper
const { upload, thumbnail } = require('../../../helpers/uploads');

// Common Response
const { response } = require('../../../config/response');

// Model
const { Op } = require('sequelize');
const { Cms } = require('../../../models/Cms');

const index = async (req, res) => {
    try {
        let {
            page,
            length
        } = req.query;
        page = page > 0 ? parseInt(page) : 1;
        length  = length > 0 ? parseInt(length) : 10;
        let offset = (page - 1) * length;

        const { count: total, rows: cms } = await Cms.findAndCountAll({
            order: [
                ['name', 'ASC']
            ],
            limit: length,
            offset: offset
        });

        return response(res, { cms, total }, 'Cms list.', 200);
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
            'cms' // folder
        )(req, res, async (err) => {
            if (err) {
                return response(res, req.body, err.message, 500);
            }

            const validator = new Validator(req.body, {
                name: 'required',
                slug: 'required',
                en: 'required',
                he: 'required',
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
                name,
                slug,
                en,
                he
            } = req.body;

            const slugCount = await Cms.count({
                where: {
                    slug: { [Op.eq]: slug }
                }
            });
            if (slugCount > 0) {
                errors['slug'] = {
                    message: 'The slug already exists.',
                    rule: 'unique'
                };
            }

            if (Object.keys(errors).length) {
                return response(res, errors, 'validation', 422);
            }

            const cms = new Cms();
            cms.name = name;
            cms.slug = slug;
            if (req.files && Object.keys(req.files).length) {
                let image = req.files['image'][0];
                cms.image = await thumbnail(image.path, image.destination, image.filename);
            }
            cms.en = en;
            cms.he = he;
            await cms.save();

            return response(res, cms, 'Cms saved successfully.', 200);
        });
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const show = async (req, res) => {
    try {
        const { id } = req.params;

        const cms = await Cms.findOne({
            where: {
                id: { [Op.eq]: id }
            }
        });
        if (!cms) {
            return response(res, cms, 'Cms not found.', 404);
        }

        return response(res, cms, 'Cms details.', 200);
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
            'cms' // folder
        )(req, res, async (err) => {
            if (err) {
                return response(res, req.body, err.message, 500);
            }

            const validator = new Validator(req.body, {
                name: 'required',
                slug: 'required',
                en: 'required',
                he: 'required',
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
                name,
                slug,
                en,
                he
            } = req.body;

            const slugCount = await Cms.count({
                where: {
                    [Op.and]: [
                        { slug: { [Op.eq]: slug } },
                        { id: { [Op.ne]: id } }
                    ]
                }
            });
            if (slugCount > 0) {
                errors['slug'] = {
                    message: 'The slug already exists.',
                    rule: 'unique'
                };
            }

            if (Object.keys(errors).length) {
                return response(res, errors, 'validation', 422);
            }

            const cms = await Cms.findOne({
                where: {
                    id: { [Op.eq]: id }
                }
            });
            if (!cms) {
                return response(res, cms, 'Cms not found.', 404);
            }

            cms.name = name;
            cms.slug = slug;
            if (req.files && Object.keys(req.files).length) {
                let image = req.files['image'][0];
                cms.image = await thumbnail(image.path, image.destination, image.filename);
            }
            cms.en = en;
            cms.he = he;
            await cms.save();

            return response(res, cms, 'Cms updated successfully.', 200);
        });
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const destroy = async (req, res) => {
    try {
        const { id } = req.params;

        const cms = await Cms.findOne({
            where: {
                id: { [Op.eq]: id }
            }
        });
        if (!cms) {
            return response(res, cms, 'Cms not found.', 404);
        }

        await cms.destroy();

        return response(res, cms, 'Cms deleted successfully.', 200);
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