const TARGET = process.env.npm_lifecycle_event;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const PATHS = {
    src: path.join(__dirname, './ui'),
    dist: path.join(__dirname, './')
};

if (TARGET === 'exchange' || TARGET === 'portal' || TARGET === 'auth') {
    console.info('Export components UI to ', TARGET);
    module.exports = {
        context: __dirname,
        mode: 'production',
        plugins: [
            new CopyWebpackPlugin([
                {
                    from: path.join(PATHS.src, ''),
                    to: path.join(PATHS.dist, '..', TARGET, 'src', '__ui')
                },
            ])
        ]
    };
}