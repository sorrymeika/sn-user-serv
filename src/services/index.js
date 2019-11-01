const { createProvider, registerConsumer } = require('sonorpc');
const MySQL = require('sonorpc-mysql');
const Redis = require('ioredis');

const config = require('../config');

const baseRPC = registerConsumer({
    // 服务提供者名称
    providerName: 'base',
    registry: {
        port: 3006
    }
});

const ctx = {
    mysql: new MySQL(config.mysql),
    redis: new Redis(config.redis),
    baseRPC
};

module.exports = function start() {
    return createProvider({
        name: 'user',
        ctx,
        port: 3012,
        registry: {
            port: 3006
        },
        serviceClasses: [
            require('./UserService'),
            require('./UserAddressService'),
            require('./UserInvoiceService'),
        ]
    })
        .start();
};