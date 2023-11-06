<script setup>
    import { onMounted, ref } from 'vue';
    
    // Components
    import HomePage from './components/HomePage.vue';
    import DashboardPage from './components/DashboardPage.vue';

    // Var LocalStorage
    const roles = localStorage.getItem('roles');
    const payload = ref(JSON.parse(localStorage.getItem('payload')));
    
</script>

<template>
    <home-page v-if="payload.department.department != 'ICT'"/>
    <dashboard-page v-else/>
</template>
