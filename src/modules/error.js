
module.exports = async function(response, { input }) {

    if (response.error) {
        response.output = 'АЙ АЙ, мне больно... что-то сломаллсь... пожалуйста, загляни в мои, ммм, логи...';
    }

    return Promise.resolve(response);
}

