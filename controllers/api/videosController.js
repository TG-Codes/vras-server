// Common Response
const { response } = require('../../config/response');

// Model
const { Op } = require('sequelize');
const { Video } = require('../../models/Video');

const index = async (req, res) => {
    try {
        const videos = await Video.findAll({
            // where: {
            //     status: { [Op.eq]: 'active' }
            // },
            order: [
                ['id', 'DESC']
            ]
        });

        return response(res, videos, 'Videos list.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

module.exports = {
    index
};