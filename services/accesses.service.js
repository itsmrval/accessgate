const Group = require("../model/group.model");
const Access = require("../model/access.model");
const Server = require("../model/server.model");

async function addAccess(serverHostname, groupName) {
    Group.findOne({ where: { name: groupName} }).then((result) => {
        if (result) {
            Server.findOne({ where: { hostname: serverHostname } }).then((server) => {
                if (server) {
                    Access.findOne({ where: { groupName: result.name, serverHostname: server.hostname } }).then((access) => {
                        if (!access) {
                            Access.create({
                                serverHostname: server.hostname,
                                groupName: result.name
                            }).then((access) => {
                                console.log('access added to database' + '(' + access.serverHostname + ',' + access.groupName + ')')
                            });
                        }
                    })
                }

            })
        }

    })
}

async function delAccess(serverHostname, groupName) {
    Group.findOne({ where: { name: groupName} }).then((result) => {
        if (result) {
            Server.findOne({ where: { hostname: serverHostname } }).then((server) => {
                if (user) {
                    Access.findOne({ where: { groupName: result.name, serverHostname: server.hostname } }).then((access) => {
                        if (access) {
                            access.destroy()
                                .then(() => {
                                    console.log('access deleted from database' + '(' + access.serverHostname + ',' + access.groupName + ')')
                                });
                        }
                    })
                }

            })
        }

    })
}

module.exports = {
    addAccess,
    delAccess
};