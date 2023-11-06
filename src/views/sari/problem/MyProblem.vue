<script setup>
    import { onMounted, ref } from 'vue';
    import moment from 'moment';

    // API
    import {listProblem, listOffice, listJenis} from '@/api/DataVariable';

    // const date_now = moment(new Date()).format('yyyy-mm-dd');
    const request_data = ref([])
    const visible = ref(false);
    const list_office = ref(listOffice);
    const list_jenis = ref(listJenis);
    const payload = ref(JSON.parse(localStorage.getItem('payload')));
    const form = ref({id:null, office:'', email_inl:payload.value.email, remark:'', kategori:1, jenis_permintaan:null, keperluan:''})

    onMounted(() => {
        load_data();
    });

    const load_data = () => {
        request_data.value = []
        for (let i = 0; i < listProblem.length; i++) {
            request_data.value.push({
                id:listProblem[i].id, 
                nomor:listProblem[i].nomor,
                status:listProblem[i].info,
                tgl:listProblem[i].tgl,
                keperluan:listProblem[i].keperluan,
            })
        }
        console.log(payload.value);
    }

    const showDialog = () => {
        visible.value = true;
    }
    const reset_form = () => {
        form.value = {
            office: '',
            email_inl:'', 
            atasan_id:null, 
            kategori:null, 
            jenis_permintaan:null, 
            keperluan:''
        }
    }
</script>

<template>
    <Dialog v-model:visible="visible" modal :draggable="false" :style="{ width: '70vw' }">
        <template #header>
            <h5>FORM PROBLEM</h5>
        </template>
        <div class="grid">
            <div class="col-12 md:col-6">
                <div class="flex flex-column gap-2">
                    <label>Office</label>
                    <Dropdown v-model="form.office" :options="list_office" filter optionLabel="office" placeholder="Select a Office" class="w-full"></Dropdown>
                </div>
            </div>
            <div class="col-12 md:col-6">
                <div class="flex flex-column gap-2">
                    <label>Email : <span class="text-sm text-red-400">@inl.co.id or @gmail.com</span></label>
                    <InputText id="username" v-model="form.email_inl" disabled />
                </div>
            </div>
            <div class="col-12 md:col-12">
                <div class="flex flex-column gap-2">
                    <label>Remark</label>
                    <Textarea v-model="form.remark" rows="4" cols="30" />
                    <small class="text-red-400" id="remark">Tulis problem yang di alami dan berikan ID Anydesk jika ingin di remote.</small>
                </div>
            </div>
            <div class="col-12 md:col-12">
                <div class="flex flex-column gap-2">
                    <label>Jenis</label>
                    <Dropdown v-model="form.jenis_permintaan" :options="list_jenis" optionLabel="name" placeholder="Select a Jenis" class="w-full"></Dropdown>
                </div>
            </div>
            <div class="col-12 md:col-12">
                <div class="flex flex-column gap-2">
                    <label>Keperluan</label>
                    <Textarea v-model="form.keperluan" rows="4" cols="30" />
                </div>
            </div>
            <div class="col-12 md:col-6">
                <div class="flex gap-2">
                    <Button label="Close" severity="secondary" icon="pi pi-times" outlined @click="visible = false" />
                </div>
            </div>
            <div class="col-12 md:col-6">
                <div class="flex justify-content-end gap-2">
                    <Button label="Save" severity="success" icon="pi pi-save"/>
                    <Button label="Reset" severity="danger" icon="pi pi-refresh" @click="reset_form()"/>
                </div>
            </div>
        </div>
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
                        <Button label="Add Problem" icon="pi pi-plus" size="small" outlined severity="info" @click="showDialog"/>
                    </div>
                </div>
                <Divider/>
                <!-- <h6 class="text-center"> -- Not Found --</h6> -->
                <DataTable :value="request_data" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem">
                    <Column field="nomor" header="No" style="width: 25%"></Column>
                    <Column field="tgl" header="Tanggal Request" style="width: 25%"></Column>
                    <Column field="keperluan" header="Keperluan" style="width: 25%"></Column>
                    <Column field="status" header="Status" style="width: 25%"></Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
