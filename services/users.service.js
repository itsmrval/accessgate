const User = require('../model/user.model')

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


module.exports = {
    makeAdmin
};