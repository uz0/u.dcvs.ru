const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { hri } = require('human-readable-ids');
const debug = require('debug')('bot:adapter:http');

const { port } = require('../config');

const server = express();

const httpAdapter = () => {};

httpAdapter.__INIT__ = function (ctx) {
    server.use('/api', (req, res) => {
        const id = hri.random();
        ctx.process({
            input: req.query.message,
            from: ['http', id],

            _handleDirect(message, request, context) {
                res.json({ message, request, context });
            },

            // dirty, but working
            ...req.query,
        });
    });

    server.use(cors());

    server.use(bodyParser.urlencoded({ extended: false }));
    server.use(bodyParser.json());

    server.use(express.static('dist'));

    server.listen(port, () => {
        debug(`express listnening port: ${port}`);
    });

    return {
        ...ctx,

        // tmp solution... but i hvnt another now
        // use context.express.use in __INIT__ to register endpoints...
        express: server,
    };
};

module.exports = httpAdapter;
