<script setup>
    import { onMounted, ref } from 'vue';
    import { FilterMatchMode } from 'primevue/api';
    import { useToast } from 'primevue/usetoast';

    import moment from 'moment';
    
    // const date_now = moment(new Date()).format('yyyy-mm-dd');
    
    // API
    import {URL_API} from '@/api/env';
    import {listIncommingRequest, listStatusRequest, listStatus} from '@/api/DataVariable';
    import RequestService from '@/api/RequestService.js';


    // Component
    import DetailRequest from './components/DetailRequest.vue';
    import AtasanRequest from './components/AtasanRequest.vue';
    import DeclineRequest from './components/DeclineRequest.vue';

    const payload = ref(JSON.parse(localStorage.getItem('payload')));
    const request_data = ref([])
    const dialogs = ref(false)
    const titledialogs = ref('')
    const cm = ref();
    const list_status = ref(listStatus);
    const selectedRequest = ref({status:null, id:null});
    const filters = ref();
    const statusRequest = ref('');
    const menuModel = ref([]);

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
            let response;
            if (Number(payload.value.grade) > 3) {
                response = await RequestService.getRequestAtasan();
                const load = response.data;
                const data = load.data;
                for (let i = 0; i < data.length; i++) {
                    const status = Number(data[i].status);
                    if (status === 1) {
                        request_data.value.push({
                            id : data[i].id,
                            nomor : data[i].no_wo,
                            requestor : data[i].user.name,
                            jabatan : data[i].user.jabatan,
                            nohp : data[i].user.noHP,
                            tgl : moment(data[i].created_at).format('DD MMM YYYY'),
                            keperluan: data[i].keperluan,
                            kategori: data[i].category.nama_kategori,
                            permintaan: data[i].category.nama_permintaan,
                            keterangan: data[i].info,
                            status: Number(data[i].status),
                        })
                    }
                }
            } else {
                response = await RequestService.getRequestDept();
                const load = response.data;
                const data = load.data;
                for (let i = 0; i < data.length; i++) {
                    const status = Number(data[i].status);
                    if (status === 2) {
                        request_data.value.push({
                            id : data[i].id,
                            nomor : data[i].no_wo,
                            requestor : data[i].user.name,
                            jabatan : data[i].user.jabatan,
                            nohp : data[i].user.noHP,
                            tgl : moment(data[i].created_at).format('DD MMM YYYY'),
                            keperluan: data[i].keperluan,
                            kategori: data[i].category.nama_kategori,
                            permintaan: data[i].category.nama_permintaan,
                            keterangan: data[i].info,
                            status: Number(data[i].status),
                        })
                    }
                }
            }

        } catch (error) {
            request_data.value = [];
        }
    }

    // Context Menu Table
    const onRowContextMenu = (event) => {
        cm.value.show(event.originalEvent);
        // console.log(selectedRequest.value)
        loadMenu();
    };
    const loadMenu = () => {
        menuModel.value = [
            {label: 'View', icon: 'pi pi-fw pi-search', command: () => detailData(selectedRequest.value, 'detail')},
            {label: 'Print', icon: 'pi pi-fw pi-print', command: () => {
                // Define your authorization token
                const authToken = localStorage.getItem('usertoken');

                // Create a new XMLHttpRequest object
                const xhr = new XMLHttpRequest();

                // Configure the request
                xhr.open('GET', `${URL_API}request/${selectedRequest.value.id}/pdf`, true);

                // Set the authorization header
                xhr.setRequestHeader('Authorization', `Bearer ${authToken}`);

                // Handle the response when the request is complete
                xhr.onload = function () {
                    if (xhr.status === 200) {
                        // Request was successful, open a new tab or window with the URL
                        window.open(`${URL_API}request/${selectedRequest.value.id}/pdf`);
                    } else {
                        console.error('Request failed with status:', xhr.status);
                    }
                };

                // Send the request
                xhr.send();
                // window.open(`${URL_API}${selectedRequest.value.id}/pdf`)
            }},
            {separator:true},
            {label: 'Approve', icon: 'pi pi-fw pi-check', command: () => detailData(selectedRequest.value, 'approve')},
            {label: 'Decline', icon: 'pi pi-fw pi-times', command: () => detailData(selectedRequest.value, 'decline')},
        ]
    }

    // Filter Table
    const initFilters = () => {
        filters.value = {
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        };
    };
    initFilters();

    const detailData = async(data, status) => {
        dialogs.value = true;
        statusRequest.value = status;
        if (status === 'detail') {
            titledialogs.value = `<span class="font-semibold">VIEW DETAIL</span> <i class="pi pi-angle-double-right mx-2 text-lg"></i> ${data.nomor}`;
        } else if (status === 'approve') {
            titledialogs.value = `<span class="font-semibold text-cyan-500">APPROVE REQUEST</span> <i class="pi pi-angle-double-right mx-2 text-lg"></i> ${data.nomor}`;
        } else {
            titledialogs.value = `<span class="font-semibold text-red-500">DECLINE REQUEST</span> <i class="pi pi-angle-double-right mx-2 text-lg"></i> ${data.nomor}`;
        }
    }

    const actionDialog = (status) => {
        if (status == 'save') {
            dialogs.value = false
            toast.add({ severity: 'success', summary: 'Successfully', detail: `Request approved`, life: 3000 });
            load_data()
        } else if (status == 'warning') {
            toast.add({ severity: 'warn', summary: 'Failed', detail: `Please input priority`, life: 3000 });
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
        <Dialog v-model:visible="dialogs" :style="{ width: statusRequest === 'detail' ? '1100px' : '700px'}" :draggable="false" :modal="true">
            <template #header>
                <strong class="font-normal text-2xl" v-html="titledialogs"></strong>
            </template>
            <detail-request :data_dialog="selectedRequest" v-show="statusRequest === 'detail'"/>
            <atasan-request :data_dialog="selectedRequest" v-show="statusRequest === 'approve'" @submit="actionDialog"/>
            <decline-request :data_dialog="selectedRequest" v-show="statusRequest === 'decline'" @submit="actionDialog"/>
            <div>

            </div>
        </Dialog>
        <div class="col-12 md:col-12">
            <div class="flex align-items-center justify-content-end md:justify-content-between">
                <div>
                    <i class="mx-2 text-4xl pi pi-tag"></i>
                    <strong class="text-5xl font-normal">List Request <span class="font-light">(Approval)</span></strong>
                </div>
                <div class="hidden md:block">
                    <strong class="text-500 font-light">Request <i class="pi pi-angle-double-right mx-2"></i> List Request</strong>
                </div>
            </div>
        </div>
        <div class="col-12 md:col-12">
            <div class="card">
                <div class="grid align-items-center">
                    <div class="col-12 md:col-8">
                        <span class="text-sm text-red-500">* Please right click to see the action menu</span>
                    </div>
                    <div class="col-12 md:col-4 p-fluid">
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
                    <template #empty> <p class="text-center">Data not found.</p> </template>
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
                    <Column field="requestor" header="Nama"></Column>
                    <Column field="jabatan" header="Jabatan"></Column>
                    <Column field="kategori" header="Kategori"></Column>
                    <Column field="keperluan" header="Keterangan">
                        <template #body="{ data }">
                            {{ data.keperluan }}
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
