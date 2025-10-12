// Common Response
const { response } = require('../../config/response');

// Model
const { Op } = require('sequelize');
const { Setting } = require('../../models/Setting');

const show = async (req, res) => {
    try {
        const { key } = req.params;

        const setting = await Setting.findOne({
            where: {
                key: { [Op.eq]: key },
            }
        });
        if (!setting) {
            return response(res, setting, 'Setting not found.', 404);
        }

        return response(res, setting, 'Setting details.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

module.exports = {
    show
};