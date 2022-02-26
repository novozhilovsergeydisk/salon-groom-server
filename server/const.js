const path = require('path');
const { views_path } = require('./conf.js');

// console.log({ views_path });

const mimeTypes = {
    html:  'text/html',
    js:    'application/javascript',
    css:   'text/css',
    png:   'image/png',
    jpeg:  'image/jpeg',
    jpg:   'image/jpeg',
    ico:   'image/x-icon',
    svg:   'image/svg+xml',
    webp:  'image/webp',
    woff:  'application/x-font-woff',
    woff2: 'application/x-font-woff2',
    ttf:   'application/x-font-ttf',
    otf:   'application/x-font-otf',
    mp3:   'audio/mpeg',
    mp4:   'video/mp4'
};

const appPath = path.resolve(__dirname);

console.log(appPath);

const CONSTANTS = {
    MIME_TYPES: mimeTypes,
    APP_PATH: appPath,
    SERVER_PATH: appPath,
    VIEWS_PATH: appPath + '/../' + views_path,
    CONTROLLERS_PATH: appPath + '/controllers/',
    STATIC_PATH: path.join(appPath + '/../', './static')
};

// console.log({ CONSTANTS })

module.exports = CONSTANTS;