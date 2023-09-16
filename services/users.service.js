const User = require('../model/user.model')

const regexp_space = /^\S*$/;


function makeAdmin(login) {
    User.findOne({ where: { login: login } }).then((result) => {
        if (result) {
            result.admin = true;
            result.save().then(() => {
                console.log('user ' + result.login + ' is now admin')
            });
        }
    });
}

async function updateServerUser(login, serverUsername) {
    User.findOne({ where: { login: login } }).then((result) => {
        if (result) {
            result.serverUsername = serverUsername;
            console.log(serverUsername)
            console.log(result.serverUsername)
            result.save().then(() => {
                console.log('user ' + result.login + ' updated')
            });
        }
    })
}

async function delUser(id) {
    User.findOne({where: { id: id}}).then((result) => {

        if (result && regexp_space.test(id)) {
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
    updateServerUser,
    delUser,

};