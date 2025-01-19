const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const washingMachine = require('./config/database');

// Line Notify token
const LINE_NOTIFY_TOKEN = 'GlmLMTEIP4heqCDytFi9OL5nJRn99lJE75jf1tXbo9l';

// เก็บสถานะการแจ้งเตือนของแต่ละเครื่อง
const notificationSent = new Map();

// ฟังก์ชันส่งแจ้งเตือน Line
const sendLineNotify = async (message) => {
  try {
    await axios.post('https://notify-api.line.me/api/notify', 
      `message=${message}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${LINE_NOTIFY_TOKEN}`
        }
      }
    );
    console.log('ส่งแจ้งเตือน Line ');
  } catch (error) {
    console.error('Error sending Line notification:', error);
  }
};

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
        120,
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

// PUT - อัพเดทสถานะและส่งแจ้งเตือน
app.post('/washing/:id/status', async (req, res) => {
  try {
    const machineId = req.params.id;
    const { status, time } = req.body;
    
    // ดึงข้อมูลเครื่องปัจจุบัน
    const [machine] = await washingMachine.query(
      'SELECT * FROM washing_machines WHERE id = ?',
      [machineId]
    );

    if (machine[0]) {
      // เช็คเงินต้องครบ 20 บาทก่อนเริ่มทำงาน
      if (status && machine[0].coin < 20) {
        return res.status(400).json({ 
          message: 'กรุณาหยอดเหรียญให้ครบ 20 บาท',
          remaining: 20 - machine[0].coin
        });
      }

      // เมื่อเครื่องทำงานเสร็จ (time = 0)
      if (time === 0) {
        // รีเซ็ตเหรียญเป็น 0
        await washingMachine.query(
          'UPDATE washing_machines SET status = ?, time = ?, coin = 0 WHERE id = ?',
          [false, 120, machineId]
        );
        
        // แจ้งเตือนว่าซักเสร็จแล้ว
        await sendLineNotify(`✅ เครื่องซักผ้าเครื่องที่ ${machineId} ซักเสร็จแล้ว!`);
        notificationSent.delete(machineId);
      } 
      // อัพเดทสถานะและเวลาปกติ
      else {
        await washingMachine.query(
          'UPDATE washing_machines SET status = ?, time = ? WHERE id = ?',
          [status, time, machineId]
        );

        // แจ้งเตือนเมื่อเหลือ 60 วินาที
        if (status && time === 60 && !notificationSent.get(machineId)) {
          await sendLineNotify(`⏰ เครื่องซักผ้าเครื่องที่ ${machineId} จะเสร็จในอีก 1 นาที`);
          notificationSent.set(machineId, true);
        }
      }

      // ดึงข้อมูลที่อัพเดทแล้ว
      const [updated] = await washingMachine.query(
        'SELECT * FROM washing_machines WHERE id = ?',
        [machineId]
      );

      // รีเซ็ตสถานะการแจ้งเตือนเมื่อเครื่องหยุดทำงาน
      if (!status) {
        notificationSent.delete(machineId);
      }

      res.json(updated[0]);
    } else {
      res.status(404).json({ message: 'ไม่พบเครื่องซักผ้า' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัพเดทสถานะ' });
  }
});

// เพิ่ม endpoint สำหรับหยอดเหรียญ
app.post('/washing/:id/coin', async (req, res) => {
  try {
    const machineId = req.params.id;
    const coinValue = req.body.value; // 5 หรือ 10 บาท

    // ดึงข้อมูลเครื่องปัจจุบัน
    const [machine] = await washingMachine.query(
      'SELECT * FROM washing_machines WHERE id = ?',
      [machineId]
    );

    if (machine[0]) {
      // คำนวณเงินรวม
      const totalCoin = machine[0].coin + coinValue;
      
      // อัพเดทจำนวนเงิน
      await washingMachine.query(
        'UPDATE washing_machines SET coin = ? WHERE id = ?',
        [totalCoin, machineId]
      );

      // ดึงข้อมูลที่อัพเดทแล้ว
      const [updated] = await washingMachine.query(
        'SELECT * FROM washing_machines WHERE id = ?',
        [machineId]
      );

      res.json(updated[0]);
    } else {
      res.status(404).json({ message: 'ไม่พบเครื่องซักผ้า' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 