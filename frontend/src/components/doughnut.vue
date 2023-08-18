<template>
    <Doughnut id="my-chart-id" :options="chartOptions" :data="chartData" />
</template>
 
<script lang="ts" setup>
import { ref, onMounted, PropType } from 'vue'
import {
    Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData, Title, BarElement, CategoryScale, LinearScale
} from 'chart.js'
import { Doughnut } from 'vue-chartjs'

ChartJS.register(ArcElement, Tooltip, Legend);
type Department = {
    name: string;
    size: number;
};
const chartOptions = {
    responsive: true
}
const chartData = ref<ChartData<'doughnut'>>({
    labels: ["hooray", "yipee"],
    datasets: [{ data: [15, 20], backgroundColor: ["#00ffff", "#ff0000"] }]
});

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

onMounted(async () => {
    console.log(props.userdata);
    // Create a new array with objects containing department name and size
    if (props.userdata.departments == null)
        return;
    const departmentsWithSize: Department[] = Object.entries(props.userdata.departments).map(([name, size]) => ({
        name,
        size: size as number, // Cast size to number to satisfy TypeScript
    }));

    // Sort the array in descending order based on size (largest to smallest)
    departmentsWithSize.sort((a: Department, b: Department) => b.size - a.size);
    let newData: ChartData<'doughnut'> = {
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

    // Set the chart data
    newData.labels = departmentsWithSize.map((dept) => dept.name); //Object.keys(data.departments);
    newData.datasets[0].data = departmentsWithSize.map((dept) => dept.size); //Object.values(data.departments);
    chartData.value = newData;
});
</script>
 