<script setup>
    import { onMounted, ref } from 'vue';
    import moment from 'moment';
    import { useToast } from 'primevue/usetoast';

    // API
    import ProblemService from '@/api/ProblemService';

    // Components
    import AddProblem from './components/AddProblem.vue';
    import DetailProblem from './components/DetailProblem.vue';
    import DoneProblem from './components/DoneProblem.vue';

    // const date_now = moment(new Date()).format('yyyy-mm-dd');
    const menuModel = ref([]);
    const cm = ref();
    const selectedRequest = ref({status:null, id:null});
    const request_data = ref([])
    const visible = ref(false);
    const status_post = ref()
    const titledialogs = ref();

    const toast = useToast();

    onMounted(() => {
        load_data();
    });

    const load_data = async() => {
        try {
            request_data.value = []
            const response = await ProblemService.getProblem();
            const load = response.data;
            const data = load.data;
            for (let i = 0; i < data.length; i++) {
                request_data.value.push({
                    id:data[i].id, 
                    nomor:data[i].no_wo,
                    office:data[i].office,
                    nohp:data[i].hp,
                    email_inl:data[i].email_inl,
                    status:data[i].info,
                    remark:data[i].remark,
                    keperluan:data[i].keperluan,
                    requestor:data[i].user.name,
                    jabatan:data[i].user.jabatan,
                    kategori:data[i].category.nama_kategori,
                    kategori2:Number(data[i].category.id_kategori),
                    permintaan:data[i].category.nama_permintaan,
                    jenis_permintaan:Number(data[i].jenis_permintaan),
                    status_data:Number(data[i].status),
                    tgl:moment(data[i].created_at).format('DD MMM YYYY, HH:mm:SS'),
                    keperluan:data[i].keperluan,
                    keterangan:data[i].keterangan,
                    executor:data[i].executor == null ? '-' : data[i].executor.name,
                })
            }
        } catch (error) {
            request_data.value = []
        }
        // console.log(payload.value);
    }

    const onRowContextMenu = (event) => {
        cm.value.show(event.originalEvent);
        loadMenu();
    };
    const loadMenu = () => {
        if (selectedRequest.value.status_data === 1) {
            menuModel.value = [
                {label: 'Details', icon: 'pi pi-fw pi-search', command: () => showDialog(selectedRequest.value, 'detail')},
                {separator:true},
                {label: 'Edit', icon: 'pi pi-fw pi-pencil text-yellow-500', command: () => showDialog(selectedRequest.value, 'edit')},
                {label: 'Cancel', icon: 'pi pi-fw pi-times text-red-500', command: () => showDialog(selectedRequest.value, 'cancel')},
            ]
        } else {
            menuModel.value = [
                {label: 'Details', icon: 'pi pi-fw pi-search', command: () => showDialog(selectedRequest.value, 'detail')},
            ]
        }
    }
    
    const rowClass = (data) => {
        return [ data.status_data == 2 ? 'bg-primary' : data.status_data == 3 ? 'text-green-500 font-bold' : data.status_data == 0 ? 'bg-red-500 text-white' : ''];
    };

    const showDialog = (data, status) => {
        visible.value = true;
        status_post.value = status;
        if (status === 'detail') {
            titledialogs.value = `<span class="font-semibold">VIEW DETAIL</span> <i class="pi pi-angle-double-right mx-2 text-lg"></i> ${data.nomor}`;
        } else if (status === 'edit') {
            titledialogs.value = `<span class="font-semibold text-primary">UPDATE PROBLEM</span> <i class="pi pi-angle-double-right mx-2 text-lg"></i> ${data.nomor}`;
        } else  if (status === 'done') {
            titledialogs.value = `<span class="font-semibold text-green-500">DONE PROBLEM</span> <i class="pi pi-angle-double-right mx-2 text-lg"></i> ${data.nomor}`;
        } else if (status === 'tambah') {
            titledialogs.value = `<span class="font-semibold text-primary">ADD PROBLEM</span>`;
        } else {
            titledialogs.value = `<span class="font-semibold text-red-500">CANCEL PROBLEM</span> <i class="pi pi-angle-double-right mx-2 text-lg"></i> ${data.nomor}`;
        }
    }

    const post_data = async(status) => {
        if (status === 'tambah') {
            toast.add({ severity: 'success', summary: 'Successfully', detail: `Data created successfully`, life: 3000 });
            load_data();
            visible.value = false;
        } else if (status === 'edit') {
            toast.add({ severity: 'success', summary: 'Successfully', detail: `Data updated successfully`, life: 3000 });
            load_data();
            visible.value = false;
        } else if (status === 'cancel') {
            toast.add({ severity: 'success', summary: 'Successfully', detail: `Data canceled successfully`, life: 3000 });
            load_data();
            visible.value = false;
        } else if (status === 'warning') {
            toast.add({ severity: 'warn', summary: 'Failed', detail: `Please, data cannot be empty`, life: 3000 });
        } else if (status === 'danger') {
            toast.add({ severity: 'danger', summary: 'Error', detail: `Please contact the IT team`, life: 3000 });
            visible.value = false;
        } else {
            visible.value = false;
        }
    }
</script>

<template>
    <Toast/>
    <Dialog v-model:visible="visible" modal :draggable="false" :style="{ width: '70vw' }">
        <template #header>
            <h4 class="font-normal" v-html="titledialogs"></h4>
        </template>
        <detail-problem v-if="status_post === 'detail'" :data_dialog="selectedRequest"/>
        <done-problem v-else-if="status_post === 'cancel'" :data_dialog="selectedRequest" :status_request="statusRequest" @submit="post_data"/>
        <add-problem v-else @submit="post_data" :status_data="status_post" :data_dialog="selectedRequest" />
    </Dialog>
    <div class="grid align-items-center">
        <div class="col-12 md:col-12">
            <div class="flex align-items-center justify-content-end md:justify-content-between">
                <div>
                    <i class="mx-2 text-4xl pi pi-tag"></i>
                    <strong class="text-5xl font-normal">My Problem</strong>
                </div>
                <div class="hidden md:block">
                    <strong class="text-500 font-light">Problem <i class="pi pi-angle-double-right mx-2"></i> My Problem</strong>
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
                        <Button label="Add Problem" icon="pi pi-plus" size="small" outlined severity="info" @click="showDialog({},'tambah')"/>
                    </div>
                </div>
                <Divider/>
                <!-- <h6 class="text-center"> -- Not Found --</h6> -->
                <ContextMenu ref="cm" :model="menuModel" />
                <DataTable :value="request_data" paginator :rows="10" :rowClass="rowClass" contextMenu v-model:contextMenuSelection="selectedRequest" @rowContextmenu="onRowContextMenu" tableStyle="min-width: 50rem">
                    <template #empty> <p class="text-center">Data not found.</p> </template>
                    <Column field="nomor" header="No" style="width: 15%"></Column>
                    <Column field="tgl" header="Request Time" style="width: 25%"></Column>
                    <Column field="keperluan" header="Necessary" style="width: 25%"></Column>
                    <Column field="status" header="Status" style="width: 25%"></Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
