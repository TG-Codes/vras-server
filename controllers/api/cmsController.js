// Common Response
const { response } = require('../../config/response');

// Model
const { Op } = require('sequelize');
const { Cms } = require('../../models/Cms');

const show = async (req, res) => {
    try {
        const { slug } = req.params;

        const cms = await Cms.findOne({
            where: {
                slug: { [Op.eq]: slug }
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

module.exports = {
    show
};