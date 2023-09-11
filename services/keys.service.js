const Key = require('../model/key.model')

const regexp = /^\S*$/;

async function addKey(content, name, idOwner) {
    Key.findOne({where: { idOwner: idOwner, name: name}}).then((result) => {
        if (result) {
           return false;
        } else {
            if (content && name && idOwner && regexp.test(name, idOwner, content)) {
                Key.create({
                    idOwner: idOwner,
                    content: content,
                    name: name.toLowerCase(),
                }).then((key) => {
                    console.log('key for ' + key.idOwner + ' added to database')
                });
            } else {
                return false;
            }

        }
    });
}

async function delKey(name, idOwner) {
    Key.findOne({where: { name: name, idOwner: idOwner}}).then((result) => {
        if (result && regexp.test(name, idOwner)) {
            result.destroy()
                .then(() => {
                    console.log('key for ' + result.idOwner + ' deleted from database')
                });
        } else {
            return false;

        }
    });
}

module.exports = {
    addKey,
    delKey
};