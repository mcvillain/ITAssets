<template>
   <Bar id="reportingTo" :options="chartOptions" :data="chartData" />
</template>
 
<script lang="ts" setup>
import { ref, onMounted, PropType } from 'vue'
import {
   Chart as ChartJS, Tooltip, Legend, ChartData, Title, BarElement, CategoryScale, LinearScale
} from 'chart.js'
import { Bar } from 'vue-chartjs'

ChartJS.register(Tooltip, Legend, Title, BarElement, CategoryScale, LinearScale);

type UsersResponse = {
   departments: {
      key: string,
      value: number,
   } | null,
   totalUsers: number | null,
   serviceAccounts: number | null,
   title: {
      key: string,
      value: number,
   } | null,
   manager: {
      key: string,
      value: number,
   } | null,
}

const props = defineProps({
   userdata: {
      type: Object as PropType<UsersResponse>,
      required: true
   }
});

type Manager = {
   name: string;
   size: number;
};

const chartOptions = {
   responsive: true,
   plugins: {
      legend: {
         display: false
      }
   }
}
const chartData = ref<ChartData<'bar'>>({
   labels: [],
   datasets: [{ data: [], backgroundColor: ["#00ffff", "#ff0000",] }]
})

onMounted(async () => {
   if (props.userdata.manager == null)
      return;
   let newData: ChartData<'bar'> = {
      labels: [],
      datasets: [{
         data: [], backgroundColor: [
            "#a70000",
            "#ca0000",
            "#ff0000",
            "#fa2b2b",
            "#ff5252",
            "#ff6969",
            "#ff7b7b",
            "#ff9494",
            "#ffbaba",
            "#ffd6d6",
            "lime"
         ]
      }]
   }
   const managersWithSize: Manager[] = Object.entries(props.userdata.manager).filter(d => d[0] != "null" && props.userdata.totalUsers != 0).map(([name, size]) => ({
      name,
      size: size as number, // Cast size to number to satisfy TypeScript
   }));
   managersWithSize.sort((a: Manager, b: Manager) => b.size - a.size);

   //console.log(chartData.value)
   newData.labels = managersWithSize.map((manager) => manager.name); //Object.keys(data.manager).filter(label => label != "null");
   newData.datasets[0].data = managersWithSize.map((manager) => manager.size); //Object.values(data.manager).filter(data => data != 0) as [];
   chartData.value = newData;
});
</script>