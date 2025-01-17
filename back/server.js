const express = require('express');
const cors = require('cors');
const app = express();
const washingMachine = require('./config/database');

app.use(cors());
app.use(express.json());

// POST - เพิ่มเครื่องซักผ้าใหม่
app.post('/washing', async (req, res) => {
  try {
    const [result] = await washingMachine.query(
      'INSERT INTO washing_machines (name, imageNormal, imageUse, time, status) VALUES (?, ?, ?, ?, ?)',
      [
        'เครื่องซักผ้า',
        '/images/washing_normal.png',
        '/images/washing_use.gif',
        10,
        false
      ]
    );
    
    const [newMachine] = await washingMachine.query(
      'SELECT * FROM washing_machines WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json(newMachine[0]);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเพิ่มเครื่องซักผ้า' });
  }
});

// GET - ดึงข้อมูลทั้งหมด
app.get('/washing', async (req, res) => {
  try {
    const [rows] = await washingMachine.query('SELECT * FROM washing_machines');
    res.json(rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
  }
});

// GET ONE - ดึงข้อมูลตาม ID
app.get('/washing/:id', async (req, res) => {
  try {
    const [rows] = await washingMachine.query(
      'SELECT * FROM washing_machines WHERE id = ?',
      [req.params.id]
    );
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: 'ไม่พบเครื่องซักผ้า' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
  }
});

// PUT - อัพเดทข้อมูล
app.put('/washing/:id', async (req, res) => {
  try {
    const [result] = await washingMachine.query(
      'UPDATE washing_machines SET name = ? WHERE id = ?',
      [req.body.name, req.params.id]
    );
    
    if (result.affectedRows > 0) {
      const [updated] = await washingMachine.query(
        'SELECT * FROM washing_machines WHERE id = ?',
        [req.params.id]
      );
      res.json(updated[0]);
    } else {
      res.status(404).json({ message: 'ไม่พบเครื่องซักผ้า' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัพเดทข้อมูล' });
  }
});

// DELETE - ลบเครื่องซักผ้า
app.delete('/washing/:id', async (req, res) => {
  try {
    const [result] = await washingMachine.query(
      'DELETE FROM washing_machines WHERE id = ?',
      [req.params.id]
    );
    
    if (result.affectedRows > 0) {
      res.json({ message: 'ลบเครื่องซักผ้าสำเร็จ' });
    } else {
      res.status(404).json({ message: 'ไม่พบเครื่องซักผ้า' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบข้อมูล' });
  }
});

// PUT - อัพเดทสถานะ
app.put('/washing/:id/status', async (req, res) => {
  try {
    const [result] = await washingMachine.query(
      'UPDATE washing_machines SET status = ?, time = ? WHERE id = ?',
      [req.body.status, req.body.time, req.params.id]
    );
    
    if (result.affectedRows > 0) {
      const [updated] = await washingMachine.query(
        'SELECT * FROM washing_machines WHERE id = ?',
        [req.params.id]
      );
      res.json(updated[0]);
    } else {
      res.status(404).json({ message: 'ไม่พบเครื่องซักผ้า' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัพเดทสถานะ' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 