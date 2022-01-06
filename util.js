const fs = require('fs');

module.exports.updateUser = id => {
    fs.readFile('./config.json', 'utf-8', (err, data) => {
        let config = JSON.parse(data);
        config.user = id;
        const toWrite = JSON.stringify(config, null, 2);
        fs.writeFileSync('./config.json', toWrite);
    })
}

module.exports.getUser = () => {
    return new Promise((resolve, reject) => {
        fs.readFile('./config.json', 'utf-8', (err, data) => {
            resolve(JSON.parse(data).user)
        })
    })
}