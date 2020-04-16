const {
    query
} = require('../../data');

const {
    generateToken,
} = require('../../security/jwt');

const {
    ServerError
} = require('../../errors');

const {
    hash,
    compare
} = require('../../security/password');

const register = async (username, password) => {
    let cryptoPass = await hash(password);

    const rows = await query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *', [username, cryptoPass]);
    await query('INSERT INTO roles_to_users (user_id, role_id) VALUES ($1, $2)', [rows[0].id, 2]);
};

const authenticate = async (username, password) => {
    const users = await query(`SELECT u.id, u.password FROM users u
                                WHERE u.username = $1`, [username]);
    if (users.length === 0) {
        throw new ServerError(`Utilizatorul cu username ${username} nu exista in sistem!`, 400);
    }
    const user = users[0];

    // check registration dates
    const check = await compare(password, user.password);
    console.log(user, check, password, user.password)
    if (!check) {
        throw new ServerError("Parola incorecta!", 403);
    }

    // generate token payload
    let token = await generateToken({
        userId: user.id,
        username: username,
    })

    return token
};

module.exports = {
    register,
    authenticate
}