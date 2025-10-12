// Common Response
const { response } = require('../../config/response');

// Model
const { Op } = require('sequelize');
const { Blog } = require('../../models/Blog');

const index = async (req, res) => {
    try {
        let {
            page,
            length
        } = req.query;
        page = page > 0 ? parseInt(page) : 1;
        length = length > 0 ? parseInt(length) : 3;
        let offset = (page - 1) * length;

        const { count: total, rows: blogs } = await Blog.findAndCountAll({
            // where: {
            //     status: { [Op.eq]: 'active' }
            // },
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

const show = async (req, res) => {
    try {
        const { slug } = req.params;

        const blog = await Blog.findOne({
            where: {
                slug: { [Op.eq]: slug }
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

module.exports = {
    index,
    show
};