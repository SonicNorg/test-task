const config = require('./config');
const logger = require('./logger');
const ExpressServer = require('./expressServer');
const database = require('./services/database');

const launchServer = async () => {
    try {
        console.log(`
            ____                                   __     ______      __     
           / __ \\____ ___  ______ ___  ___  ____  / /_   / ____/___ _/ /____ 
          / /_/ / __ \`/ / / / __ \`__ \\/ _ \\/ __ \\/ __/  / / __/ __ \`/ __/ _ \\
         / ____/ /_/ / /_/ / / / / / /  __/ / / / /_   / /_/ / /_/ / /_/  __/
        /_/    \\__,_/\\__, /_/ /_/ /_/\\___/_/ /_/\\__/   \\____/\\__,_/\\__/\\___/ 
                    /____/                                                   
        `);

        try {
            logger.info('Initializing database module');
            await database.initialize();
        } catch (err) {
            logger.error(err);
            process.exit(1); // Non-zero failure code
        }

        this.expressServer = new ExpressServer(config.URL_PORT, config.OPENAPI_YAML);
        this.expressServer.launch();
        logger.info('Express server running');
    } catch (error) {
        logger.error('Express Server failure', error.message);
        await this.close();
        await shutdown(error);
    }
};

launchServer().catch(e => logger.error(e));

process.on('SIGTERM', () => {
    logger.info('Received SIGTERM');
    shutdown();
});

process.on('SIGINT', () => {
    logger.info('Received SIGINT');
    shutdown();
});

process.on('uncaughtException', err => {
    logger.error('Uncaught exception', err);
    shutdown(err);
});

async function shutdown(e) {
    let err = e;
    logger.info('Shutting down');
    try {
        logger.info('Closing database module');
        await database.close();
    } catch (err) {
        logger.error('Encountered error', err);
        err = err || e;
    }

    logger.debug('Exiting process');

    if (err) {
        process.exit(1); // Non-zero failure code
    } else {
        process.exit(0);
    }
}
