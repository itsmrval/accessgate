const Group = require('../model/group.model')
const Member = require('../model/member.model')
const User = require('../model/user.model')
const Server = require('../model/server.model')
const Access = require('../model/access.model')
const sequelize = require("./database.service");

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

async function getGroupsWithServers() {
    Group.hasMany(Access);
    Access.belongsTo(Group);
    const count = await Group.findAll({ include: Access });
    return count
}




async function groupUserList(groupName) {
    const dump = await sequelize.query('SELECT * FROM users JOIN members ON users.id = members.userId WHERE groupName = \'' + groupName + '\'', {});
    result = {}
    for (x in dump[0]) {
        if (dump[0][x].userId) {
            result[(dump[0][x].userId).toString()] = {
                'id': dump[0][x].userId,
                'login': dump[0][x].login,
                'avatar': dump[0][x].avatar
            }
        }
    }
    return result
}

async function groupServerList(groupName) {
    const dump = await sequelize.query('SELECT hostname, ip, username, lastPull FROM servers JOIN accesses ON servers.hostname = accesses.serverHostname WHERE groupName = \'' + groupName + '\'', {});
    result = {}
    for (x in dump[0]) {
        if (dump[0][x].hostname) {
            if (!dump[0][x].lastPull) {
                dump[0][x].lastPull = ' never'
            }
            result[(dump[0][x].hostname).toString()] = {
                'username': dump[0][x].username,
                'ip': dump[0][x].ip,
                'lastPull': dump[0][x].lastPull
            }
        }
    }
    return result
}


groupServerList('admin')

module.exports = {
    addGroup,
    delGroup,
    groupUserList,
    getGroupsWithMembers,
    groupServerList,
    getGroupsWithServers

};