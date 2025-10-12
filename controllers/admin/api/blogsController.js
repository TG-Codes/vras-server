// Validator
const { Validator } = require('node-input-validator');

// Upload Helper
const { upload, thumbnail } = require('../../../helpers/uploads');

// Common Response
const { response } = require('../../../config/response');

// Model
const { Op } = require('sequelize');
const { Blog } = require('../../../models/Blog');

const index = async (req, res) => {
    try {
        let {
            page,
            length
        } = req.query;
        page = page > 0 ? parseInt(page) : 1;
        length  = length > 0 ? parseInt(length) : 10;
        let offset = (page - 1) * length;

        const { count: total, rows: blogs } = await Blog.findAndCountAll({
            order: [
                ['id', 'DESC']
            ],
            limit: length,
            offset: offset
        });

        return response(res, { blogs, total }, 'Blogs list.', 200);
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
            'blogs' // folder
        )(req, res, async (err) => {
            if (err) {
                return response(res, req.body, err.message, 500);
            }

            const validator = new Validator(req.body, {
                name: 'required',
                slug: 'required',
                categories: 'required',
                tags: 'required',
                description: 'required',
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
                categories,
                tags,
                description
            } = req.body;

            const slugCount = await Blog.count({
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

            const blog = new Blog();
            blog.name = name;
            blog.slug = slug;
            if (req.files && Object.keys(req.files).length) {
                let image = req.files['image'][0];
                blog.image = await thumbnail(image.path, image.destination, image.filename);
            }
            blog.categories = categories;
            blog.tags = tags;
            blog.description = description;
            await blog.save();

            return response(res, blog, 'Blog saved successfully.', 200);
        });
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const show = async (req, res) => {
    try {
        const { id } = req.params;

        const blog = await Blog.findOne({
            where: {
                id: { [Op.eq]: id }
            }
        });
        if (!blog) {
            return response(res, blog, 'Blog not found.', 404);
        }

        return response(res, blog, 'Blog details.', 200);
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
            'blogs' // folder
        )(req, res, async (err) => {
            if (err) {
                return response(res, req.body, err.message, 500);
            }

            const validator = new Validator(req.body, {
                name: 'required',
                slug: 'required',
                categories: 'required',
                tags: 'required',
                description: 'required',
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
                categories,
                tags,
                description
            } = req.body;

            const slugCount = await Blog.count({
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

            const blog = await Blog.findOne({
                where: {
                    id: { [Op.eq]: id }
                }
            });
            if (!blog) {
                return response(res, blog, 'Blog not found.', 404);
            }

            blog.name = name;
            blog.slug = slug;
            if (req.files && Object.keys(req.files).length) {
                let image = req.files['image'][0];
                blog.image = await thumbnail(image.path, image.destination, image.filename);
            }
            blog.categories = categories;
            blog.tags = tags;
            blog.description = description;
            await blog.save();

            return response(res, blog, 'Blog updated successfully.', 200);
        });
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const destroy = async (req, res) => {
    try {
        const { id } = req.params;

        const blog = await Blog.findOne({
            where: {
                id: { [Op.eq]: id }
            }
        });
        if (!blog) {
            return response(res, blog, 'Blog not found.', 404);
        }

        await blog.destroy();

        return response(res, blog, 'Blog deleted successfully.', 200);
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