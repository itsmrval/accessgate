const Group = require('../model/group.model')
const Member = require('../model/member.model')
const User = require('../model/user.model')
const Server = require('../model/server.model')
const Access = require('../model/access.model')

const regexp_space = /^\S*$/;


async function addGroup(name) {
    Group.findOne({where: { name: name}}).then((result) => {
        if (result) {
           return false;
        } else {
            if (name && regexp_space.test(name)) {
                Group.create({
                    name: name.toLowerCase(),
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
        if (result && regexp_space.test(name)) {
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
                    Access.findAll({where: { groupName: name}}).then((accesses) => {
                        for (x in accesses) {
                            accesses[x].destroy().then(() => {
                                console.log('access ' + accesses[x].userId + ' deleted from database')
                            })
                        }
                    });
                });
        } else {
            return false;
        }
    });
}

async function getGroupsWithMembers() {
    Group.hasMany(Member);
    Member.belongsTo(Group);
    const count = await Group.findAll({ include: Member });
    return count
}



async function groupUserList(groupName) {
    User.hasMany(Member);
    Member.belongsTo(User);
    const users = await User.findAll({ include: Member });
    var result = []
    for (x in users) {
        try {
            for (y in users[x].dataValues.members) {
                if (users[x].dataValues.members[y].dataValues.groupName === groupName) {
                    result[x] = (users[x].dataValues)
                }
            }

        } catch (error) {
    }}
    return result
};


async function groupServerList(groupName) {
    Server.hasMany(Access);
    Access.belongsTo(Server);
    const servers = await Server.findAll({ include: Access });
    var result = []
    for (x in servers) {
        try {
            for (y in servers[x].dataValues.accesses) {
                if (servers[x].dataValues.accesses[y].dataValues.groupName === groupName) {
                    result[x] = (servers[x].dataValues)
                }
            }

        } catch (error) {
        }}
    return result
};

groupServerList('group1').then(
    (result) => {
        console.log(result)
    }
)
module.exports = {
    addGroup,
    delGroup,
    groupUserList,
    getGroupsWithMembers,
    groupServerList

};