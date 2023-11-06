<script setup>
    import { onMounted, ref, defineProps, defineEmits } from 'vue';

    // API
    import {listPrioritas} from '@/api/DataVariable';

    const list_prioritas = ref(listPrioritas)
    const form = ref({id:null, keterangan:'', })

    // Emit from ApproveRequest.vue
    const emit = defineEmits(['submit'])

    const postData = (ket) => {
        if (ket == 'save') {
            // Insert your API
            emit('submit',ket)
        } else {
            emit('submit','close')
        }
    }

</script>
<template>
    <div class="grid">
        <div class="col-3"><strong>Requestor</strong></div>
        <div class="col-9">: Test</div>
        <div class="col-3"><strong>Kategori</strong></div>
        <div class="col-9">: Test</div>
        <div class="col-3"><strong>Jenis Permintaan</strong></div>
        <div class="col-9">: Test</div>
        <div class="col-3"><strong>Jabatan</strong></div>
        <div class="col-9">: Test</div>
        <div class="col-3"><strong>Keperluan</strong></div>
        <div class="col-9"><p style="max-width: 600px;">: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam semper diam at erat pulvinar, at pulvinar felis blandit. Vestibulum volutpat tellus diam, consequat gravida libero rhoncus ut. Maecenas imperdiet felis nisi, fringilla luctus felis hendrerit sit amet. Pellentesque interdum, nisl nec interdum maximus, augue diam porttitor lorem, et sollicitudin felis neque sit amet erat.</p></div>
        <div class="col-3"><strong>Prioritas</strong></div>
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