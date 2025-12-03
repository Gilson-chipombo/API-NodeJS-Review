const db = require('../db')

const createUser = async ({name, email, pssword, role = 'user'}) =>{
    const text = `
    INSERT INTO users (name, email, pssword, role)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, email, role, created_at
    `;

    const values = [name, email, pssword, role];
    const {rows} = await db.query(text, values);
    return rows[0]
};

const findUserByEmail = async (email) =>{
    const {rows} = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0];
};

const findUserById = async (id) => {
    const {rows} = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    return rows[0];
};

const updateUser = async(id, {name, email}) =>{
    const text = `
        UPDATE users SET name = COALESCE($2, name), email = ($3, email) 
        WHERE id = $1
        RETURNING id, name, email, role, created_at, updated_at
    `;
    const values = [id, name, email];
    const {rows} = await db.query(text, values);
    return rows[0];
};

const deleteUser = async (id) =>{
    const {rows} = await db.query("DELETE * FROM users WHERE id = $1",[id]);
    return rows[0];
}

const allUsers = async({limit = 10, offset = 0}) =>{
    const {rows} = await db.query("SELECT * FROM users ORDER BY id desc LIMIT $1 OFFSET = $2", [limit, offset]);
    return rows;
}

module.exports = {
    createUser,
    findUserByEmail,
    findUserById,
    updateUser,
    deleteUser,
    allUsers
};