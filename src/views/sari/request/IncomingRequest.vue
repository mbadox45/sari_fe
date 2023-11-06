<script setup>
    import { onMounted, ref } from 'vue';
    import { FilterMatchMode } from 'primevue/api';

    import moment from 'moment';

    // const date_now = moment(new Date()).format('yyyy-mm-dd');

    // API
    import {listIncommingRequest, listStatusRequest, listStatus} from '@/api/DataVariable';

    // Component
    import DetailRequest from './components/DetailRequest.vue';

    const request_data = ref([])
    const dialogs = ref(false)
    const titledialogs = ref('')
    const cm = ref();
    const list_status = ref(listStatus);
    const selectedRequest = ref({status:null, id:null});
    const filters = ref();
    const statusRequest = ref('incoming');
    const menuModel = ref([
        {label: 'View', icon: 'pi pi-fw pi-search', command: () => {console.log('View')}},
        {label: 'Print', icon: 'pi pi-fw pi-print', command: () => {window.open(`http://36.92.181.10:8083/foreman/cetak_form_request/${selectedRequest.value.id}`)}},
    ]);

    onMounted(() => {
        load_data()
    });

    const aksi = () => {
        console.log(date_input.value)
    }

    const load_data = async() => {
        if (statusRequest.value === 'done') {
            request_data.value = [];
            for (let i = 0; i < listIncommingRequest.length; i++) {
                const status_tiket = list_status.value.find(a => a.id === listIncommingRequest[i].status )
                if (listIncommingRequest[i].status == 6) {
                    request_data.value.push({
                        id:listIncommingRequest[i].id, 
                        nomor:listIncommingRequest[i].nomor,
                        status:listIncommingRequest[i].status,
                        tgl:listIncommingRequest[i].tgl,
                        nama:listIncommingRequest[i].nama,
                        jabatan:listIncommingRequest[i].jabatan,
                        kategori:listIncommingRequest[i].kategori,
                        keterangan: status_tiket ? status_tiket.name : '',
                        color: status_tiket ? status_tiket.color : 'gray-900',
                    })
                }
            }
        } else {
            request_data.value = [];
            for (let i = 0; i < listIncommingRequest.length; i++) {
                const status_tiket = list_status.value.find(status => status.id === listIncommingRequest[i].status )
                if (listIncommingRequest[i].status == 5 || listIncommingRequest[i].status == 4 || listIncommingRequest[i].status == 3) {
                    request_data.value.push({
                        id:listIncommingRequest[i].id, 
                        nomor:listIncommingRequest[i].nomor,
                        status:listIncommingRequest[i].status,
                        tgl:listIncommingRequest[i].tgl,
                        nama:listIncommingRequest[i].nama,
                        jabatan:listIncommingRequest[i].jabatan,
                        kategori:listIncommingRequest[i].kategori,
                        keterangan: status_tiket ? status_tiket.name : '',
                        color: status_tiket ? status_tiket.color : 'gray-900',
                    })
                }
            }
        }
    }

    // Context Menu Table
    const onRowContextMenu = (event) => {
        cm.value.show(event.originalEvent);
        // console.log(selectedRequest.value)
        loadMenu();
    };
    const loadMenu = () => {  
        if (selectedRequest.value.status == 3) {
            menuModel.value= [
                {label: 'View', icon: 'pi pi-fw pi-search', command: () => detailData(selectedRequest.value)},
                {label: 'Print', icon: 'pi pi-fw pi-print', command: () => {window.open(`http://36.92.181.10:8083/foreman/cetak_form_request/${selectedRequest.value.id}`)}},
                {separator:true},
                {label: 'Action', icon: 'pi pi-fw pi-play', command: () => {window.location.replace(`/action-request?id=${selectedRequest.value.id}`)}},
            ]
        } else if (selectedRequest.value.status == 5) {
            menuModel.value = [
                {label: 'View', icon: 'pi pi-fw pi-search', command: () => detailData(selectedRequest.value)},
                {label: 'Print', icon: 'pi pi-fw pi-print', command: () => {window.open(`http://36.92.181.10:8083/foreman/cetak_form_request/${selectedRequest.value.id}`)}},
                {separator:true},
                {label: 'Cancel', icon: 'pi pi-fw pi-times', command: () => {console.log('Cancel')}},
                {label: 'Pending', icon: 'pi pi-fw pi-pause', command: () => {console.log('Pending')}},
                {label: 'Done', icon: 'pi pi-fw pi-check', command: () => {console.log('Done')}},
            ]
        } if (selectedRequest.value.status == 3) {
            menuModel.value = [
                {label: 'View', icon: 'pi pi-fw pi-search', command: () => detailData(selectedRequest.value)},
                {label: 'Print', icon: 'pi pi-fw pi-print', command: () => {window.open(`http://36.92.181.10:8083/foreman/cetak_form_request/${selectedRequest.value.id}`)}},
                {separator:true},
                {label: 'Action', icon: 'pi pi-fw pi-play', command: () => {window.location.replace(`/action-request?id=${selectedRequest.value.id}`)}},
                {label: 'Cancel', icon: 'pi pi-fw pi-times', command: () => {console.log('Cancel')}},
            ]
        } else {
            menuModel.value = [
                {label: 'View', icon: 'pi pi-fw pi-search', command: () => detailData(selectedRequest.value)},
                {label: 'Print', icon: 'pi pi-fw pi-print', command: () => {window.open(`http://36.92.181.10:8083/foreman/cetak_form_request/${selectedRequest.value.id}`)}},
            ]
        }
    }

    // Filter Table
    const initFilters = () => {
        filters.value = {
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        };
    };
    initFilters();

    const detailData = async(data) => {
        dialogs.value = true
        titledialogs.value = data.nomor;
    }

</script>

<template>
    <div class="grid align-items-center">
        <Dialog v-model:visible="dialogs" :style="{ width: '1100px' }" :draggable="false" :modal="true">
            <template #header>
                <h4 class="font-normal">VIEW DETAIL <i class="pi pi-angle-double-right mx-2 text-lg"></i> {{ titledialogs }}</h4>
            </template>
            <detail-request :data_dialog="selectedRequest"/>
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
                <DataTable v-model:filters="filters" :value="request_data" contextMenu v-model:contextMenuSelection="selectedRequest" @rowContextmenu="onRowContextMenu" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem">
                    <template #empty> No customers found. </template>
                    <Column field="nomor" header="Nomor" sortable>
                        <template #body="{ data }">
                            <strong>{{ data.nomor }}</strong>
                        </template>
                    </Column>
                    <Column field="tgl" header="Tanggal" sortable>
                        <template #body="{ data }">
                            <strong>{{ moment(data.tgl).format('DD MMMM YYYY') }}</strong>
                        </template>
                    </Column>
                    <Column field="nama" header="Nama"></Column>
                    <Column field="jabatan" header="Jabatan"></Column>
                    <Column field="kategori" header="Kategori"></Column>
                    <Column field="keterangan" header="Keterangan">
                        <template #body="{ data }">
                            <strong :class="`text-${data.color}`">{{ data.keterangan }}</strong>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
