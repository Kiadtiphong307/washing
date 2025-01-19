-- สร้างตารางเครื่องซักผ้า
CREATE TABLE IF NOT EXISTS washing_machines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL DEFAULT 'เครื่องซักผ้า',
    imageNormal VARCHAR(255) DEFAULT '/images/washing_normal.png',
    imageUse VARCHAR(255) DEFAULT '/images/washing_use.gif',
    time INT DEFAULT 120,
    coin INT DEFAULT 0,
    status BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);