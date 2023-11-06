<script setup>
    import { onMounted, ref } from 'vue';
    import { FilterMatchMode } from 'primevue/api';
    import { useToast } from 'primevue/usetoast';

    import moment from 'moment';

    // const date_now = moment(new Date()).format('yyyy-mm-dd');

    // API
    import {listIncommingRequest, listStatusRequest, listStatus} from '@/api/DataVariable';

    // Component
    import DetailRequest from './components/DetailRequest.vue';
    import AtasanRequest from './components/AtasanRequest.vue';
    import DeclineRequest from './components/DeclineRequest.vue';

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
        request_data.value = [];
        for (let i = 0; i < listIncommingRequest.length; i++) {
            const status_tiket = list_status.value.find(a => a.id === listIncommingRequest[i].status )
            if (listIncommingRequest[i].status == 2) {
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

    // Context Menu Table
    const onRowContextMenu = (event) => {
        cm.value.show(event.originalEvent);
        // console.log(selectedRequest.value)
        loadMenu();
    };
    const loadMenu = () => {
        menuModel.value = [
            {label: 'View', icon: 'pi pi-fw pi-search', command: () => detailData(selectedRequest.value, 'detail')},
            {label: 'Print', icon: 'pi pi-fw pi-print', command: () => {window.open(`http://36.92.181.10:8083/foreman/cetak_form_request/${selectedRequest.value.id}`)}},
            {separator:true},
            {label: 'Approve', icon: 'pi pi-fw pi-check', command: () => detailData(selectedRequest.value, 'approve')},
            {label: 'Cancel', icon: 'pi pi-fw pi-times', command: () => detailData(selectedRequest.value, 'cancel')},
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
            toast.add({ severity: 'success', summary: 'Successfully', detail: `Data saved successfully`, life: 3000 });
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
                <h4 class="font-normal" v-html="titledialogs"></h4>
            </template>
            <detail-request :data_dialog="selectedRequest" v-show="statusRequest === 'detail'"/>
            <atasan-request v-show="statusRequest === 'approve'" @submit="actionDialog"/>
            <decline-request v-show="statusRequest === 'cancel'" @submit="actionDialog"/>
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
