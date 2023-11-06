<script setup>
    import { onMounted, ref, defineProps } from 'vue';

    // Variable
    const props = defineProps({
        data_dialog:{
            type:Array
        },
    });
    const datas = props.data_dialog;
    const roles = ref(localStorage.getItem('roles'));

    const loadData = async() => {
        console.log(datas);
    }

    loadData();
</script>
<template>
    <div class="grid pt-2">
        <div class="col-3"><strong>Requestor</strong></div>
        <div class="col-9">:</div>
        <div class="col-3"><strong>Jabatan</strong></div>
        <div class="col-9">:</div>
        <div class="col-3"><strong>No. HP</strong></div>
        <div class="col-9">:</div>
        <div class="col-3"><strong>Kategori</strong></div>
        <div class="col-9">:</div>
        <div class="col-3"><strong>Jenis Permintaan</strong></div>
        <div class="col-9">:</div>
        <div class="col-3"><strong>Keperluan</strong></div>
        <div class="col-9">:</div>
        <div class="col-3"><strong>YBS</strong></div>
        <div class="col-9">:</div>
        <div class="col-3"><strong>Atasan YBS</strong></div>
        <div class="col-9">:</div>
        <div class="col-3"><strong>SPV/MGR Maintenance</strong></div>
        <div class="col-9">:</div>
        <div class="col-3"><strong>Eksekutor</strong></div>
        <div class="col-9">:</div>
    </div>
</template>