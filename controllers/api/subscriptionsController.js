// Common Response
const { response } = require('../../config/response');

// Model
const { Op } = require('sequelize');
const { Subscription } = require('../../models/Subscription');

const index = async (req, res) => {
    try {
        const subscriptions = await Subscription.findAll({
            // where: {
            //     status: { [Op.eq]: 'active' }
            // },
            order: [
                ['price', 'ASC']
            ]
        });

        return response(res, subscriptions, 'Subscriptions list.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

module.exports = {
    index
};