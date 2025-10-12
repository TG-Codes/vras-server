// Common Response
const { response } = require('../../config/response');

// Model
const { Op } = require('sequelize');
const { Testimonial } = require('../../models/Testimonial');

const index = async (req, res) => {
    try {
        const testimonials = await Testimonial.findAll({
            // where: {
            //     status: { [Op.eq]: 'active' }
            // },
            order: [
                ['id', 'DESC']
            ]
        });

        return response(res, testimonials, 'Testimonials list.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

module.exports = {
    index
};