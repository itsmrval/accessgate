const Group = require('../model/group.model')
const Member = require('../model/member.model')
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
                    Member.findAll({where: { groupName: name}}).then((members) => {
                        for (x in members) {
                            members[x].destroy().then(() => {
                                console.log('member ' + members[x].userId + ' deleted from database')
                            })
                        }
                    });
                });
        } else {
            return false;


        }
    });
}

async function userGroupList(userId) {
    const members = await Member.findAll({where: { userId: userId}})
    var result = []
    for (x in members) {
        result[x] = (members[x].dataValues)
    }
    return result

}

async function groupUserList(groupName) {
    User.hasMany(Member);
    Member.belongsTo(User);
    const users = await User.findAll({ include: Member });
    var result = []
    console.log(users)
    for (x in users) {
        try {
            for (y in users[x].dataValues.members) {
                if (users[x].dataValues.members[y].dataValues.groupName === groupName) {
                    result[x] = (users[x].dataValues)
                }
            }

        } catch (error) {
    }}
    console.log(result)
    return result
};

module.exports = {
    addGroup,
    delGroup,
    groupUserList,
    userGroupList
};