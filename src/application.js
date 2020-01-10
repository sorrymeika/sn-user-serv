const { createProvider, registerConsumer } = require('sonorpc');
const MySQL = require('sonorpc-mysql');
const Redis = require('ioredis');

const config = require('./config');

const baseRPC = registerConsumer({
    // 服务提供者名称
    providerName: 'base',
    registry: {
        port: 3006
    }
});

const application = {
    mysql: new MySQL(config.mysql),
    redis: new Redis(config.redis),
    baseRPC
};

exports.start = function start() {
    return createProvider({
        name: 'user',
        port: 3012,
        registry: {
            port: 3006
        },
        extentions: {
            application
        },
        services: [
            require('./services/UserService'),
            require('./services/UserAddressService'),
            require('./services/UserInvoiceService'),
        ]
    })
        .start();
};