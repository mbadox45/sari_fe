<script setup>
    import { onMounted, ref } from 'vue';
    import { FilterMatchMode } from 'primevue/api';
    import { useToast } from 'primevue/usetoast';

    import moment from 'moment';

    // const date_now = moment(new Date()).format('yyyy-mm-dd');

    // API
    import {listIncommingRequest, listStatusRequest, listStatus} from '@/api/DataVariable';
    import RequestService from '@/api/RequestService.js';
    import { URL_WEB } from '@/api/env';

    // Component
    import DetailRequest from './components/DetailRequest.vue';
    import ActionsRequest from './components/ActionsRequest.vue';

    const request_data = ref([])
    const dialogs = ref(false)
    const titledialogs = ref('')
    const cm = ref();
    const list_status = ref(listStatus);
    const selectedRequest = ref({status:null, id:null});
    const loadings = ref(false);
    const filters = ref();
    const statusRequest = ref('incoming');
    const status_tiket = ref();
    const payload = ref(JSON.parse(localStorage.getItem('payload')));
    const menuModel = ref([
        {label: 'View', icon: 'pi pi-fw pi-search', command: () => {console.log('View')}},
        {label: 'Print', icon: 'pi pi-fw pi-print', command: () => {window.open(`http://36.92.181.10:8083/foreman/cetak_form_request/${selectedRequest.value.id}`)}},
    ]);

    const toast = useToast();
    
    onMounted(() => {
        load_data()
    });

    const aksi = () => {
        console.log(date_input.value)
    }

    const load_data = async() => {
        try {
            request_data.value = [];
            const response = await RequestService.getRequestDept()
            const load = response.data;
            const data = load.data
            if (statusRequest.value === 'done') {
                for (let i = 0; i < data.length; i++) {
                    if (Number(data[i].status) == 6) {
                        request_data.value.push({
                            id:data[i].id, 
                            nomor:data[i].no_wo,
                            status:Number(data[i].status),
                            keperluan:data[i].keperluan,
                            info:data[i].info,
                            nohp:data[i].user.noHP,
                            tgl:moment(data[i].created_at).format('DD MMM YYYY'),
                            requestor:data[i].user.name,
                            jabatan:data[i].user.jabatan,
                            kategori:data[i].category.nama_kategori,
                            permintaan:data[i].category.nama_permintaan,
                            atasan: data[i].atasan.name,
                        })
                    }
                }
            } else if (statusRequest.value === 'incoming') {
                for (let i = 0; i < data.length; i++) {
                    if (Number(data[i].status) == 5 || Number(data[i].status) == 4 || Number(data[i].status) == 3) {
                        request_data.value.push({
                            id:data[i].id, 
                            nomor:data[i].no_wo,
                            status:Number(data[i].status),
                            keperluan:data[i].keperluan,
                            info:data[i].info,
                            nohp:data[i].user.noHP,
                            tgl:moment(data[i].created_at).format('DD MMM YYYY'),
                            requestor:data[i].user.name,
                            jabatan:data[i].user.jabatan,
                            kategori:data[i].category.nama_kategori,
                            permintaan:data[i].category.nama_permintaan,
                            atasan: data[i].atasan.name,
                        })
                    }
                }
            } else {
                for (let i = 0; i < data.length; i++) {
                    const info = data[i].info.split(' ');
                    const kondisi = info[0];
                    if (kondisi == 'Declined') {
                        request_data.value.push({
                            id:data[i].id, 
                            nomor:data[i].no_wo,
                            status:Number(data[i].status),
                            keperluan:data[i].keperluan,
                            info:data[i].info,
                            nohp:data[i].user.noHP,
                            tgl:moment(data[i].created_at).format('DD MMM YYYY'),
                            requestor:data[i].user.name,
                            jabatan:data[i].user.jabatan,
                            kategori:data[i].category.nama_kategori,
                            permintaan:data[i].category.nama_permintaan,
                            atasan: data[i].atasan.name,
                        })
                    }
                }
            }
        } catch (error) {
            request_data.value = [];
            console.log(error);
        }
    }

    // Context Menu Table
    const onRowContextMenu = (event) => {
        cm.value.show(event.originalEvent);
        // console.log(selectedRequest.value)
        loadMenu();
    };
    const loadMenu = () => {
        console.log(Number(payload.value.grade))
        if (Number(payload.value.grade) > 2) {
            menuModel.value = [
                {label: 'View', icon: 'pi pi-fw pi-search', command: () => detailData(selectedRequest.value, 'detail')},
                {label: 'Print', icon: 'pi pi-fw pi-print', command: () => {window.open(URL_WEB+'print/'+selectedRequest.value.id)}},
            ]
        } else {
            if (selectedRequest.value.status == 3) {
                menuModel.value= [
                    {label: 'View', icon: 'pi pi-fw pi-search', command: () => detailData(selectedRequest.value, 'detail')},
                    {label: 'Print', icon: 'pi pi-fw pi-print', command: () => {window.open(URL_WEB+'print/'+selectedRequest.value.id)}},
                    {separator:true},
                    {label: 'Execute', icon: 'pi pi-fw pi-play', command: () => {detailData(selectedRequest.value, 'execute')}},
                    {label: 'Reject', icon: 'pi pi-fw pi-times', command: () => detailData(selectedRequest.value, 'reject')},
                ]
            } else if (selectedRequest.value.status == 5) {
                menuModel.value = [
                    {label: 'View', icon: 'pi pi-fw pi-search', command: () => detailData(selectedRequest.value, 'detail')},
                    {label: 'Print', icon: 'pi pi-fw pi-print', command: () => {window.open(URL_WEB+'print/'+selectedRequest.value.id)}},
                    {separator:true},
                    {label: 'Pending', icon: 'pi pi-fw pi-pause', command: () => detailData(selectedRequest.value, 'pending')},
                    {label: 'Done', icon: 'pi pi-fw pi-check', command: () => detailData(selectedRequest.value, 'done')},
                ]
            } else {
                menuModel.value = [
                    {label: 'View', icon: 'pi pi-fw pi-search', command: () => detailData(selectedRequest.value, 'detail')},
                    {label: 'Print', icon: 'pi pi-fw pi-print', command: () => {window.open(URL_WEB+'print/'+selectedRequest.value.id)}},
                ]
            }
        }
    }

    // Filter Table
    const initFilters = () => {
        filters.value = {
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        };
    };
    initFilters();

    const detailData = async(data, status) => {
        dialogs.value = true
        status_tiket.value = status
        if (status === 'detail') {
            titledialogs.value = `<span class="font-semibold">VIEW DETAIL</span> <i class="pi pi-angle-double-right mx-2 text-lg"></i> ${data.nomor}`;
        } else if (status === 'execute') {
            titledialogs.value = `<span class="font-semibold text-cyan-500">EXECUTE REQUEST</span> <i class="pi pi-angle-double-right mx-2 text-lg"></i> ${data.nomor}`;
        } else if (status === 'pending') {
            titledialogs.value = `<span class="font-semibold text-cyan-500">PENDING REQUEST</span> <i class="pi pi-angle-double-right mx-2 text-lg"></i> ${data.nomor}`;
        } else if (status === 'done') {
            titledialogs.value = `<span class="font-semibold text-green-500">DONE REQUEST</span> <i class="pi pi-angle-double-right mx-2 text-lg"></i> ${data.nomor}`;
        } else {
            titledialogs.value = `<span class="font-semibold text-red-500">DECLINE REQUEST</span> <i class="pi pi-angle-double-right mx-2 text-lg"></i> ${data.nomor}`;
        }
    }

    const rowClass = (data) => {
        return [ data.status == 5 ? 'bg-primary' : data.status == 6 ? 'text-green-500 font-semibold' : data.status == 4 ? 'text-orange-500 font-semibold' : data.status == 3 ? 'text-cyan-500 font-semibold' : data.status == 2 ? 'text-cyan-500 font-semibold' : data.status == 0 ? 'bg-red-500 text-white' : ''];
    };

    const actionDialog = (status) => {
        if (status == 'execute') {
            dialogs.value = false
            toast.add({ severity: 'success', summary: 'Successfully', detail: `Execute Successfully`, life: 3000 });
            load_data()
        } else if (status == 'pending') {
            dialogs.value = false
            toast.add({ severity: 'success', summary: 'Successfully', detail: `Pending Successfully`, life: 3000 });
            load_data()
        } else if (status == 'done') {
            dialogs.value = false
            toast.add({ severity: 'success', summary: 'Successfully', detail: `Request Finished`, life: 3000 });
            load_data()
        } else if (status == 'reject') {
            dialogs.value = false
            toast.add({ severity: 'success', summary: 'Successfully', detail: `Request Rejected`, life: 3000 });
            load_data()
        } else if (status == 'warning') {
            toast.add({ severity: 'warn', summary: 'Failed', detail: `Please data not empty !`, life: 3000 });
        } else if (status == 'danger') {
            dialogs.value = false
            toast.add({ severity: 'danger', summary: 'Error', detail: `Please contact the IT team`, life: 3000 });
        } else {
            dialogs.value = false
        }
    }

</script>

<template>
    <div class="grid align-items-center">
        <Toast/>
        <Dialog v-model:visible="dialogs" :style="{ width: '1100px' }" :draggable="false" :modal="true">
            <template #header>
                <strong class="font-normal text-2xl" v-html="titledialogs"></strong>
            </template>
            <detail-request :data_dialog="selectedRequest" v-if="status_tiket === 'detail'"/>
            <actions-request :data_dialog="selectedRequest" :status_data="status_tiket" v-else @submit="actionDialog"/>
        </Dialog>
        <div class="col-12 md:col-12">
            <div class="flex align-items-center justify-content-end md:justify-content-between">
                <div>
                    <i class="mx-2 text-4xl pi pi-tag"></i>
                    <strong class="text-5xl font-normal">Incoming Request</strong>
                </div>
                <div class="hidden md:block">
                    <strong class="text-500 font-light">Request <i class="pi pi-angle-double-right mx-2"></i> Incoming Request</strong>
                </div>
            </div>
        </div>
        <div class="col-12 md:col-12">
            <div class="card">
                <div class="grid align-items-center">
                    <div class="col-12 md:col-4">
                        <span class="text-sm text-red-500">* Please right click to see the action menu</span>
                    </div>
                    <div class="col-12 md:col-4">
                        <div class="p-inputgroup flex-1">
                            <span class="p-inputgroup-addon">
                                Status Request
                            </span>
                            <Dropdown v-model="statusRequest" :options="listStatusRequest" optionValue="status" optionLabel="name" placeholder="Select a Status" @change="load_data" />
                        </div>
                    </div>
                    <div class="col-12 md:col-4  p-fluid">
                        <span class="p-input-icon-left">
                            <i class="pi pi-search" />
                            <InputText v-model="filters['global'].value" placeholder="Search" class="w-full"/>
                        </span>
                    </div>
                </div>
                <Divider/>
                <!-- <h6 class="text-center"> -- Not Found --</h6> -->
                <ContextMenu ref="cm" :model="menuModel" />
                <DataTable v-model:filters="filters" :value="request_data" :rowClass="rowClass" contextMenu v-model:contextMenuSelection="selectedRequest" @rowContextmenu="onRowContextMenu" paginator :rows="10" tableStyle="min-width: 50rem">
                    <template #empty> <p class="text-center">Data not found.</p> </template>
                    <Column field="nomor" header="No" sortable>
                        <template #body="{ data }">
                            <strong>{{ data.nomor }}</strong>
                        </template>
                    </Column>
                    <Column field="tgl" header="Date" sortable>
                        <template #body="{ data }">
                            <strong>{{ data.tgl }}</strong>
                        </template>
                    </Column>
                    <Column field="requestor" header="Name"></Column>
                    <Column field="jabatan" header="Position"></Column>
                    <Column field="kategori" header="Category"></Column>
                    <!-- <Column field="status" header="Status"></Column> -->
                    <Column field="info" header="Info">
                        <template #body="{ data }">
                            <strong :class="`text-${data.color}`">{{ data.info }}</strong>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
