const Member = require('../model/member.model')
const Group = require("../model/group.model");
const User = require("../model/user.model");

async function addMember(userId, groupName) {
    Group.findOne({ where: { name: groupName} }).then((result) => {
        if (result) {
            User.findOne({ where: { id: userId } }).then((user) => {
                if (user) {
                    Member.findOne({ where: { groupname: result.name, userId: user.id } }).then((member) => {
                        if (!member) {
                            Member.create({
                                userId: user.id,
                                groupName: result.name
                            }).then((member) => {
                                console.log('member added to database' + '(' + member.userId + ',' + member.groupName + ')')
                            });
                        }
                    })
                }

            })
        }

    })
}

async function delMember(userId, groupName) {
    Group.findOne({ where: { name: groupName} }).then((result) => {
        if (result) {
            User.findOne({ where: { id: userId } }).then((user) => {
                if (user) {
                    Member.findOne({ where: { groupname: result.name, userId: user.id } }).then((member) => {
                        if (member) {
                            member.destroy()
                                .then(() => {
                                    console.log('member deleted from database' + '(' + member.userId + ',' + member.groupName + ')')
                                });
                        }
                    })
                }

            })
        }

    })
}

module.exports = {
    addMember,
    delMember
};