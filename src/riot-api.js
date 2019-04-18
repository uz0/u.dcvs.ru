const buildUrl = require('build-url');
const request = require('request-promise');

const { riot: { authToken } } = require('./config');

// TODO: not only ru
const host = 'https://ru.api.riotgames.com/lol';

async function get(reqUrl) {
    try {
        const qwe = await request.get(reqUrl);

        return JSON.parse(qwe);
    } catch (e) {
        console.error(e);
    }

    return undefined;
}

async function getSummonerByName(name) {
    const reqUrl = buildUrl(host, {
        path: `summoner/v4/summoners/by-name/${name}`,
        queryParams: {
            api_key: authToken,
        },
    });

    return get(reqUrl);
}

async function getMatchById(id) {
    const reqUrl = buildUrl(host, {
        path: `/lol/match/v4/matches/${id}`,
        queryParams: {
            api_key: authToken,
        },
    });

    return get(reqUrl);
}

async function getCurrentGameInfo(summonerId) {
    const reqUrl = buildUrl(host, {
        path: `/lol/spectator/v4/active-games/by-summoner/${summonerId}`,
        queryParams: {
            api_key: authToken,
        },
    });

    return get(reqUrl);
}

module.exports = {
    getSummonerByName,
    getMatchById,
    getCurrentGameInfo,
};
