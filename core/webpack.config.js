const TARGET = process.env.npm_lifecycle_event;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const PATHS = {
    src: path.join(__dirname, './ui'),
    dist: path.join(__dirname, './')
};

if (TARGET === 'build:dev' || TARGET === 'dev' || !TARGET) {
    module.exports = require('./config/webpack.config.dev');
    console.info('--> ./config/webpack.config.dev.js');
}
else if (TARGET === 'exchange') {
    console.info('>> export ui to exchange <<');
    module.exports = {
        context: __dirname,
        mode: 'production',
        plugins: [
            new CopyWebpackPlugin([
                {
                    from: path.join(PATHS.src, ''),
                    to: path.join(PATHS.dist, '..', 'exchange', 'src', '__ui')
                },
            ])
        ]
    };
}
else if(TARGET === 'portal') {
    console.info('>> export ui to portal <<');
    module.exports = {
        context: __dirname,
        mode: 'production',
        plugins: [
            new CopyWebpackPlugin([
                {
                    from: path.join(PATHS.src, ''),
                    to: path.join(PATHS.dist, '..', 'portal', 'src', '__ui')
                },
            ])
        ]
    };
}


