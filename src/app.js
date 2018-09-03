// Inner kitchen our bot service

module.exports = function() {
    let modules = [];

    const self = {
        register(executors) {
            modules = [...executors];

            return self;
        },
        async process({ input = '', ...options }) {
            // const dbInstance = ...;
            let response = {};

            for (const executor of modules)  {
                response = await executor(response, {
                    // db: dbInstance,
                    input,
                    ...options
                });
            }

            options.handle(response);

            return self;
        }
    }

    return self;
}
