const Group = require('../model/group.model')
const Members = require('../model/member.model')
const regexp = /^\S*$/;
const User = require('../model/user.model')

async function addGroup(name) {
    Group.findOne({where: { name: name}}).then((result) => {
        if (result) {
           return false;
        } else {
            if (name && regexp.test(name)) {
                Group.create({
                    name: name,
                }).then((result) => {
                    console.log('Group ' + result.name + ' added to database')
                });
            } else {
                return false;
            }

        }
    });
}

async function delGroup(name) {
    Group.findOne({where: { name: name}}).then((result) => {
        if (result && regexp.test(name)) {
            result.destroy()
                .then(() => {
                    console.log('group ' + result.name + ' added to database')
                });
        } else {
            return false;


        }
    });
}

async function groupUserList(groupName) {
    User.hasMany(Members);
    Members.belongsTo(User);
    const users = await User.findAll({ include: Members });
    var result = []
    for (x in users) {
        try {
            if (users[x].dataValues.members[0].dataValues.groupName === groupName) {
                result[x] = (users[x].dataValues)
            }
        } catch (error) {
    }}
    return result
};

module.exports = {
    addGroup,
    delGroup,
    groupUserList
};