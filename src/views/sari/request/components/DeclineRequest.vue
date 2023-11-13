<script setup>
    import { onMounted, ref, defineProps, defineEmits } from 'vue';

    // API
    import {listPrioritas} from '@/api/DataVariable';

    // Variable
    const props = defineProps({
        data_dialog:{
            type:Array
        },
        status:{
            type:String
        },
    });
    const datas = props.data_dialog;
    const status_submit = props.status;

    const form = ref({id:null, keterangan:'', })

    // Emit from ApproveRequest.vue
    const emit = defineEmits(['submit'])

    const postData = (ket) => {
        if (ket == 'save') {
            // Insert your API
            if (status_submit === 'cancel') {
                emit('submit',ket)
            } else {
                emit('submit',ket)
            }
        } else {
            emit('submit','close')
        }
    }

</script>
<template>
    <div class="grid">
        <div class="col-3"><strong>Requestor</strong></div>
        <div class="col-9">: {{ datas.requestor }}</div>
        <div class="col-3"><strong>Kategori</strong></div>
        <div class="col-9">: {{ datas.kategori }}</div>
        <div class="col-3"><strong>Jenis Permintaan</strong></div>
        <div class="col-9">: {{ datas.permintaan }}</div>
        <div class="col-3"><strong>Jabatan</strong></div>
        <div class="col-9">: {{ datas.jabatan }}</div>
        <div class="col-3"><strong>Keperluan</strong></div>
        <div class="col-9"><p style="max-width: 600px;">: {{ datas.keperluan }}</p></div>
        <div class="col-3"><strong>Keterangan</strong></div>
        <div class="col-9 p-fluid"><Textarea v-model="form.keterangan" rows="5" cols="30" /></div>
        <div class="col-12">
            <div class="flex justify-content-end gap-2">
                <Button label="Submit" severity="success" size="small" icon="pi pi-save" @click="postData('save')"/>
                <Button label="Close" severity="secondary" size="small" outlined icon="pi pi-times" @click="postData('close')"/>
            </div>
        </div>
    </div>
    <!-- <strong>Test</strong> -->
</template>