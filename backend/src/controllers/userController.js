const db = require('../config/db');

exports.getUser = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM users LIMIT 1');
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado. Crie um novo perfil.' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao buscar usuário.' });
    }
};

exports.saveUser = async (req, res) => {
    const { full_name, age, street, neighborhood, state, bio, profile_image_url } = req.body;

    if (!full_name || full_name.trim() === '') {
        return res.status(400).json({ message: 'O nome completo é obrigatório.' });
    }

    if (age && (isNaN(age) || age < 0 || age > 120)) {
        return res.status(400).json({ message: 'Idade inválida. Deve ser um número entre 0 e 120.' });
    }

    try {
        const [existingUsers] = await db.execute('SELECT id FROM users LIMIT 1');
        
        if (existingUsers.length > 0) {
            const userId = existingUsers[0].id;
            const [result] = await db.execute(
                `UPDATE users SET full_name = ?, age = ?, street = ?, neighborhood = ?, state = ?, bio = ?, profile_image_url = ? WHERE id = ?`,
                [full_name, age, street, neighborhood, state, bio, profile_image_url, userId]
            );
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Usuário para atualização não encontrado.' });
            }
            res.json({ message: 'Perfil atualizado com sucesso!' });
        } else {
            const [result] = await db.execute(
                `INSERT INTO users (full_name, age, street, neighborhood, state, bio, profile_image_url) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [full_name, age, street, neighborhood, state, bio, profile_image_url]
            );
            res.status(201).json({ message: 'Perfil criado com sucesso!', userId: result.insertId });
        }
    } catch (error) {
        console.error('Erro ao salvar usuário:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao salvar usuário.' });
    }
};

exports.listUsers = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT id, full_name, profile_image_url FROM users');
        res.json(rows);
    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao listar usuários.' });
    }
};