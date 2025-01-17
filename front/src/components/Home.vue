<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const washingMachine = ref([])
const API_URL = 'http://localhost:3000'

const fetchWashingMachines = async () => {
  try {
    const response = await axios.get(`${API_URL}/washing`)
    washingMachine.value = response.data
  } catch (error) {
    console.error('Error fetching washing machines:', error)
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
          console.error('Error in timer update:', error)
          clearInterval(timer)
        }
      }, 1000)
    }
  } catch (error) {
    console.error('Error in handleDeposit:', error)
  }
}

const addWashingMachine = async () => {
  try {
    const response = await axios.post(`${API_URL}/washing`, {
      name: 'เครื่องซักผ้า',
      imageNormal: '/images/washing_normal.png',
      imageUse: '/images/washing_use.gif',
      time: 10,
      status: false
    })
    
    if (response.data) {
      washingMachine.value.push(response.data)
    }
  } catch (error) {
    console.error('Error adding washing machine:', error)
  }
}

onMounted(() => {
  fetchWashingMachines()
})
</script>

<template>
  <div class="bg-white">
    <div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24">
      <div class="text-center">
        <div class="text-3xl font-bold tracking-tight">Washing Machine</div>
      </div>

      <div class="flex justify-center mt-4">
        <button 
          @click="addWashingMachine"
          class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          เพิ่มเครื่องซักผ้า
        </button>
      </div>
      
      <div class="mt-6 flex justify-center">
        <div v-for="Washing in washingMachine" :key="Washing.id" class="w-96">
          <img 
            :src="Washing.status ? Washing.imageUse : Washing.imageNormal" 
            class="aspect-square w-full rounded-md object-cover"
          />
          <div class="mt-4">
            <div class="text-center">
              <div class="text-xl text-gray-700">
                {{ Washing.name }} เครื่องที่ : {{ Washing.id }}
              </div>
              <div class="mt-1 text-xl text-red-500">
                {{ Washing.status ? `เวลา: ${Washing.time} วินาที` : 'ว่าง'  }}
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
