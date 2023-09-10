const Key = require('../model/key.model')

const regexp = /^\S*$/;

async function addKey(content, name, idOwner) {
    const id_key = idOwner.toString() + name;
    Key.findOne({where: { idKey: id_key}}).then((result) => {
        if (result) {
           return false;
        } else {
            if (content && name && idOwner && regexp.test(name, idOwner, content)) {
                Key.create({
                    idKey: id_key,
                    idOwner: idOwner,
                    content: content,
                    name: name,
                }).then((key) => {
                    console.log('key ' + key.idKey + ' added to database')
                });
            } else {
                return false;
            }

        }
    });
}

async function delKey(id, idOwner) {
    Key.findOne({where: { idKey: id}}).then((result) => {
        if (result && regexp.test(id,idOwner)) {
            if (result.idOwner !== idOwner) {
                return false;
            } else {
                result.destroy()
                    .then(() => {
                        console.log('key ' + result.idKey + ' added to database')
                    });
            }
        } else {
            return false;

        }
    });
}

module.exports = {
    addKey,
    delKey
};