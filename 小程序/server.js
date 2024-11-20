const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const bcrypt = require('bcryptjs'); // 用于密码加密和比较

const PORT = 3000;
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '123456',
  database: 'shuati'
});

// 获取题库列表
app.get('/api/tiku', (req, res) => {
  db.query('SELECT * FROM tiku', (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// 获取题目
// 获取题目接口
app.get('/api/question', (req, res) => {
  const index = parseInt(req.query.index, 10);  // 确保index是数字类型
  if (isNaN(index)) {
    return res.status(400).json({ error: 'Invalid index parameter' });
  }
  let sql_query = ""
  if(index < 10){
    sql_query = "SELECT * FROM tiku WHERE timu_type = 0 ORDER BY RAND() LIMIT 1"
  }else if(index < 15){
    sql_query = "SELECT * FROM tiku WHERE timu_type = 1 ORDER BY RAND() LIMIT 1"
  }else{
    sql_query = "SELECT * FROM tiku WHERE timu_type = 2 ORDER BY RAND() LIMIT 1"
  }
  db.query(sql_query, [index], (err, result) => {
    if (err) {
      console.error('Database error:', err);  // 提供更详细的日志
      return res.status(500).json({ error: 'Database error' });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: 'No question found' });
    }

    // 处理选项字符串
    const options = result[0].xuanxiang
        .split(',')  // 以逗号分隔选项
        .map(option => {
          const [letter, content] = option.split('.');  // 以点分隔字母和内容
          if (!letter || !content) {
            console.error('Invalid option format:', option);  // 记录无效选项格式
            return null;  // 如果选项格式不正确，返回null
          }
          return { letter: letter.trim(), content: content.trim() };  // 返回字母和内容
        })
        .filter(option => option !== null);  // 过滤掉无效的选项

    res.json({
      question: {
        id: result[0].timu_id,
        type: result[0].timu_type,
        text: result[0].timu,
      },
      options: options,  // 返回处理后的选项数组
    });
  });
});

// 提交答案
app.post('/api/submitAnswer', (req, res) => {
  const { user_id, question_id, user_answer } = req.body;

  // 输入数据验证
  if (!user_id || !question_id || !user_answer) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  // 查询正确答案
  db.query('SELECT daan FROM tiku WHERE timu_id = ?', [question_id], (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // 判断答案是否正确
    const isCorrect = result[0].daan === user_answer;

    // 保存历史记录
    db.query('INSERT INTO history (user_name, question_id, user_answer, is_correct) VALUES (?, ?, ?, ?)',
        [user_id, question_id, user_answer, isCorrect],
        (err) => {
          if (err) {
            console.error('Error inserting history:', err);
            return res.status(500).json({ error: 'Failed to save history' });
          }

          // 返回是否正确的结果
          res.json({ isCorrect });
        }
    );
  });
});

// 获取历史记录概览
app.get('/api/getHistorySummary', (req, res) => {
  const user_name = req.query.user_name;  // 获取用户名参数
  if (!user_name) {
    return res.status(400).json({ error: 'Missing user_name parameter' });
  }
  db.query(`
    SELECT tiku.timu, tiku.daan, question_id,
           COUNT(history.id) AS total_attempts, 
           SUM(history.is_correct) / COUNT(history.id) * 100 AS accuracy
    FROM history 
    JOIN tiku ON history.question_id = tiku.timu_id 
    WHERE history.user_name = ?
    GROUP BY history.question_id`, [user_name], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);  // 返回历史记录概览
  });
});

// 获取单个题目的详细历史记录
app.get('/api/getHistoryDetails', (req, res) => {
  const { user_name, question_id } = req.query;
  if (!user_name || !question_id) {
    return res.status(400).json({ error: 'Missing user_name or question_id parameter' });
  }

  db.query(`
    SELECT user_answer, is_correct, timestamp 
    FROM history 
    WHERE user_name = ? AND question_id = ? 
    ORDER BY timestamp DESC`, [user_name, question_id], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);  // 返回该题目的所有答题记录
  });
});

//导入题目
app.post('/api/importQuestion', (req, res) => {
  //const { timu_type, timu, daan, xuanxiang } = req.body;
  //测试用例，记得删除
  const timu_type = 0;
  const timu = "What is the capital of France?";
  const daan = "A";
  const xuanxiang = "A. Paris, B. London, C. Rome, D. Berlin";
  // 校验必填字段
  if (timu_type === undefined || !timu || !daan || !xuanxiang) {
    return res.status(400).json({ message: '缺少必需字段: timu_type, timu, daan, xuanxiang' });
  }

  // 插入数据到 tiku 表
  const query = 'INSERT INTO tiku (timu_type, timu, daan, xuanxiang) VALUES (?, ?, ?, ?)';
  db.query(query, [timu_type, timu, daan, xuanxiang], (err, results) => {
    if (err) {
      console.error('插入数据失败: ', err);
      return res.status(500).json({ message: '插入题目失败', error: err });
    }

    // 返回成功的响应
    res.status(200).json({ message: '题目导入成功', timu_id: results.insertId });
  });
});

//用户只能注册普通用户的身份
app.post('/api/register', (req, res) => {
  //const { user_name, account_password} = req.body;
  const user_name = "gyw";
  const account_password = "securePassword123";
  const account_role = "user";
  // 检查是否提供了所有必要的信息
  if (!user_name || !account_password ) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // 检查用户名是否已存在
  const checkUserQuery = 'SELECT user_name FROM User WHERE user_name = ?';
  db.query(checkUserQuery, [user_name], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length > 0) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    // 插入用户数据到数据库
    const insertQuery = 'INSERT INTO User (user_name, account_password, account_role) VALUES (?, ?, ?)';
    db.query(insertQuery, [user_name, account_password, account_role], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(201).json({ message: 'User registered successfully' });
    });
  });
});

app.post('/api/login', (req, res) => {
  //const { user_name, account_password } = req.body;
  const user_name = "gyw";
  const account_password = "securePassword123";
  // 检查是否提供了所有必要的信息
  if (!user_name || !account_password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // 从数据库中获取用户信息
  const query = 'SELECT * FROM User WHERE user_name = ?';
  db.query(query, [user_name], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log(user);
    // 比较密码
    if (account_password !== user.account_password) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // 根据用户角色重定向到不同的界面
    if (user.account_role === 'administrator') {
      res.status(200).json({ message: 'Logged in as administrator', redirect: '/admin' });
    } else {
      res.status(200).json({ message: 'Logged in as user', redirect: '/user' });
    }
  });
});

// 用于保存倒计时目标时间
let countdownEndTime = null;

// 获取当前剩余的倒计时时间
function getRemainingTime() {
  if (!countdownEndTime) return 0;  // 如果没有设置倒计时，返回0
  const remainingTime = countdownEndTime - Date.now();
  return remainingTime > 0 ? Math.floor(remainingTime / 1000) : 0;  // 返回剩余时间，秒为单位
}

// 设置倒计时接口，接收前端传递的倒计时时长（秒）
app.post('/api/start-countdown', (req, res) => {
  //const { countdownDuration } = req.body;  // 获取前端传递的倒计时秒数
  const countdownDuration = 60;
  if (typeof countdownDuration !== 'number' || countdownDuration <= 0) {
    return res.status(400).json({ message: '倒计时时长必须是大于零的数字' });
  }

  // 设置倒计时目标时间
  countdownEndTime = Date.now() + countdownDuration * 1000;
  res.json({ message: `倒计时已设置为 ${countdownDuration} 秒` });
});

// 获取倒计时剩余时间接口
app.get('/api/countdown', (req, res) => {
  const remainingTime = getRemainingTime();
  if (remainingTime > 0) {
    res.json({ remainingTime });
  } else {
    res.json({ remainingTime: 0, message: '倒计时已结束' });
  }
});



app.listen(PORT, () => {
  console.log('Server is running on http://localhost:3000');
});
