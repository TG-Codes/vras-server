// Validator
const { Validator } = require('node-input-validator');

// Bcrypt for hash password
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10); // generate a salt

// Common Response
const { response } = require('../../../config/response');

// Mailer
const { transporter, emailTemplatePath, mailOption } = require('../../../config/mailer');
const ejs = require('ejs');

// Model
const { Op } = require('sequelize');
const { Client } = require('../../../models/Client');
const { Department } = require('../../../models/Department');
const { Environment } = require('../../../models/Environment');
const { UserDepartment } = require('../../../models/UserDepartment');
const { User } = require('../../../models/User');

const index = async (req, res) => {
    try {
        let { page, length, keywords } = req.query;

        page = page > 0 ? parseInt(page) : 1;
        length = length > 0 ? parseInt(length) : 10;
        let offset = (page - 1) * length;

        const clientId = req.user.clientId;

        let whereClause = {};
        if (keywords) {
            whereClause = {
                [Op.or]: [
                    { name: { [Op.like]: `%${keywords}%` } }
                ]
            };
        }

        const { count: total, rows: departments } = await Department.findAndCountAll({
            where: {
                clientId: clientId,
                ...whereClause
            },
            order: [
                ['id', 'DESC']
            ],
            limit: length,
            offset: offset
        });

        return response(res, { departments, total }, 'Departments list.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

// List clientId wise Pro User for a clients
const departmentsProUser = async (req, res) => {
    try {
        const {
            clientId
        } = req.user;
        const userDepartments = await UserDepartment.findAll({
            where: {
                userId: { [Op.ne]: null },
            },
            include: [{
                model: User,
                where: {
                    clientId: clientId,
                    isPro: 1
                },
            }]
        });

        return response(res, userDepartments, 'pro users retrieved successfully.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

// department wise pro user listing 
const departmentsProUserShow = async (req, res) => {
    try {
        const { clientId } = req.user;
        const { departmentId } = req.params;
        const { keywords } = req.query;

        let whereClause = {};
        if (keywords) {
            whereClause = {
                [Op.or]: [
                    { name: { [Op.like]: `%${keywords}%` } }
                ]
            };
        }

        const userDepartments = await UserDepartment.findAll({
            where: {
                departmentId,
                userId: { [Op.ne]: null },
            },
            include: [{
                model: User,
                where: {
                    clientId: clientId,
                    role: 'user',
                    isPro: 1,
                    ...whereClause
                },
            }]
        });

        return response(res, userDepartments, 'Departments with pro users retrieved successfully.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

// List  pro users id-wise departments for a client

const proUsersDepartments = async (req, res) => {
    try {
        const { userId } = req.params;
        const { clientId } = req.user;

        const users = await User.findAll({
            where: {
                id: { [Op.eq]: userId },
                isPro: 1,
                clientId: clientId
            },
            include: [{
                model: Department
            }]
        });

        return response(res, users, 'Pro users with departments retrieved successfully.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
};

const store = async (req, res) => {
    try {
        const validator = new Validator(req.body, {
            name: 'required',
        });
        const matched = await validator.check();
        if (!matched) {
            return response(res, validator.errors, 'Validation', 422);
        }

        let errors = {};
        const { clientId } = req.user;

        const client = await Client.findOne({
            where: { id: clientId }
        });
        if (!client) {
            return response(res, null, 'Client not found.', 404);
        }
        const {
            name
        } = req.body;

        const nameCount = await Department.count({
            where: {
                clientId: { [Op.eq]: clientId },
                name: { [Op.eq]: name }
            }
        });
        if (nameCount > 0) {
            errors['name'] = {
                message: 'The name already exists.',
                rule: 'unique'
            };
        }

        if (Object.keys(errors).length) {
            return response(res, errors, 'Validation', 422);
        }

        const department = new Department()
        department.name = name;
        department.clientId = clientId;
        department.environmentId = client.environmentId;
        await department.save();

        console.log('department', department);

        return response(res, department, 'Department saved successfully.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const show = async (req, res) => {
    try {
        const { id } = req.params;
        const { clientId } = req.user;

        const department = await Department.findOne({
            where: {
                id: { [Op.eq]: id },
                clientId: { [Op.eq]: clientId }
            }
        });
        if (!department) {
            return response(res, department, 'Department not found.', 404);
        }

        return response(res, department, 'Department details.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const update = async (req, res) => {
    try {
        const validator = new Validator(req.body, {
            name: 'required',
        });
        const matched = await validator.check();
        if (!matched) {
            return response(res, validator.errors, 'Validation', 422);
        }

        let errors = {};
        const { id } = req.params;
        const { name } = req.body;
        const { clientId } = req.user;

        const department = await Department.findOne({
            where: { id: id }
        });
        if (!department) {
            return response(res, null, 'Department not found.', 404);
        }

        const nameCount = await Department.count({
            where: {
                [Op.and]: [
                    { name: { [Op.eq]: name } },
                    { id: { [Op.ne]: id } },
                    { clientId: { [Op.eq]: clientId } }
                ]
            }
        });
        if (nameCount > 0) {
            errors['name'] = {
                message: 'The name already exists.',
                rule: 'unique'
            };
        }

        if (Object.keys(errors).length) {
            return response(res, errors, 'Validation', 422);
        }

        const client = await Client.findOne({
            where: { id: clientId }
        });
        if (!client) {
            return response(res, null, 'Client not found.', 404);
        }

        department.name = name;
        department.clientId = clientId;
        department.environmentId = client.environmentId;

        await department.save();

        return response(res, department, 'Department updated successfully.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const destroy = async (req, res) => {
    try {
        const { id } = req.params;

        const department = await Department.findOne({
            where: { id: id }
        });
        if (!department) {
            return response(res, department, 'Department not found.', 404);
        }

        await department.destroy();

        return response(res, department, 'Department deleted successfully.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

module.exports = {
    index,
    departmentsProUser,
    departmentsProUserShow,
    proUsersDepartments,
    store,
    show,
    update,
    destroy
};