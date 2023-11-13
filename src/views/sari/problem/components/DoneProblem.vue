<script setup>
    import { onMounted, ref, defineProps, defineEmits } from 'vue';

    // API
    import ProblemService from '@/api/ProblemService';

    // Variable
    const props = defineProps({
        data_dialog:{
            type:Array
        },
        status_request:{
            type:String
        },
    });
    const datas = props.data_dialog;
    const status_data = props.status_request;
    const roles = ref(localStorage.getItem('roles'));

    const form = ref({id:datas.id, keterangan:'', })

    const emit = defineEmits(['submit'])

    const loadData = async() => {
        console.log(datas);
    }

    loadData();

    const postData = async (ket) => {
        if (status_data === 'done') {
            if (ket == 'save_done') {
                try {
                    if (form.value.keterangan !== '') {
                        const response = await ProblemService.doneProblem(datas.id, form.value)
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
            } else {
                emit('submit','close')
            }
        } else if (status_data === 'cancel') {
            if (ket == 'save_cancel') {
                try {
                    if (form.value.keterangan !== '') {
                        const response = await ProblemService.cancelProblem(datas.id, form.value)
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
            } else {
                emit('submit','close')
            }
        } else {
            if (ket == 'save_decline') {
                try {
                    if (form.value.keterangan !== '') {
                        const response = await ProblemService.declineProblem(datas.id, form.value)
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
            } else {
                emit('submit','close')
            }
        }
    }
</script>
<template>
    <div class="grid">
        <div class="col-3"><strong>Requestor</strong></div>
        <div class="col-9">: {{ datas.requestor }}</div>
        <div class="col-3"><strong>Office</strong></div>
        <div class="col-9">: {{ datas.office }}</div>
        <div class="col-3"><strong>Jabatan</strong></div>
        <div class="col-9">: {{ datas.jabatan }}</div>
        <div class="col-3"><strong>No. HP</strong></div>
        <div class="col-9">: {{ datas.nohp }}</div>
        <div class="col-3"><strong>Kategori</strong></div>
        <div class="col-9">: {{ datas.kategori }}</div>
        <div class="col-3"><strong>Jenis Permintaan</strong></div>
        <div class="col-9">: {{ datas.permintaan }}</div>
        <div class="col-3"><strong>Keperluan</strong></div>
        <div class="col-9"><p style="max-width: 600px;">: {{ datas.keperluan }}</p></div>
        <div class="col-3"><strong>Remark</strong></div>
        <div class="col-9"><p style="max-width: 600px;">: {{ datas.remark }}</p></div>
        <div class="col-3"><strong>Keterangan</strong></div>
        <div class="col-9 p-fluid">
            <Textarea v-model="form.keterangan" rows="3" cols="30" />
        </div>
        <div class="col-12">
            <div class="flex justify-content-end gap-2">
                <Button label="Done" severity="success" size="small" v-if="status_data === 'done'" icon="pi pi-check" @click="postData('save_done')"/>
                <Button label="Done" severity="success" size="small" v-else-if="status_data === 'cancel'" icon="pi pi-check" @click="postData('save_cancel')"/>
                <Button label="Done" severity="success" size="small" v-else icon="pi pi-check" @click="postData('save_decline')"/>
                <Button label="Close" severity="secondary" size="small" outlined icon="pi pi-times" @click="postData('close')"/>
            </div>
        </div>
    </div>
</template>