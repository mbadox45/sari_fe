<script setup>
    import { onMounted, ref } from 'vue';
    
    // Components
    import HomePage from './components/HomePage.vue';
    import DashboardPage from './components/DashboardPage.vue';

    // Var LocalStorage
    const roles = localStorage.getItem('roles');
    const payload = ref(JSON.parse(localStorage.getItem('payload')));
    const dept = ref('');

    onMounted(() => {
        kondisi_user()
    })
    
    const kondisi_user = () => {
        let departemen;
        if (payload.value.department != null) {
            departemen = payload.value.department.department
        } else {
            departemen = payload.value.divisi
        }
        dept.value = departemen;
        console.log(dept.value)
    }
</script>

<template>
    <home-page v-if="dept != 'ICT'"/>
    <dashboard-page v-else/>
</template>
