<script setup>
    import { ref, defineProps, defineEmits } from 'vue';

    // API
    import {listAction} from '@/api/DataVariable';
    import RequestService from '@/api/RequestService.js';

    // Variable
    const props = defineProps({
        data_dialog:{
            type:Array
        },
        status_data:{
            type:String
        },
    });

    const datas = props.data_dialog;
    const statusData = props.status_data;
    const list_prioritas = ref([])
    const form = ref({id:null, action:null, keterangan:''})

    // Emit from ApproveRequest.vue
    const emit = defineEmits(['submit'])

    const load_data = () => {
        if (statusData == 'execute') {
            form.value.action = 1;
        } else if (statusData == 'pending') {
            form.value.action = 2;
        } else if (statusData == 'done') {
            form.value.action = 3;
        } else {
            form.value.action = 4;
        }
    }
    load_data()

    const postData = async (ket) => {
        if (ket == 'save') {
            try {
                if (statusData == 'pending' || statusData == 'done') {
                    if (form.value.keterangan != '') {
                        const response = await RequestService.executeRequestDept(datas.id, form.value)
                        const load = response.data;
                        if (load.code == 200) {
                            if (form.value.action == 2) {
                                emit('submit','pending');
                            } else {
                                emit('submit','done');
                            }
                        } else {
                            emit('submit','failed')
                        }
                    } else {
                        emit('submit','warning')
                    }
                } else if (statusData == 'reject') {
                    if (form.value.keterangan != '') {
                        const response = await RequestService.cancelRequestDept(datas.id, form.value)
                        const load = response.data;
                        if (load.code == 200) {
                            emit('submit','reject');
                        } else {
                            emit('submit','failed')
                        }
                    } else {
                        emit('submit','warning')
                    }
                } else {
                    const response = await RequestService.executeRequestDept(datas.id, form.value)
                    const load = response.data;
                    if (load.code == 200) {
                        emit('submit','execute')
                    } else {
                        emit('submit','failed')
                    }
                }
            } catch (error) {
                emit('submit','failed')
            }
        } else {
            emit('submit','close')
        }
    }

</script>
<template>
    <h3 class="text-center font-semibold">Do you want to {{statusData}} this request?</h3>
    <Divider align="center" class="mt-5">
        <strong class="font-light">Detail Data</strong>
    </Divider>
    <div class="grid">
        <div class="col-3"><strong class="font-semibold">Requestor</strong></div>
        <div class="col-9">: {{ datas.requestor }}</div>
        <div class="col-3"><strong class="font-semibold">Category</strong></div>
        <div class="col-9">: {{ datas.kategori }}</div>
        <div class="col-3"><strong class="font-semibold">Request Type</strong></div>
        <div class="col-9">: {{ datas.permintaan }}</div>
        <div class="col-3"><strong class="font-semibold">Position</strong></div>
        <div class="col-9">: {{ datas.jabatan }}</div>
        <div class="col-3"><strong class="font-semibold">Necessary</strong></div>
        <div class="col-9"><p style="max-width: 600px;">: {{ datas.keperluan }}</p></div>
        <!-- <div class="col-3"><strong class="font-semibold">Action</strong></div>
        <div class="col-9"><Dropdown v-model="form.action" :options="list_prioritas" optionLabel="name" optionValue="aksi" placeholder="Select a Action" class="w-full"></Dropdown></div> -->
        <div class="col-3" v-show="form.action != 1 && form.action != null"><strong class="font-semibold">Info</strong></div>
        <div class="col-9" v-show="form.action != 1 && form.action != null"><Textarea v-model="form.keterangan" rows="3" cols="30" class="w-full" /></div>
    </div>
    <div class="flex justify-content-center gap-3 mt-5">
        <Button :label="statusData == 'execute' ? 'Execute' : statusData == 'done' ? 'Finish' : statusData == 'pending' ? 'Pending' : 'Reject'" :severity="statusData == 'reject' ? 'danger' : 'success'" size="small" :icon="statusData == 'execute' ? 'pi pi-play' : statusData == 'done' ? 'pi pi-check' : statusData == 'pending' ? 'pi pi-pause' : 'pi pi-trash'" @click="postData('save')"/>
        <Button label="Close" severity="secondary" size="small" icon="pi pi-times" @click="postData('close')"/>
    </div>
    <!-- <strong>Test</strong> -->
</template>