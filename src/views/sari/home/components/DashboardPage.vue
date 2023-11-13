<script setup>
    import { onMounted, ref } from 'vue';
    import moment from 'moment';

    // API
    import RequestService from '@/api/RequestService.js';
    import ProblemService from '@/api/ProblemService';

    // const date_now = moment(new Date()).format('yyyy-mm-dd');
    const date_input = ref({start:moment(new Date()).format('YYYY-MM-01'), end:moment(new Date()).format('YYYY-MM-DD')});
    const dark = 'text-white';
    const details = ref('');

    // Total
    const tot_req = ref(0)
    const tot_req_progress = ref(0)
    const tot_req_done = ref(0)
    const tot_prob = ref(0)
    // Load
    const load_req = ref([])
    const load_req_progress = ref([])
    const load_req_done = ref([])
    const load_prob = ref([])

    onMounted(() => {
        load_data()
        resetDate();
    });

    const load_data = async() => {
        loadTotReq()
        loadTotProb()
    }

    const resetDate = () => {
        const start = moment(new Date()).format('YYYY-MM-01');
        const end = moment(new Date()).format('YYYY-MM-DD');
        date_input.value = {start: start, end:end}
    }

    const showTable = (status) => {
        details.value = status;
        console.log(status);
    }

    const loadTotReq = async () => {
        try {
            const response = await RequestService.getRequestDept();
            const load = response.data;
            const data = load.data;
            load_req.value = []
            load_req_progress.value = []
            load_req_done.value = []
            for (let i = 0; i < data.length; i++) {
                const req_date = moment(data[i].created_at).format('YYYYMMDD');
                if (moment(req_date).unix() >= moment(date_input.value.start).unix() && moment(req_date).unix() <= moment(date_input.value.end).unix()) {
                    const info = data[i].info.split(' ');
                    const kondisi = info[0];
                    if (kondisi != 'Canceled') {
                        load_req.value.push({
                            id:data[i].id, 
                            nomor:data[i].no_wo,
                            status:Number(data[i].status),
                            keperluan:data[i].keperluan,
                            tgl:moment(data[i].created_at).format('DD MMM YYYY, HH:mm:SS'),
                            requestor:data[i].user.name,
                            jabatan:data[i].user.jabatan,
                            kategori:data[i].category.nama_kategori,
                            permintaan:data[i].category.nama_permintaan,
                        })
                        if (Number(data[i].status) > 2 && Number(data[i].status) < 6) {
                            load_req_progress.value.push({
                                id:data[i].id, 
                                nomor:data[i].no_wo,
                                status:Number(data[i].status),
                                keperluan:data[i].keperluan,
                                tgl:moment(data[i].created_at).format('DD MMM YYYY, HH:mm:SS'),
                                requestor:data[i].user.name,
                                jabatan:data[i].user.jabatan,
                                kategori:data[i].category.nama_kategori,
                                permintaan:data[i].category.nama_permintaan,
                            })
                        }
                        if (Number(data[i].status) == 6) {
                            load_req_done.value.push({
                                id:data[i].id, 
                                nomor:data[i].no_wo,
                                status:Number(data[i].status),
                                keperluan:data[i].keperluan,
                                tgl:moment(data[i].created_at).format('DD MMM YYYY, HH:mm:SS'),
                                requestor:data[i].user.name,
                                jabatan:data[i].user.jabatan,
                                kategori:data[i].category.nama_kategori,
                                permintaan:data[i].category.nama_permintaan,
                            })
                        }
                    }
                }
            }

            // Result
            tot_req.value = load_req.value.length;
            tot_req_progress.value = load_req_progress.value.length;
            tot_req_done.value = load_req_done.value.length;
            // console.log(load_req.value)
        } catch (error) {
            load_req.value = []
            load_req_progress.value = []
            load_req_done.value = []
            tot_req.value = 0;
            tot_req_progress.value = 0;
            tot_req_done.value = 0;
        }
    }

    const loadTotProb = async () => {
        try {
            const response = await ProblemService.getProblemDept();
            const load = response.data;
            const data = load.data;
            load_prob.value = []
            for (let i = 0; i < data.length; i++) {
                const req_date = moment(data[i].created_at).format('YYYY-MM-DD');
                if (moment(req_date).unix() >= moment(date_input.value.start).unix() && moment(req_date).unix() <= moment(date_input.value.end).unix()) {
                    const info = data[i].info.split(' ');
                    const kondisi = info[0];
                    if (kondisi != 'Canceled') {
                        load_prob.value.push({
                            id:data[i].id, 
                            nomor:data[i].no_wo,
                            status:Number(data[i].status),
                            keperluan:data[i].keperluan,
                            tgl:moment(data[i].created_at).format('DD MMM YYYY, HH:mm:SS'),
                            requestor:data[i].user.name,
                            jabatan:data[i].user.jabatan,
                            kategori:data[i].category.nama_kategori,
                            permintaan:data[i].category.nama_permintaan,
                        })
                    }
                }
            }
            tot_prob.value = load_prob.value.length;
        } catch (error) {
            load_prob.value = []
            tot_prob.value = 0;
        }
    }

    const aksi = () => {
        console.log(date_input.value)
    }
</script>

<template>
    <div class="grid align-items-center">
        <div class="col-12 md:col-6">
            <div class="flex align-items-center justify-content-between md:justify-content-start flex-wrap">
                <div class="">
                    <i class="mx-2 text-5xl pi pi-home"></i>
                </div>
                <div class="mx-0 md:mx-3">
                    <strong class="text-5xl font-normal">Dashboard</strong>
                </div>
            </div>
        </div>
        <div class="col-12 md:col-3 p-fluid">
            <span class="p-float-label">
                <InputText type="date" v-model="date_input.start" @change="load_data"/>
                <label for="username">Start Date</label>
            </span>
        </div>
        <div class="col-12 md:col-3 p-fluid">
            <span class="p-float-label">
                <InputText type="date" v-model="date_input.end" @change="load_data"/>
                <label for="username">End Date</label>
            </span>
        </div>
        <div class="col-12 md:col-3">
            <div class="card bg-blue-500 p-fluid">
                <div class="flex align-items-center justify-content-between">
                    <div>
                        <strong :class="`${dark} font-normal text-2xl`">Total Request</strong>
                    </div>
                    <div class="">
                        <span :class="`${dark} font-bold text-3xl`">{{tot_req}}</span>
                    </div>
                </div>
                <div class="p-3 bg-white mt-5 border-round-2xl">
                    <Button class="font-semibold" label="Show Details" icon="pi pi-search" severity="info" outlined size="sm" @click="showTable('show_tbl_req')" v-show="details !== 'show_tbl_req' "></Button>
                    <Button class="font-semibold" label="Hide Details" icon="pi pi-times" severity="info" outlined size="sm" @click="showTable('')" v-show="details === 'show_tbl_req'"></Button>
                </div>
            </div>
        </div>
        <div class="col-12 md:col-3">
            <div class="card bg-yellow-500 p-fluid">
                <div class="flex align-items-center justify-content-between">
                    <div>
                        <strong :class="`${dark} font-normal text-2xl`">Total Progress</strong>
                    </div>
                    <div>
                        <span :class="`${dark} font-bold text-3xl`">{{tot_req_progress}}</span>
                    </div>
                </div>
                <div class="p-3 bg-white mt-5 border-round-2xl">
                    <Button class="font-semibold" label="Show Details" icon="pi pi-search" severity="warning" outlined size="sm" @click="showTable('show_tbl_req_progress')" v-show="details !== 'show_tbl_req_progress' "></Button>
                    <Button class="font-semibold" label="Hide Details" icon="pi pi-times" severity="warning" outlined size="sm" @click="showTable('')" v-show="details === 'show_tbl_req_progress'"></Button>
                </div>
            </div>
        </div>
        <div class="col-12 md:col-3">
            <div class="card bg-green-500 p-fluid">
                <div class="flex align-items-center justify-content-between">
                    <div>
                        <strong :class="`${dark} font-normal text-2xl`">Total Done</strong>
                    </div>
                    <div>
                        <span :class="`${dark} font-bold text-3xl`">{{tot_req_done}}</span>
                    </div>
                </div>
                <div class="p-3 bg-white mt-5 border-round-2xl">
                    <Button class="font-semibold" label="Show Details" icon="pi pi-search" severity="success" outlined size="sm" @click="showTable('show_tbl_req_done')" v-show="details !== 'show_tbl_req_done'"></Button>
                    <Button class="font-semibold" label="Hide Details" icon="pi pi-times" severity="success" outlined size="sm" @click="showTable('')" v-show="details === 'show_tbl_req_done'"></Button>
                </div>
            </div>
        </div>
        <div class="col-12 md:col-3">
            <div class="card bg-red-500 p-fluid">
                <div class="flex align-items-center justify-content-between">
                    <div>
                        <strong :class="`${dark} font-normal text-2xl`">Total Problem IT</strong>
                    </div>
                    <div>
                        <span :class="`${dark} font-bold text-3xl`">{{tot_prob}}</span>
                    </div>
                </div>
                <div class="p-3 bg-white mt-5 border-round-2xl">
                    <Button class="font-semibold" label="Show Details" icon="pi pi-search" severity="danger" outlined size="sm" @click="showTable('show_tbl_prob')" v-show="details !== 'show_tbl_prob'"></Button>
                    <Button class="font-semibold" label="Hide Details" icon="pi pi-times" severity="danger" outlined size="sm" @click="showTable('')" v-show="details === 'show_tbl_prob'"></Button>
                </div>
            </div>
        </div>
        <div class="col-12 md:col-12">
            <div class="card">
                <h6 class="text-2xl font-normal">List Data {{ details == 'show_tbl_req' ? '- Total Request' : details == 'show_tbl_req_progress' ? '- Total Request Progress' : details == 'show_tbl_req_done' ? '- Total Request Done' : details == 'show_tbl_prob' ? '- Total Problem' : '' }}</h6>
                <Divider/>
                <h6 class="text-center" v-show="details === ''"> -- Not Found --</h6>
                <div v-show="details !== ''">
                    <DataTable :value="details == 'show_tbl_req' ? load_req : details == 'show_tbl_req_progress' ? load_req_progress : details == 'show_tbl_req_done' ? load_req_done : load_prob" paginator :rows="5" tableStyle="min-width: 50rem">
                        <template #empty> <p class="text-center">Data not found.</p> </template>
                        <Column field="nomor" header="No" sortable>
                            <template #body="{ data }">
                                <strong>{{ data.nomor }}</strong>
                            </template>
                        </Column>
                        <Column field="tgl" header="Request Time" sortable>
                            <template #body="{ data }">
                                <strong>{{ data.tgl }}</strong>
                            </template>
                        </Column>
                        <Column field="requestor" header="Name"></Column>
                        <Column field="jabatan" header="Position"></Column>
                        <Column field="kategori" header="Category"></Column>
                        <Column field="keperluan" header="Necessary"></Column>
                    </DataTable>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
