<script setup>
    import { onMounted, ref, defineProps, defineEmits } from 'vue';

    // Variable
    const props = defineProps({
        status_data:{
            type:String
        },
        data_dialog:{
            type:Array
        },
    });

    // Emit from ApproveRequest.vue
    const emit = defineEmits(['submit'])


    // API
    import ProblemService from '@/api/ProblemService';
    import CategoryService from '@/api/CategoryService'
    import {listOffice} from '@/api/DataVariable';

    const list_office = ref(listOffice);
    const list_kategori = ref([]);
    const list_sub_kategori = ref([]);
    const disabled_sub_category = ref(true);

    const datas = props.data_dialog;
    const statusData = props.status_data;
    const roles = ref(localStorage.getItem('roles'));
    const payload = ref(JSON.parse(localStorage.getItem('payload')));
    const form = ref({id:null, office:null, email_inl:payload.value.email, remark:'', kategori:null, jenis_permintaan:null, keperluan:''})

    const loadData = async() => {
        loadKategori()
        if (statusData === 'tambah') {
            reset_form();
        } else {
            form.value = {
                id: datas.id,
                office: datas.office,
                email_inl: datas.email_inl,
                remark: datas.remark,
                kategori: datas.kategori2,
                jenis_permintaan: datas.jenis_permintaan,
                keperluan: datas.keperluan,
            }
            loadSubKategori()
        }
    }

    onMounted(() => {
        loadData();
    });

    const reset_form = () => {
        form.value = {
            office: null,
            email_inl:payload.value.email, 
            remark:'', 
            kategori:null, 
            jenis_permintaan:null, 
            keperluan:''
        }
    }

    const loadKategori = async() => {
        try {
            const response = await CategoryService.getCategoryDept();
            const load = response.data;
            const data = load.data;
            const kategori = Object.keys(data).map(id => ({
                id: parseInt(id, 10),
                name: data[id]
            }))
            list_kategori.value = kategori
        } catch (error) {
            list_kategori.value = []
            console.log(error);
        }
    }
    const loadSubKategori = async() => {
        try {
            disabled_sub_category.value = false;
            const response = await CategoryService.getCategoryByChoosenDept(form.value.kategori);
            const load = response.data;
            const data = load.data;
            // console.log(data)
            list_sub_kategori.value = []
            for (let i = 0; i < data.length; i++) {
                list_sub_kategori.value.push({
                    id: data[i].id,
                    name: data[i].nama_permintaan,
                })
            }
        } catch (error) {
            list_sub_kategori.value = []
            console.log(error);
        }
    }

    const postData = (ket) => {
        // console.log(ket)
        if (ket == 'tambah') {
            try {
                if (form.value.office !== null && form.value.keperluan !== '' && form.value.remark !== '' && form.value.kategori !== null && form.value.jenis_permintaan !== null) {
                    ProblemService.addProblem(form.value).then(res => {
                        const load = res.data;
                        if (load.code == 200) {
                            emit('submit',ket)
                        } else {
                            emit('submit','failed')
                        }
                    })
                } else {
                    emit('submit','warning')
                }
            } catch (error) {
                emit('submit','failed')
            }
        } else if (ket == 'edit') {
            try {
                if (form.value.office !== null && form.value.keperluan !== '' && form.value.remark !== '' && form.value.kategori !== null && form.value.jenis_permintaan !== null) {
                    const response = ProblemService.updateProblem(form.value.id,form.value)
                    const load = response.data;
                    if (load.code == 200) {
                        emit('submit',ket)
                    } 
                } else {
                    emit('submit','warning')
                }
            } catch (error) {
                emit('submit','failed')
            }
        } else {
            emit('submit','close')
        }
    }
</script>
<template>
    <div class="grid">
        <div class="col-12 md:col-6">
            <div class="flex flex-column gap-2">
                <label>Office</label>
                <Dropdown v-model="form.office" :options="list_office" filter optionLabel="office" optionValue="office" placeholder="Select a Office" class="w-full"></Dropdown>
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
        <div class="col-12 md:col-6">
            <div class="flex flex-column gap-2">
                <label>Category</label>
                <Dropdown v-model="form.kategori" :options="list_kategori" filter optionLabel="name" optionValue="id" placeholder="Select a Category" class="w-full" @change="loadSubKategori()"></Dropdown>
            </div>
        </div>
        <div class="col-12 md:col-6">
            <div class="flex flex-column gap-2">
                <label>Request Type</label>
                <Dropdown v-model="form.jenis_permintaan" :options="list_sub_kategori" filter optionLabel="name" optionValue="id" placeholder="Select a Sub-Category" class="w-full" :disabled="disabled_sub_category"></Dropdown>
            </div>
        </div>
        <div class="col-12 md:col-12">
            <div class="flex flex-column gap-2">
                <label>Keperluan</label>
                <Textarea v-model="form.keperluan" rows="4" cols="30" />
            </div>
        </div>
        <!-- <div class="col-12 md:col-6">
            <div class="flex gap-2">
                <Button label="Close" severity="secondary" icon="pi pi-times" outlined @click="postData('close')" />
            </div>
        </div> -->
        <div class="col-12 md:col-12">
            <div class="flex justify-content-end gap-2">
                <Button label="Save" severity="success" icon="pi pi-save" @click="postData(statusData)"/>
                <Button label="Reset" severity="danger" icon="pi pi-refresh" @click="reset_form()"/>
            </div>
        </div>
    </div>
</template>