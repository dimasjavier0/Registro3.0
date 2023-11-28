const fs = require('fs');
const path = require('path');

class FileManager {
    async read(fileName, location) {
        const filePath = path.join(location, fileName);
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(data);
            });
        });
    }

    async write(fileName, content) {
        return new Promise( (resolve, reject) => {
            fs.writeFile(fileName, content, 'utf8', (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve('File written successfully');
            });
        });
    }

    async delete(fileName, location) {
        const filePath = path.join(location, fileName);
        return new Promise((resolve, reject) => {
            fs.unlink(filePath, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve('File deleted successfully');
            });
        });
    }
}

module.exports = new FileManager();
