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
    <div class="grid">
        <div class="col-3"><strong>Requestor</strong></div>
        <div class="col-9">: <strong>{{ datas.requestor }}</strong></div>
        <div class="col-3"><strong>Office</strong></div>
        <div class="col-9">: {{ datas.office }}</div>
        <div class="col-3"><strong>Position</strong></div>
        <div class="col-9">: {{ datas.jabatan }}</div>
        <div class="col-3"><strong>Phone Number</strong></div>
        <div class="col-9">: {{ datas.nohp }}</div>
        <div class="col-3"><strong>Category</strong></div>
        <div class="col-9">: {{ datas.kategori }}</div>
        <div class="col-3"><strong>Request Type</strong></div>
        <div class="col-9">: {{ datas.permintaan }}</div>
        <div class="col-3"><strong>Necessary</strong></div>
        <div class="col-9"><p style="max-width: 600px;">: {{ datas.keperluan }}</p></div>
        <div class="col-3"><strong>Remark</strong></div>
        <div class="col-9"><p style="max-width: 600px;">: {{ datas.remark }}</p></div>
    </div>
    <Divider/>
    <div class="grid">
        <div class="col-3"><strong>Executor</strong></div>
        <div class="col-9">: <strong>{{ datas.executor }}</strong></div>
        <div class="col-3"><strong>Info</strong></div>
        <div class="col-9">: {{ datas.keterangan || '-' }}</div>
        <!-- <div class="col-9">: {{ datas.keterangan == null ? '-' : datas.keterangan }}</div> -->
    </div>
</template>