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
    const machine = washingMachine.value.find(m => m.id === machineId)
    if (!machine || machine.status) return
    
    const response = await axios.post(`${API_URL}/washing/${machineId}/status`, {
      status: true,
      time: 10
    })
    
    if (response.data) {
      machine.status = true
      machine.time = 10
      
      const timer = setInterval(async () => {
        try {
          if (machine.time > 0) {
            machine.time--
            await axios.post(`${API_URL}/washing/${machineId}/status`, {
              status: true,
              time: machine.time
            })
          } else {
            await axios.post(`${API_URL}/washing/${machineId}/status`, {
              status: false,
              time: 10
            })
            machine.status = false
            machine.time = 10
            clearInterval(timer)
          }
        } catch (error) {
          console.error('Error in timer:', error)
          clearInterval(timer)
        }
      }, 1000)
    }
  } catch (error) {
    console.error('Error in handleDeposit:', error)
  }
}

onMounted(() => {
  fetchWashingMachines()
})
</script>

<template>
  <div class="bg-white">
    <div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24">
      <div class="text-center items-center mb-8">
        <h1 class="text-3xl font-bold tracking-tight">Washing Machine</h1>

        <div class="flex justify-center mt-4">
          <button 
            @click="addWashingMachine"
            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          เพิ่มเครื่องซักผ้า
        </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="Washing in washingMachine" :key="Washing.id" 
          class="border rounded-lg p-4 relative"
        >
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
              <!-- ส่วนแก้ไขชื่อ -->
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
              
              <div class="mt-1 text-xl text-red-500">
                {{ Washing.status ? `เวลา: ${Washing.time} วินาที` : 'ว่าง' }}
              </div>
            </div>
          </div>
          
          <div class="mt-4 flex justify-center">
            <button 
              @click="handleDeposit(Washing.id)"
              :disabled="Washing.status"
              :class="[
                'font-bold py-2 px-4 rounded',
                Washing.status 
                  ? 'bg-red-500 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-700 text-white'
              ]"
            >
              {{ Washing.status ? 'กำลังทำงาน' : 'หยอดเงิน' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
