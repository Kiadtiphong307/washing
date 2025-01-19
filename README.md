# ระบบเครื่องซักผ้าหยอดเหรียญ
ระบบนี้เป็นเว็บแอปพลิเคชันที่ใช้สำหรับจัดการเครื่องซักผ้าหยอดเหรียญ โดยให้ผู้ใช้งานสามารถหยอดเหรียญเพื่อเริ่มต้นการทำงานของเครื่องซักผ้า และมีการแจ้งเตือนผ่าน LINE Notify เมื่อเวลาการทำงานของเครื่องซักผ้าเหลือน้อยกว่า 1 นาที


## Features
1. **เริ่มซักผ้าโดยการหยอดเหรียญ**  
2. **แสดงการนับเวลาถอยหลัง**  
3. **แจ้งเตือนผ่าน LINE เมื่อเวลาซักผ้าเหลือ 1 นาที**  


## System Requirements

- **Node.js**  
- **Git**  
- **MySQL**  
- **LINE Notify Token**  


## Topics

### 1. การออกแบบ Flowchart และโครงสร้างไฟล์

#### Flowchart  
![Flowchart ระบบเครื่องซักผ้าหยอดเหรียญ](https://github.com/user-attachments/assets/ddc5666d-284b-4549-8f37-b994345dfc94)

#### โครงสร้างไฟล์  

```
📁 WASHING/
├── 📁 back/                  
│   ├── 📁 config/           
│   │   ├── 📄 database.js   
│   │   └── 📄 schema.sql    
│   ├── 📁 node_modules/     
│   ├── 📄 package.json      
│   ├── 📄 package-lock.json 
│   └── 📄 server.js         
│
└── 📁 front/                
    ├── 📁 .vscode/          
    ├── 📁 node_modules/     
    ├── 📁 public/           
    │   └── 📁 images/       
    │       ├── 📄 washing_normal.png
    │       ├── 📄 washing_use.gif
    │       └── 📄 washing.svg
    ├── 📁 src/             
    │   ├── 📁 assets/       
    │   ├── 📁 components/   
    │   │   └── 📄 Home.vue  
    │   ├── 📄 App.vue       
    │   ├── 📄 main.js       
    │   └── 📄 style.css     
    ├── 📄 .gitignore        
    ├── 📄 index.html        
    ├── 📄 package.json      
    ├── 📄 package-lock.json
    ├── 📄 postcss.config.js 
    ├── 📄 README.md        
    ├── 📄 tailwind.config.js 
    └── 📄 vite.config.js    

```

### 2. การพัฒนาระบบเครื่องซักผ้าหยอดเหรียญ

- **Front-End:** Vue.js และ Tailwind CSS  
- **Back-End:** Node.js และ Express.js  
- **Database:** MySQL  
- **Tools:** Postman  

### 3. การติดตั้งและรันโปรเจค

#### การติดตั้ง

1. **สร้างโฟลเดอร์ `washing`**  
2. **สร้างฝั่ง Front-End**
   ```bash
   # ติดตั้ง Vue.js
   npm create vite@latest front -- --template react
   cd front

   # ติดตั้ง Tailwind CSS
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   
   npm install ```
   
3. **สร้างฝั่ง Back-End**
   ```bash
   # ติดตั้ง Express.js
   npm install express

   # ติดตั้ง Axios และ Cors
   npm install axios
   npm install cors


### <p> 2. การพัฒนาระบบเครื่องซักผ้าหยอดเหรียญ</p>

<p> Front-End : Vue.js และ Tailwind CSS </p>
<p> Back-End  : Node.js และ Expree.js </p>
<p> Database : Mysql </p>
<p> Tools : Postman </p>

### <p> 3. การติดตั้งและรันโปรเจค</p>

## การติดตั้ง

## 1. สร้าง Folder
```bash
mkdir washing
cd washing
```

## 2. ติดตั้งฝั่ง Front-End 

### ติดตั้ง Tailwind CSS
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### ติดตั้ง Dependencies
```bash
npm install
```

## 3.ติดตั้งฝั่ง Back-End 

### ติดตั้งฝั่ง Express.js
```bash
npm install express
```

### ติดตั้งฝั่ง Axios and Cors
```bash
npm install axios
npm install cors
```

## 4. Database Setup

### Login to MySQL
```bash
mysqlsh -u USERNAME -p
```

### สร้าง Database
```sql
CREATE DATABASE washing;
```

### เลือก Database 
```sql
USE washing;
```

### สร้างตาราง
```sql
CREATE TABLE washing_machines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL DEFAULT 'เครื่องซักผ้า',
    imageNormal VARCHAR(255) DEFAULT '/images/washing_normal.png',
    imageUse VARCHAR(255) DEFAULT '/images/washing_use.gif',
    time INT DEFAULT 120,
    status BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### ลองเพิ่มตัวอย่าง
```sql
INSERT INTO washing_machines (name) VALUES 
('เครื่องซักผ้า 1'),
('เครื่องซักผ้า 2'),
('เครื่องซักผ้า 3');
```


## 5. การรันโปรเจค

### Clone โปรเจคจาก GitHub
1. Clone โปรเจคจาก GitHub มายังเครื่องของคุณ

### รันฝั่ง Front-End
```bash
npm run dev
```

### รันฝั่ง Back-End
```bash
node server.js
```

### ทดสอบ API ด้วย Postman
- ใช้ไฟล์สำหรับทดสอบ API: [API_Document.pdf](https://github.com/user-attachments/files/18468641/API_Document.pdf)

### การทดสอบระบบ
1. หยอดเหรียญเพื่อเริ่มการซักผ้า 20 บาท
2. เพิ่มและลบเครื่องซักผ้า
3. แสดงการนับเวลาถอยหลัง 2 นาที และแจ้งเตือนเมื่อเหลือเวลา 1 นาที
4. ระบบจะรีเซ็ตเมื่อเครื่องซักผ้าทำงานเสร็จ
