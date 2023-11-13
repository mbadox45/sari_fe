<script setup>
    import { onMounted, ref } from 'vue';
    import moment from 'moment';
    import { useToast } from 'primevue/usetoast';

    // API
    import {listProblem, listOffice, listJenis} from '@/api/DataVariable';
    import ProblemService from '@/api/ProblemService';

    // Components
    import DetailProblem from './components/DetailProblem.vue';
    import ActionProblem from './components/ActionProblem.vue';
    import DoneProblem from './components/DoneProblem.vue';

    const request_data = ref([])
    const menuModel = ref([]);
    const cm = ref();
    const selectedRequest = ref({status:null, id:null});
    const visible = ref(false);
    const statusRequest = ref('');
    const titledialogs = ref();
    const payload = ref(JSON.parse(localStorage.getItem('payload')));
    const form = ref({id:null, office:'', email_inl:payload.value.email, remark:'', kategori:1, jenis_permintaan:null, keperluan:''})

    const toast = useToast();

    onMounted(() => {
        load_data();
    });

    const load_data = async() => {
        try {
            request_data.value = []
            const response = await ProblemService.getProblemDept();
            const load = response.data;
            const data = load.data;
            for (let i = 0; i < data.length; i++) {
                const info = data[i].info.split(' ');
                const kondisi = info[0];
                if (kondisi != 'Canceled') {
                    request_data.value.push({
                        id:data[i].id, 
                        nomor:data[i].no_wo,
                        status:data[i].info,
                        office: data[i].office,
                        jabatan: data[i].user.jabatan,
                        requestor: data[i].user.name,
                        kategori: data[i].category.nama_kategori,
                        permintaan: data[i].category.nama_permintaan,
                        nohp: data[i].user.noHP,
                        remark: data[i].remark,
                        eksekutor: Number(data[i].eksekutor),
                        status_data:Number(data[i].status),
                        tgl:moment(data[i].created_at).format('DD MMM YYYY, HH:mm:SS'),
                        keperluan:data[i].keperluan,
                    })
                }
            }
        } catch (error) {
            request_data.value = []
        }
        // console.log(payload.value);
    }

    const showDialog = (data, status) => {
        visible.value = true;
        statusRequest.value = status;
        if (status === 'detail') {
            titledialogs.value = `<span class="font-semibold">VIEW DETAIL</span> <i class="pi pi-angle-double-right mx-2 text-lg"></i> ${data.nomor}`;
        } else if (status === 'action') {
            titledialogs.value = `<span class="font-semibold text-primary">EXECUTE PROBLEM</span> <i class="pi pi-angle-double-right mx-2 text-lg"></i> ${data.nomor}`;
        } else  if (status === 'done') {
            titledialogs.value = `<span class="font-semibold text-green-500">DONE PROBLEM</span> <i class="pi pi-angle-double-right mx-2 text-lg"></i> ${data.nomor}`;
        } else {
            titledialogs.value = `<span class="font-semibold text-red-500">DECLINE PROBLEM</span> <i class="pi pi-angle-double-right mx-2 text-lg"></i> ${data.nomor}`;
        }
    }

    const rowClass = (data) => {
        return [ data.status_data == 2 ? 'bg-primary' : data.status_data == 3 ? 'text-green-500 font-semibold' : data.status_data == 0 ? 'bg-red-500 text-white' : ''];
    };


    // Context Menu Table
    const onRowContextMenu = (event) => {
        cm.value.show(event.originalEvent);
        loadMenu();
    };
    const loadMenu = () => {
        if (selectedRequest.value.status_data === 1) {
            menuModel.value = [
                {label: 'Details', icon: 'pi pi-fw pi-search', command: () => showDialog(selectedRequest.value, 'detail')},
                {separator:true},
                {label: 'Execute', icon: 'pi pi-fw pi-play text-primary', class:'text-primary', command: () => showDialog(selectedRequest.value, 'action')},
                {label: 'Reject', icon: 'pi pi-fw pi-times text-red-500', command: () => showDialog(selectedRequest.value, 'decline')},
            ]
        } else if (selectedRequest.value.status_data === 2) {
            if (selectedRequest.value.eksekutor === Number(payload.value.id)) {
                menuModel.value = [
                    {label: 'Details', icon: 'pi pi-fw pi-search', command: () => showDialog(selectedRequest.value, 'detail')},
                    {label: 'Done', icon: 'pi pi-fw pi-check text-green-500', command: () => showDialog(selectedRequest.value, 'done')},
                ]
            } else {
                menuModel.value = [
                    {label: 'Details', icon: 'pi pi-fw pi-search', command: () => showDialog(selectedRequest.value, 'detail')},
                ]
            }
        } else {
            menuModel.value = [
                {label: 'Details', icon: 'pi pi-fw pi-search', command: () => showDialog(selectedRequest.value, 'detail')},
            ]
        }
    }

    const postData = (status) => {
        if (status == 'save') {
            visible.value = false
            toast.add({ severity: 'success', summary: 'Successfully', detail: `Execute successfully`, life: 3000 });
            load_data();
        } else if (status == 'save_done') {
            visible.value = false
            toast.add({ severity: 'success', summary: 'Successfully', detail: `Problem Solved`, life: 3000 });
            load_data();
        } else if (status == 'decline') {
            visible.value = false
            toast.add({ severity: 'success', summary: 'Successfully', detail: `Decline successfully`, life: 3000 });
            load_data();
        } else if (status == 'failed') {
            visible.value = false
            toast.add({ severity: 'danger', summary: 'Error', detail: `Please contact the IT team`, life: 3000 });
        } else if (status == 'warning') {
            visible.value = false
            toast.add({ severity: 'warn', summary: 'Error', detail: `Please contact the IT team`, life: 3000 });
        } else {
            visible.value = false
        }
    }
</script>

<template>
    <Toast/>
    <Dialog v-model:visible="visible" modal :draggable="false" :style="{ width: statusRequest == 'detail' ? '50vw' : statusRequest == 'action' ? '70vw' : '60vw'}">
        <template #header>
            <h4 class="font-normal" v-html="titledialogs"></h4>
        </template>
        <detail-problem v-if="statusRequest === 'detail'" :data_dialog="selectedRequest"/>
        <action-problem v-else-if="statusRequest === 'action'" :data_dialog="selectedRequest" @submit="postData"/>
        <done-problem v-else :data_dialog="selectedRequest" :status_request="statusRequest" @submit="postData"/>
    </Dialog>
    <div class="grid align-items-center">
        <div class="col-12 md:col-12">
            <div class="flex align-items-center justify-content-end md:justify-content-between">
                <div>
                    <i class="mx-2 text-4xl pi pi-tag"></i>
                    <strong class="text-5xl font-normal">Problem</strong>
                </div>
                <div class="hidden md:block">
                    <strong class="text-500 font-light">Problem <i class="pi pi-angle-double-right mx-2"></i> List Problem</strong>
                </div>
            </div>
        </div>
        <div class="col-12 md:col-12">
            <div class="card">
                <div class="flex justify-content-between align-items-center">
                    <div>
                        <span class="text-sm text-red-500">* Please right click to see the action menu</span>
                    </div>
                    <div>
                        <!-- <Button label="Add Problem" icon="pi pi-plus" size="small" outlined severity="info" @click="showDialog"/> -->
                    </div>
                </div>
                <Divider/>
                <ContextMenu ref="cm" :model="menuModel" />
                <!-- <h6 class="text-center"> -- Not Found --</h6> -->
                <DataTable :value="request_data" paginator :rowClass="rowClass" :rows="10" contextMenu v-model:contextMenuSelection="selectedRequest" @rowContextmenu="onRowContextMenu" tableStyle="min-width: 50rem">
                    <template #empty> <p class="text-center">Data not found.</p> </template>
                    <Column field="nomor" header="No" style="width: 25%"></Column>
                    <Column field="tgl" header="Request Date" style="width: 25%"></Column>
                    <Column field="keperluan" header="Necessary" style="width: 25%"></Column>
                    <Column field="status" header="Status" style="width: 25%">
                        <template #body="{ data }">
                            <strong class="text-sm">{{ data.status }}</strong>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
