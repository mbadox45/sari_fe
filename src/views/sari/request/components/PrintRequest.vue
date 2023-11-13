<script setup>
    import { onMounted, ref, defineProps } from 'vue';

    // API
    import RequestService from '@/api/RequestService.js';

    // Variable
    const props = defineProps({
        data_dialog:{
            type:Array
        },
    });
    const datas = props.data_dialog;
    const roles = ref(localStorage.getItem('roles'));
    const pdf = ref()

    const loadData = async() => {
        const response = await RequestService.printRequest(datas.id)
        const load = response.blob;
        pdf.value = load;
    }

    onMounted(() => {
        loadData()
    });

</script>
<template>
    <div class="grid pt-2">
        <div class="col-3"><strong>Requestor</strong></div>
        <div class="col-9">: {{ datas.requestor }}</div>
        <div class="col-12">
            <iframe v-html="pdf" frameborder="0"></iframe>
        </div>
    </div>
</template>