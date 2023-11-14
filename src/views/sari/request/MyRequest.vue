<script setup>
    import { onMounted, ref } from 'vue';
    import { useRouter } from 'vue-router';
    import moment from 'moment';
    import { useToast } from 'primevue/usetoast';

    // API
    import RequestService from '@/api/RequestService.js';
    import {listStatus} from '@/api/DataVariable.js';
    import { URL_WEB } from '@/api/env';

    
    // Component
    import DetailRequest from './components/DetailRequest.vue';
    import DeclineRequest from './components/DeclineRequest.vue';
    import FormsRequest from './components/FormsRequest.vue';

    const router = useRouter();

    const dialogs = ref(false)
    const loadingTable = ref(null);
    const loadingTable2 = ref(true);
    const list_status = ref(listStatus)
    const request_data = ref([])
    const menuModel = ref([]);
    const cm = ref();
    const selectedRequest = ref({status:null, id:null});
    const titledialogs = ref();
    const statusRequest = ref('');

    const toast = useToast();

    onMounted(() => {
        aksi()
    });
    

    const aksi = async () => {
        loadingTable.value = 'Loading'
        try {
            const response = await RequestService.getRequest();
            const load = response.data;
            const data = load.data;
            // console.log(load);
            
            if (data.length > 0) {
                loadingTable.value = null;
                loadingTable2.value = false;
            } else {
                loadingTable2.value = false;
                loadingTable.value = 'Data not found';
            }

            const list = [];
            for (let i = 0; i < data.length; i++) {
                // const status_tiket = list_status.value.find(a => a.id === Number(data[i].status) )
                // const atasan = data[i].atasan.name;
                list[i] = {
                    id : data[i].id,
                    nomor : data[i].no_wo,
                    requestor : data[i].user.name,
                    jabatan : data[i].user.jabatan,
                    nohp : data[i].user.noHP,
                    tgl : moment(data[i].created_at).format('DD MMM YYYY'),
                    keperluan: data[i].keperluan,
                    atasan_id: Number(data[i].atasan_id),
                    office: data[i].office,
                    id_kategori: Number(data[i].category.id_kategori),
                    kategori: data[i].category.nama_kategori,
                    permintaan: data[i].category.nama_permintaan,
                    id_permintaan: data[i].category.id,
                    keterangan: data[i].info,
                    atasan: data[i].atasan.name,
                    status: Number(data[i].status),
                }
            }
            request_data.value = list;
        } catch (error) {
            loadingTable2.value = false;
            request_data.value = []
            console.log(error)
        }
    }

    // Context Menu Table
    const onRowContextMenu = (event) => {
        cm.value.show(event.originalEvent);
        // console.log(selectedRequest.value)
        loadMenu();
    };
    const loadMenu = () => {
        if (selectedRequest.value.status > 3) {
            menuModel.value = [
                {label: 'View', icon: 'pi pi-fw pi-search', command: () => detailData(selectedRequest.value, 'detail')},
                {label: 'Print', icon: 'pi pi-fw pi-print', command: () => {window.open(URL_WEB+'print/'+selectedRequest.value.id)}},
            ]
        } else {
            menuModel.value = [
                {label: 'View', icon: 'pi pi-fw pi-search', command: () => detailData(selectedRequest.value, 'detail')},
                {label: 'Print', icon: 'pi pi-fw pi-print', command: () => {window.open(URL_WEB+'print/'+selectedRequest.value.id)}},
                {separator:true},
                {label: 'Edit', icon: 'pi pi-fw pi-pencil', command: () => detailData(selectedRequest.value, 'edit')},
                {label: 'Cancel', icon: 'pi pi-fw pi-times', command: () => detailData(selectedRequest.value, 'cancel')},
            ]
        }
    }

    // Dialog Function
    const detailData = async(data, status) => {
        dialogs.value = true;
        statusRequest.value = status;
        if (status === 'detail') {
            titledialogs.value = `<span class="font-semibold">VIEW DETAIL</span> <i class="pi pi-angle-double-right mx-2 text-lg"></i> ${data.nomor}`;
        } else if (status === 'add') {
            titledialogs.value = `<span class="font-semibold text-primary">ADD REQUEST</span>`;
        } else if (status === 'edit') {
            titledialogs.value = `<span class="font-semibold text-primary">EDIT REQUEST</span> <i class="pi pi-angle-double-right mx-2 text-lg"></i> ${data.nomor}`;
        } else if (status === 'approve') {
            titledialogs.value = `<span class="font-semibold text-cyan-500">APPROVE REQUEST</span> <i class="pi pi-angle-double-right mx-2 text-lg"></i> ${data.nomor}`;
        } else {
            titledialogs.value = `<span class="font-semibold text-red-500">DECLINE REQUEST</span> <i class="pi pi-angle-double-right mx-2 text-lg"></i> ${data.nomor}`;
        }
    }

    const rowClass = (data) => {
        return [ data.status == 5 ? 'bg-primary' : data.status == 6 ? 'text-green-500 font-semibold' : data.status == 4 ? 'text-orange-500 font-semibold' : data.status == 3 ? 'text-cyan-500 font-semibold' : data.status == 2 ? 'text-cyan-500 font-semibold' : data.status == 0 ? 'bg-red-500 text-white' : ''];
    };

    const actionDialog = (status) => {
        if (status == 'add') {
            dialogs.value = false
            toast.add({ severity: 'success', summary: 'Successfully', detail: `Created successfully`, life: 3000 });
            aksi()
        } else if (status == 'edit') {
            dialogs.value = false
            toast.add({ severity: 'success', summary: 'Successfully', detail: `Updated successfully`, life: 3000 });
            aksi()
        } else if (status == 'warning') {
            toast.add({ severity: 'warn', summary: 'Failed', detail: `Please data not empty !`, life: 3000 });
        } else if (status == 'save') {
            dialogs.value = false
            toast.add({ severity: 'danger', summary: 'Error', detail: `Please contact the IT team`, life: 3000 });
            aksi()
        } else{
            dialogs.value = false
        }
    }

</script>

<template>
    <div class="grid align-items-center">
        <Toast/>
        <Dialog v-model:visible="dialogs" :style="{ width: '1100px' }" :draggable="false" :modal="true">
            <template #header>
                <h4 class="font-normal" v-html="titledialogs"></h4>
            </template>
            <detail-request :data_dialog="selectedRequest" v-if="statusRequest === 'detail'"/>
            <decline-request :data_dialog="selectedRequest" :status="statusRequest" v-else-if="statusRequest === 'cancel'" @submit="actionDialog"/>
            <forms-request :data_dialog="selectedRequest" :status="statusRequest" v-else @submit="actionDialog"/>
        </Dialog>
        <div class="col-12 md:col-12">
            <div class="flex align-items-center justify-content-end md:justify-content-between">
                <div>
                    <i class="mx-2 text-5xl pi pi-ticket"></i>
                    <strong class="text-5xl font-normal">My Request</strong>
                </div>
                <div class="hidden md:block">
                    <strong class="text-500 font-light">Request <i class="pi pi-angle-double-right mx-2"></i> My Request</strong>
                </div>
            </div>
        </div>
        <div class="col-12 md:col-12">
            <div class="card">
                <div class="flex justify-content-between align-items-center">
                    <div>
                        <h6 class="text-2xl">Table Request</h6>
                    </div>
                    <div>
                        <Button label="Add Request" size="small" icon="pi pi-plus" outlined severity="info" @click="detailData([],'add')"/>
                    </div>
                </div>
                <Divider/>
                <!-- <h6 class="text-center"> -- Not Found --</h6> -->
                <ContextMenu ref="cm" :model="menuModel" />
                <DataTable :value="request_data" paginator :rows="10" :rowClass="rowClass" contextMenu v-model:contextMenuSelection="selectedRequest" @rowContextmenu="onRowContextMenu" tableStyle="min-width: 50rem">
                    <!-- <template #loading> 
                        <div class="my-2">
                            <p>Loading, Please wait....</p> 
                        </div>
                    </template> -->
                    <template #empty><p class="text-center"> Data not found. </p></template>
                    <Column field="tgl" header="Date" class="min-w-10"></Column>
                    <Column field="kategori" header="Category" class="min-w-10"></Column>
                    <Column field="permintaan" header="Request Type" class="min-w-10"></Column>
                    <Column field="keterangan" header="Status" class="min-w-10"></Column>
                    <Column field="keperluan" header="Necessary" class="min-w-10"></Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
