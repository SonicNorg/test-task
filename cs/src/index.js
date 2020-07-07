const config = require('./config');
const logger = require('./logger');
const ExpressServer = require('./expressServer');
const database = require('./services/database');

const launchServer = async () => {
    try {
        console.log(`
           ________              __      _____ __        __            
          / ____/ /_  ___  _____/ /__   / ___// /_____ _/ /___  _______
         / /   / __ \\/ _ \\/ ___/ //_/   \\__ \\/ __/ __ \`/ __/ / / / ___/
        / /___/ / / /  __/ /__/ ,<     ___/ / /_/ /_/ / /_/ /_/ (__  ) 
        \\____/_/ /_/\\___/\\___/_/|_|   /____/\\__/\\__,_/\\__/\\__,_/____/  
                                            
        `);

        try {
            logger.info('Initializing database module');
            await database.initialize();
        } catch (err) {
            logger.error("Failed to initialize database", err);
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
        process.exit(1);
    } else {
        process.exit(0);
    }
}
