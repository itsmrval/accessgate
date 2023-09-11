const Server = require('../model/server.model')
const Access = require("../model/access.model");

const bcrypt = require('bcrypt');
const sequelize = require("./database.service");

const regexp_space = /^\S*$/;
const regexp_ip = /((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))/



async function addServer(hostname, ip, username) {
    Server.findOne({where: { hostname: hostname}}).then((result) => {
        if (result) {
            return false;
        } else {
            if (hostname && ip && username && regexp_space.test(hostname, username) && regexp_ip.test(ip)) {
                var secret_generated= (Math.random() + 1).toString(36).substring(2);
                console.log('secret: TODO' + secret_generated)
                Server.create({
                    hostname: hostname.toLowerCase(),
                    ip: ip,
                    username: username.toLowerCase(),
                    secret: bcrypt.hashSync(secret_generated, bcrypt.genSaltSync(10))
                }).then((result) => {
                    console.log('Server ' + result.hostname + ' added to database')
                    return secret_generated
                });
            } else {
                return false;
            }

        }
    });
}



async function delServer(hostname) {
    Server.findOne({where: { hostname: hostname}}).then((result) => {
        if (result && regexp_space.test(hostname)) {
            result.destroy()
                .then(() => {
                    console.log('server ' + result.hostname + ' deleted from database')
                    Access.findAll({where: { serverHostname: hostname}}).then((accesses) => {
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

async function getServerKeys(server) {
    const dump = await sequelize.query('SELECT name,content FROM members JOIN users ON users.id = members.userId JOIN accesses ON members.groupName = members.groupName JOIN keys ON members.userId = keys.idOwner WHERE serverHostname = \'' + server + '\'', {});
    result = {}

    for (x in dump) {
        for (y in dump[x]) {
            try {
                if (dump[x][y]) {
                    result[dump[x][y].name] = dump[x][y].content.replace(/(\r\n|\n|\r)/gm, "");
                }
            } catch (e) {}
        }
    }
    return result
}



async function getServerListForUserId(userId) {
    const dump = await sequelize.query('SELECT hostname, username, ip, lastPull FROM servers JOIN accesses ON servers.hostname = accesses.serverHostname JOIN members ON members.groupName = accesses.groupName WHERE userId  = \'' + userId + '\'', {});
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

module.exports = {
    addServer,
    delServer,
    getServerKeys,
    getServerListForUserId

};