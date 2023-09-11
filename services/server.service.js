const Group = require('../model/group.model')
const Member = require('../model/member.model')
const User = require('../model/user.model')
const Server = require('../model/server.model')

const regexp_space = /^\S*$/;
const regexp_ip = /^((25[0–5]|2[0–4][0–9]|[01]?[0–9][0–9]?).(25[0–5]|2[0–4][0–9]|[01]?[0–9][0–9]?).(25[0–5]|2[0–4][0–9]|[01]?[0–9][0–9]?).(25[0–5]|2[0–4][0–9]|[01]?[0–9][0–9]?))|((([0–9A-Fa-f]{1,4}:){7}[0–9A-Fa-f]{1,4})|(([0–9A-Fa-f]{1,4}:){6}:[0–9A-Fa-f]{1,4})|(([0–9A-Fa-f]{1,4}:){5}:([0–9A-Fa-f]{1,4}:)?[0–9A-Fa-f]{1,4})|(([0–9A-Fa-f]{1,4}:){4}:([0–9A-Fa-f]{1,4}:){0,2}[0–9A-Fa-f]{1,4})|(([0–9A-Fa-f]{1,4}:){3}:([0–9A-Fa-f]{1,4}:){0,3}[0–9A-Fa-f]{1,4})|(([0–9A-Fa-f]{1,4}:){2}:([0–9A-Fa-f]{1,4}:){0,4}[0–9A-Fa-f]{1,4})|(([0–9A-Fa-f]{1,4}:){6}((b((25[0–5])|(1d{2})|(2[0–4]d)|(d{1,2}))b).){3}(b((25[0–5])|(1d{2})|(2[0–4]d)|(d{1,2}))b))|(([0–9A-Fa-f]{1,4}:){0,5}:((b((25[0–5])|(1d{2})|(2[0–4]d)|(d{1,2}))b).){3}(b((25[0–5])|(1d{2})|(2[0–4]d)|(d{1,2}))b))|(::([0–9A-Fa-f]{1,4}:){0,5}((b((25[0–5])|(1d{2})|(2[0–4]d)|(d{1,2}))b).){3}(b((25[0–5])|(1d{2})|(2[0–4]d)|(d{1,2}))b))|([0–9A-Fa-f]{1,4}::([0–9A-Fa-f]{1,4}:){0,5}[0–9A-Fa-f]{1,4})|(::([0–9A-Fa-f]{1,4}:){0,6}[0–9A-Fa-f]{1,4})|(([0–9A-Fa-f]{1,4}:){1,7}:))$/

async function addServer(hostname, ip, username) {
    Server.findOne({where: { hostname: hostname}}).then((result) => {
        if (result) {
            return false;
        } else {
            if (hostname && ip && username && regexp_space.test(hostname, username) && regexp_ip.test(ip)) {
                Server.create({
                    hostname: hostname.toLowerCase(),
                    ip: ip,
                    username: username.toLowerCase()
                }).then((result) => {
                    console.log('Server ' + result.hostname + ' added to database')
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
                });
        } else {
            return false;
        }
    });
}


module.exports = {
    addServer,
    delServer

};