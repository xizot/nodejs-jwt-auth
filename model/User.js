const Sequelize = require("sequelize");
const Model = Sequelize.Model;
const db = require("./../services/db");
const { v4: uuidv4 } = require("uuid");

class User extends Model {
    static async createUser({ fullname, username, password }) {
        const userId = uuidv4();

        return await User.create({ userId, fullname, username, password });
    }

    static async getUserByUserId(userId) {
        return await this.findOne({
            where: {
                userId,
            },
        });
    }
    static async getUserByUsername(username) {
        return await this.findOne({
            where: {
                username,
            },
        });
    }
    static async getRefreshTokenById(userId) {
        const userExisting = await User.getUserByUserId(userId);
        return userExisting?.refreshToken;
    }
    static async updateRefreshToken(userId, refreshToken) {
        await this.update(
            {
                refreshToken,
            },
            {
                where: {
                    userId: userId,
                },
            }
        );
    }
}
User.init(
    {
        userId: {
            type: Sequelize.STRING,
            allowNull: true,
            unique: true,
        },
        username: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        fullname: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        refreshToken: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: "",
        },
        permission: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0,
        },
        status: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 1,
        },
    },
    {
        sequelize: db,
        modelName: "user",
    }
);
module.exports = User;
