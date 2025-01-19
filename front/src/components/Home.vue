<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const washingMachine = ref([])
const editingMachine = ref(null)
const API_URL = 'http://localhost:3000'

// POST - เพิ่มเครื่องซักผ้า
const addWashingMachine = async () => {
  try {
    const response = await axios.post(`${API_URL}/washing`);
    washingMachine.value.push(response.data);
  } catch (error) {
    console.error('Error adding washing machine:', error);
  }
}

// GET - ดึงข้อมูลทั้งหมด
const fetchWashingMachines = async () => {
  try {
    const response = await axios.get(`${API_URL}/washing`)
    washingMachine.value = response.data
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

// PUT - แก้ไขชื่อเครื่องซักผ้า
const updateMachine = async (machine) => {
  try {
    const response = await axios.put(`${API_URL}/washing/${machine.id}`, {
      name: machine.name
    });
    const index = washingMachine.value.findIndex(m => m.id === machine.id);
    if (index !== -1) {
      washingMachine.value[index] = response.data;
    }
    editingMachine.value = null;
  } catch (error) {
    console.error('Error updating washing machine:', error);
  }
}

// DELETE - ลบเครื่องซักผ้า
const deleteMachine = async (id) => {
  if (!confirm('ต้องการลบเครื่องซักผ้านี้หรือไม่?')) return;
  
  try {
    await axios.delete(`${API_URL}/washing/${id}`);
    washingMachine.value = washingMachine.value.filter(m => m.id !== id);
  } catch (error) {
    console.error('Error deleting washing machine:', error);
  }
}

const handleDeposit = async (machineId) => {
  try {
    const machine = washingMachine.value.find(m => m.id === machineId);
    if (!machine) return;
    
    if (machine.coin < 20) {
      alert(`กรุณาหยอดเหรียญให้ครบ 20 บาท (ขาดอีก ${20 - machine.coin} บาท)`);
      return;
    }

    // เริ่มการทำงาน
    const startResponse = await axios.post(`${API_URL}/washing/${machineId}/status`, {
      status: true,
      time: 120
    });

    if (startResponse.data) {
      const index = washingMachine.value.findIndex(m => m.id === machineId);
      washingMachine.value[index] = startResponse.data;

      let remainingTime = 120;
      const countDown = setInterval(async () => {
        try {
          if (remainingTime <= 0) {
            clearInterval(countDown);
            const stopResponse = await axios.post(`${API_URL}/washing/${machineId}/status`, {
              status: false,
              time: 0
            });
            washingMachine.value[index] = stopResponse.data;
            // รีโหลดหน้าเว็บเมื่อเครื่องทำงานเสร็จ
            window.location.reload();
            return;
          }

          remainingTime--;
          
          const updateResponse = await axios.post(`${API_URL}/washing/${machineId}/status`, {
            status: true,
            time: remainingTime
          });

          if (updateResponse.data) {
            washingMachine.value[index] = {
              ...updateResponse.data,
              status: true,
              time: remainingTime
            };
          }
        } catch (error) {
          console.error('Error in countdown:', error);
          clearInterval(countDown);
        }
      }, 1000);
    }
  } catch (error) {
    console.error('Error in handleDeposit:', error);
  }
};

// เพิ่มฟังก์ชันสำหรับหยอดเหรียญ
const handleCoin = async (machineId, value) => {
  try {
    const response = await axios.post(`${API_URL}/washing/${machineId}/coin`, {
      value: value
    });
    
    // อัพเดทข้อมูลเครื่องในหน้าจอ
    const index = washingMachine.value.findIndex(m => m.id === machineId);
    if (index !== -1) {
      washingMachine.value[index] = response.data;
    }
  } catch (error) {
    console.error('Error adding coin:', error);
  }
};

onMounted(() => {
  fetchWashingMachines()
})
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold text-center mb-6">Washing Machine</h1>
    
    <!-- ปุ่มเพิ่มเครื่องซักผ้า -->
    <div class="text-center mb-6">
      <button @click="addWashingMachine" 
              class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
        เพิ่มเครื่องซักผ้า
      </button>
    </div>

    
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div v-for="Washing in washingMachine" 
           :key="Washing.id" 
           class="border rounded-lg p-6 relative bg-white shadow-md">
        <!-- ปุ่มลบ -->
        <button 
          @click="deleteMachine(Washing.id)"
          class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700"
        >
          ×
        </button>
        
        <img 
          :src="Washing.status ? Washing.imageUse : Washing.imageNormal" 
          class="aspect-square w-full rounded-md object-cover"
        />
        
        <div class="mt-4">
          <div class="text-center">
           
            <div v-if="editingMachine === Washing.id" class="flex gap-2 justify-center">
              <input 
                v-model="Washing.name"
                class="border rounded px-2 py-1"
                @keyup.enter="updateMachine(Washing)"
              />
              <button 
                @click="updateMachine(Washing)"
                class="bg-green-500 text-white px-2 rounded"
              >
                บันทึก
              </button>
            </div>
            <div v-else class="text-xl text-gray-700">
              <span @click="editingMachine = Washing.id" class="cursor-pointer">
                {{ Washing.name }} เครื่องที่ : {{ Washing.id }}
              </span>
            </div>
            
            <div class="mt-1 text-xl text-red-500 pb-2">
              {{ Washing.status ? `เวลา: ${Washing.time} วินาที` : 'ว่าง' }}
            </div>
          </div>
        </div>
        
        <!-- แสดงจำนวนเงิน -->
        <div class="bg-gray-100 p-3 rounded-lg mb-4">
          <p class="text-lg font-semibold">เงินที่หยอด: {{ Washing.coin }} บาท</p>
          <p v-if="Washing.coin < 20" class="text-red-500">
            ต้องการอีก: {{ 20 - Washing.coin }} บาท
          </p>
          <p v-else class="text-green-500">
            พร้อมใช้งาน!
          </p>
        </div>

        <!-- ปุ่มหยอดเหรียญ -->
        <div v-if="!Washing.status" class="flex justify-center gap-2 mb-4">
          <button 
            @click="handleCoin(Washing.id, 5)"
            :disabled="Washing.coin >= 20"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            หยอด 5 บาท
          </button>
          <button 
            @click="handleCoin(Washing.id, 10)"
            :disabled="Washing.coin >= 20"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            หยอด 10 บาท
          </button>
        </div>

        <!-- ปุ่มเริ่มทำงาน -->
        <button 
          @click="handleDeposit(Washing.id)"
          :disabled="Washing.status || Washing.coin < 20"
          :class="[
            'w-full font-bold py-2 px-4 rounded',
            Washing.status || Washing.coin < 20
              ? 'bg-gray-500 cursor-not-allowed' 
              : 'bg-green-500 hover:bg-green-700 text-white'
          ]"
        >
          {{ Washing.status ? 'กำลังทำงาน' : 'เริ่มทำงาน' }}
        </button>
      </div>
    </div>
  </div>
</template>
