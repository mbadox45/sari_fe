<script setup>
    import { onMounted, ref } from 'vue';
    import { useRoute } from 'vue-router';
    import axios from 'axios';

    // API
    import { URL_API } from "@/api/env.js";

    const route = useRoute();
    
    const params = route.params.id;
    const token = localStorage.getItem('usertoken');
    const loading = ref(false)

    const loadData = async() => {
        loading.value = true
        await axios({
            method: 'get',
            url: `${URL_API}request/${params}/pdf`,
            responseType: 'blob', // Important!
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json', 
            },
        })
        .then(response => {
            loading.value = false
            const pdfBlob = response.data;
            const pdfViewer = document.getElementById('pdf-viewer');
            pdfViewer.data = URL.createObjectURL(pdfBlob);
        })
        .catch(error => {
            loading.value = false
            console.error('Error fetching PDF:', error);
        });
    }

    onMounted(() => {
        loadData()
    });

</script>
<template>
    <div class="flex align-items-center py-2 bg-gray-300 h-screen">
        <div class="w-10rem text-center px-3">
            <h6>
                <i class="pi pi-file-pdf text-red-700 text-8xl"></i>
            </h6>
            <Button label="View" icon="pi pi-search" size="" severity="success" text @click="loadData"/>
        </div>
        <div class="w-full" v-show="loading === true">
            <ProgressSpinner aria-label="Loading"/>
            <div class="text-gray-500 font-semibold">Please wait ...</div>
        </div>
        <div class="w-full">
            <object id="pdf-viewer" type="application/pdf" style="width: 100%; height: 97vh;"/>
        </div>
    </div>
</template>