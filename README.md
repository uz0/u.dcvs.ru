# Bot
Bot is powerful service what provide communication between people in community. 

## Abstract

### executor
atomic element, we use it to build bot functionality. It simple function what get `response` and `context` and return `response` object, signature and basic example:
```
async (response, context) => {
    //... CHECKERS (to prevent unexpected mutation)
    if (response.something) {
        return response; // if we return response, we skip executor
    }
    
    // OR skip executor-set
    if (response.something && context.someMethod()) {
        return; // if we return null, we skip executor and all executor set in this module (executor set) see later
    }
    
    //... RESPONSE MUTATIONS
    response.someData = true;
    
    // OR
    try {
        response.test = await someAsyncCall(); // we can write like this
    } catch (error) {
        throw(new Error());
    }
    
    return response;
}

// Also good point to deconstruction context
async (response, { i18n, db }) => { ... }
```

### client
discord, telegram, web

### module (executors set)
only concept, like filtering

### context
signature and methods

### response
signature and lock-in keys

### user model
db structure
methods

## Pre-build modules
command
user
isModerator?
...

## clients specific events

## messages

# feature list (+proposals)
telegram
discord
clubs
web-dashboard
twitch
youtube
vk
