<script setup>
    import { ref, defineProps, defineEmits } from 'vue';

    // API
    import {listPrioritas} from '@/api/DataVariable';
    import RequestService from '@/api/RequestService.js';

    // Variable
    const props = defineProps({
        data_dialog:{
            type:Array
        },
    });

    const datas = props.data_dialog;
    const list_prioritas = ref(listPrioritas)
    const form = ref({id:null, prioritas:null, })

    // Emit from ApproveRequest.vue
    const emit = defineEmits(['submit'])

    const postData = async (ket) => {
        if (ket == 'save') {
            if (datas.status === 1) {
                try {
                    const response = await RequestService.approveRequestAtasan(datas.id)
                    const load = response.data;
                    if (load.code == 200) {
                        emit('submit',ket)
                    } else {
                        emit('submit','warning')
                    }
                } catch (error) {
                    emit('submit','failed')
                }
            } else {
                try {
                    if (form.value.prioritas !== null) {
                        const response = await RequestService.approveRequestDept(datas.id, form.value)
                        const load = response.data;
                        if (load.code == 200) {
                            emit('submit',ket)
                        } else {
                            emit('submit','warning')
                        }
                    }
                } catch (error) {
                    emit('submit','failed')
                }
            }
        } else {
            emit('submit','close')
        }
    }

</script>
<template>
    <h3 class="text-center font-semibold">Do you want to approve this request?</h3>
    <div class="flex justify-content-center gap-3 mt-5">
        <Button label="Approve" severity="success" size="small" icon="pi pi-check" @click="postData('save')"/>
        <Button label="Close" severity="danger" size="small" icon="pi pi-times" @click="postData('close')"/>
    </div>
    <Divider align="center" class="mt-5">
        <strong class="font-light">Detail Data</strong>
    </Divider>
    <div class="grid">
        <div class="col-3"><strong class="font-semibold">Requestor</strong></div>
        <div class="col-9">: {{ datas.requestor }}</div>
        <div class="col-3"><strong class="font-semibold">Kategori</strong></div>
        <div class="col-9">: {{ datas.kategori }}</div>
        <div class="col-3"><strong class="font-semibold">Jenis Permintaan</strong></div>
        <div class="col-9">: {{ datas.permintaan }}</div>
        <div class="col-3"><strong class="font-semibold">Jabatan</strong></div>
        <div class="col-9">: {{ datas.jabatan }}</div>
        <div class="col-3"><strong class="font-semibold">Keperluan</strong></div>
        <div class="col-9"><p style="max-width: 600px;">: {{ datas.keperluan }}</p></div>
        <div class="col-3" v-show="datas.status === 2"><strong class="font-semibold">Prioritas</strong></div>
        <div class="col-9" v-show="datas.status === 2"><Dropdown v-model="form.prioritas" :options="list_prioritas" optionLabel="name" optionValue="prioritas" placeholder="Select a Priority" class="w-full"></Dropdown></div>
    </div>
    <!-- <strong>Test</strong> -->
</template>