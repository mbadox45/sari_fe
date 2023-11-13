<script setup>
import { onMounted, ref } from 'vue';

// API
import {menu_ict_executor, menu_ict_approver, menu_approver_after_grade_3, menu_user_requester, menu_user_approver} from '@/api/DataVariable';

// Components
import AppMenuItem from './AppMenuItem.vue';

const payload = ref(JSON.parse(localStorage.getItem('payload')));
const token = localStorage.getItem('usertoken');
const roles = localStorage.getItem('roles');
const dept = ref('')

const model = ref([]);

onMounted(() => {
    token;
    load();
    Menu();
});

const Menu = () => {
    console.log(payload.value)
    
    // Kondisi department menggunakan number atau string
    if (payload.value.department !== null) {
        dept.value = payload.value.department.department;
    } else {
        dept.value = payload.value.divisi;
    }

    if (Number(payload.value.grade) > 3) {
        model.value = menu_approver_after_grade_3;
    } else if (Number(payload.value.grade) == 3) {
        model.value = menu_ict_approver;
    } else {
        model.value = menu_ict_executor;
    }

    // if (dept.value == 'ICT') {
    //     if (Number(payload.value.grade) >= 3 && Number(payload.value.grade) <= 4) {
    //         model.value = menu_ict_approver;
    //     } else {
    //         model.value = menu_ict_executor;
    //     }
    // } else {
    //     if (Number(payload.value.grade) >= 3 ) {
    //         model.value = menu_user_approver;
    //     } else {
    //         model.value = menu_user_requester;
    //     }
    // }
}

const load = () => {
    // console.log(token.value)
}
</script>

<template>
    <ul class="layout-menu">
        <li class="mb-3 text-center">
            <Avatar image="/distributor.png" class="bg-red-100 mt-3" size="xlarge" shape="circle" />
            <!-- <img src="/layout/inl.png" alt="PT Industri Nabati Lestari" class="w-6 mt-3" /> -->
        </li>
        <li class="text-center">
            <strong>{{ payload.name }}</strong>
        </li>
        <li class="text-center mb-3">
            <span>{{ payload.email }}</span>
        </li>
        <li class="text-center">
            <strong class="font-semibold text-cyan-600">DIVISI<i class="pi pi-angle-double-right mx-2"></i>{{ dept.toUpperCase() }}</strong>
            <!-- <strong class="font-semibold text-cyan-600">DIVISI<i class="pi pi-angle-double-right mx-2"></i>{{ payload.division.divisi.toUpperCase() }}</strong> -->
        </li>
        <Divider class="my-5" />
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
