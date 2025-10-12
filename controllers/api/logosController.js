// Common Response
const { response } = require('../../config/response');

// Model
const { Op } = require('sequelize');
const { Logo } = require('../../models/Logo');

const index = async (req, res) => {
    try {
        const logos = await Logo.findAll({
            // where: {
            //     status: { [Op.eq]: 'active' }
            // },
            order: [
                ['id', 'DESC']
            ]
        });

        return response(res, logos, 'Logos list.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

module.exports = {
    index
};