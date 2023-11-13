<script setup>
    import { onMounted, ref, defineProps, defineEmits } from 'vue';

    // API
    import ProblemService from '@/api/ProblemService';

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

    // Emit from ApproveRequest.vue
    const emit = defineEmits(['submit'])

    const postData = async(ket) => {
        if (ket == 'save') {
            try {
                const response = await ProblemService.executeProblem(datas.id)
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
            emit('submit','close')
        }
    }
</script>
<template>
    <div class="pt-2">
        <h5 class="font-normal text-center"><i class="pi pi-question-circle text-8xl text-red-500"></i></h5>
        <h5 class="font-normal text-center">Do you want to solve this problem?</h5>
        <div class="flex justify-content-center gap-2 mt-5">
            <Button label="Yes" severity="success" size="small" outlined icon="pi pi-check" @click="postData('save')"/>
            <Button label="No" severity="danger" size="small" outlined icon="pi pi-times" @click="postData('close')"/>
        </div>
    </div>
</template>