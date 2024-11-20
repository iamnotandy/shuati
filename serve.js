const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2/promise'); // 使用Promise版本的mysql2

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

// 创建连接池，使用已有的数据库
const pool = mysql.createPool({
    host: '127.0.0.1',  // MySQL服务器地址
    user: 'Zhuo',       // MySQL用户名
    password: 'Zhw15058379165',  // MySQL密码
    database: 'shuati', // 使用已有的数据库名称
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


// 获取题库数据的 API
app.get('/api/tiku', async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM tiku');
        res.json(results);
    } catch (err) {
        console.error('查询错误:', err);
        res.status(500).send('查询错误');
    }
});
// 添加历史记录
app.post('/api/history', (req, res) => {
    const { timu_id, question_content, correct_answer, user_answer, is_correct } = req.body;
    const sql = 'INSERT INTO history (timu_id, question_content, correct_answer, user_answer, is_correct) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [timu_id, question_content, correct_answer, user_answer, is_correct], (err, result) => {
        if (err) throw err;
        res.send({ message: 'History record added', id: result.insertId });
    });
});

// 获取历史记录
app.get('/api/history', (req, res) => {
    const sql = 'SELECT * FROM history';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
});
