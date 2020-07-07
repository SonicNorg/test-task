const config = require('./config');
const logger = require('./logger');
const ExpressServer = require('./expressServer');
const database = require('./services/database');

const launchServer = async () => {
    try {
        logger.info(`    
           _____ __             __  _                                  ___            __  _           
          / ___// /_____ ______/ /_(_)___  ____ _   ____ _____  ____  / (_)________ _/ /_(_)___  ____ 
          \\__ \\/ __/ __ \`/ ___/ __/ / __ \\/ __ \`/  / __ \`/ __ \\/ __ \\/ / / ___/ __ \`/ __/ / __ \\/ __ \\
         ___/ / /_/ /_/ / /  / /_/ / / / / /_/ /  / /_/ / /_/ / /_/ / / / /__/ /_/ / /_/ / /_/ / / / /
        /____/\\__/\\__,_/_/   \\__/_/_/ /_/\\__, /   \\__,_/ .___/ .___/_/_/\\___/\\__,_/\\__/_/\\____/_/ /_/ 
                                        /____/        /_/   /_/                                       
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
        process.exit(1); // Non-zero failure code
    } else {
        process.exit(0);
    }
}
