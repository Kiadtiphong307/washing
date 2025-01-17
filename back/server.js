const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let washingMachines = [
  {
    id: 1,
    name: 'เครื่องซักผ้า',
    imageNormal: '/images/washing_normal.png',
    imageUse: '/images/washing_use.gif',
    time: 10,
    status: false
  },
  {
    id: 2,
    name: 'เครื่องซักผ้า',
    imageNormal: '/images/washing_normal.png',
    imageUse: '/images/washing_use.gif',
    time: 10,
    status: false
  }
];

// POST
app.post('/washing', (req, res) => {
  console.log('POST', req.body);
  const newMachine = {
    id: washingMachines.length + 1,
    name: req.body.name || 'เครื่องซักผ้า',
    imageNormal: req.body.imageNormal || '/images/washing_normal.png',
    imageUse: req.body.imageUse || '/images/washing_use.gif',
    time: req.body.time || 10,
    status: false
  };
  washingMachines.push(newMachine);
  res.status(201).json(newMachine);
});

// Get All 
app.get('/washing', (req, res) => {
  console.log('GET', washingMachines);
  res.json(washingMachines);
});

// Get ID
app.get('/washing/:id', (req, res) => {
  console.log('GET ID', req.params.id);
  const id = parseInt(req.params.id);
  const machine = washingMachines.find(m => m.id === id);
  if (machine) {
    res.json(machine);
  } else {
    res.status(404).json({ message: `ไม่พบเครื่องซักผ้าหมายเลข ${id}` });
  }
});

// UPDATE (U) 
app.put('/washing/:id', (req, res) => {
  console.log('UPDATE ', req.params.id);
  const id = parseInt(req.params.id);
  const machineIndex = washingMachines.findIndex(m => m.id === id);
  if (machineIndex !== -1) {
    washingMachines[machineIndex] = {
      ...washingMachines[machineIndex],
      ...req.body,
      id: id
    };
    res.json(washingMachines[machineIndex]);
  } else {
    res.status(404).json({ message: `ไม่พบเครื่องซักผ้าหมายเลข ${id}` });
  }
});

// Post Status  
app.post('/washing/:id/status', (req, res) => {
  console.log('POST Status', req.params.id, req.body.status, req.body.time);
  const id = parseInt(req.params.id);
  const machine = washingMachines.find(m => m.id === id);
  if (machine) {
    machine.status = req.body.status;
    machine.time = req.body.time;
    res.json(machine);
  } else {
    res.status(404).json({ message: `ไม่พบเครื่องซักผ้าหมายเลข ${id}` });
  }
});

// DELETE 
app.delete('/washing/:id', (req, res) => {
  console.log('DELETE', req.params.id);
  const id = parseInt(req.params.id);
  const machineIndex = washingMachines.findIndex(m => m.id === id);
  if (machineIndex !== -1) {
    const deletedMachine = washingMachines.splice(machineIndex, 1);
    res.json({ message: `ลบเครื่องซักผ้าหมายเลข ${id} สำเร็จ`, deletedMachine });
  } else {
    res.status(404).json({ message: `ไม่พบเครื่องซักผ้าหมายเลข ${id}` });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 