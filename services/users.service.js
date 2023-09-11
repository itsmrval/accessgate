const User = require('../model/user.model')
const Key = require("../model/key.model");

const regexp = /^\S*$/;


async function userList(code) {
    return await User.findAll()
}

function makeAdmin(userId) {
    User.findOne({ where: { id: userId } }).then((result) => {
        if (result) {
            result.admin = true;
            result.save().then(() => {
                console.log('user ' + result.login + ' is now admin')
            });
        }
    });
}

async function delUser(id) {
    User.findOne({where: { id: id}}).then((result) => {

        if (result && regexp.test(id)) {
            result.destroy()
                .then(() => {
                    console.log('user ' + id + ' deleted from database')

                });
        } else {
            return false;
        }
    });
}

module.exports = {
    makeAdmin,
    delUser,

};