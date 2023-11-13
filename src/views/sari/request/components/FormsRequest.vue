<script setup>
    import { ref, defineProps, defineEmits, onMounted } from 'vue';

    // API
    import {listOffice} from '@/api/DataVariable';
    import RequestService from '@/api/RequestService.js';
    import CategoryService from '@/api/CategoryService'
    import UserService from '@/api/UserService'

    // Variable
    const props = defineProps({
        data_dialog:{
            type:Array
        },
        status:{
            type:String
        },
    });

    const datas = props.data_dialog;
    const statusData = props.status;
    const list_office = ref(listOffice);
    const list_kategori = ref([]);
    const list_sub_kategori = ref([]);
    const list_atasan = ref([]);
    const disabled_sub_category = ref(true);
    const payload = ref(JSON.parse(localStorage.getItem('payload')));
    const form = ref({id:null, office:null, email_inl:payload.value.email, atasan_id:null, kategori:null, jenis_permintaan:null, keperluan:''})

    // Emit from ApproveRequest.vue
    const emit = defineEmits(['submit'])

    const load_data = async () => {
        loadKategori()
        loadUser();
        if (statusData == 'add') {
            reset_form();
        } else {
            form.value = {
                id: datas.id,
                office: datas.office,
                email_inl:payload.value.email, 
                atasan_id:datas.atasan_id, 
                kategori:datas.id_kategori, 
                jenis_permintaan:datas.id_permintaan, 
                keperluan:datas.keperluan
            };
            loadSubKategori();
        }
    }

    onMounted(() => {
        load_data()
    });

    const reset_form = () => {
        form.value = {
            office: null,
            email_inl:payload.value.email, 
            atasan_id:null, 
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
            console.log(data)
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

    const loadUser = async() => {
        try {
            const response = await UserService.getUsers();
            const load = response.data;
            const data = load.data;
            list_atasan.value = []
            for (let i = 0; i < data.length; i++) {
                const grade = Number(data[i].grade)
                // if (grade >= 3 && data[i].departemen == payload.value.division.divisi) {
                if (grade >= 5) {
                    if (grade > Number(payload.value.grade)) {
                        list_atasan.value.push({
                            id: data[i].id,
                            name: data[i].name +' - '+data[i].divisi,
                            grade: grade,
                        })
                    }
                }
            }
            // console.log(list_atasan.value, Number(payload.value.grade))
        } catch (error) {
            list_atasan.value = []
            console.log(error);
        }
    }

    const postData = async (ket) => {
        if (ket == 'save') {
            try {
                if (form.value.keperluan != '' && form.value.atasan_id != null && form.value.jenis_permintaan != null && form.value.kategori != null && form.value.office != null ) {
                    // console.log('berhasil')
                    if (statusData == 'add') {
                        await RequestService.addRequest(form.value).then(res => {
                            const load = res.data;
                            if (load.code == 200) {
                                emit('submit','add')
                            }
                        })
                    } else {
                        await RequestService.updateRequest(datas.id,form.value).then(res => {
                            const load = res.data;
                            if (load.code == 200) {
                                emit('submit','edit')
                            }
                        })
                    }
                } else {
                    emit('submit','warning')
                }
            } catch (error) {
                emit('submit','danger')
            }
        } else {
            emit('submit','close')
        }
    }

</script>
<template>
    <form>
        <div class="grid">
            <div class="col-12 md:col-6">
                <div class="flex flex-column gap-2">
                    <label>Office</label>
                    <Dropdown v-model="form.office" :options="list_office" filter optionLabel="office" optionValue="name" placeholder="Select a Office" class="w-full"></Dropdown>
                </div>
            </div>
            <div class="col-12 md:col-6">
                <div class="flex flex-column gap-2">
                    <label>Email : <span class="text-sm text-red-400">@inl.co.id</span></label>
                    <InputText id="username" v-model="form.email_inl" disabled />
                </div>
            </div>
            <div class="col-12 md:col-12">
                <div class="flex flex-column gap-2">
                    <label>Head of Division</label>
                    <Dropdown v-model="form.atasan_id" :options="list_atasan" filter optionLabel="name" optionValue="id" placeholder="Select a Head of Division" class="w-full"></Dropdown>
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
                    <label>Necessary</label>
                    <Textarea v-model="form.keperluan" rows="5" cols="30" />
                </div>
            </div>
            <div class="col-12 md:col-6">
                <div class="flex gap-2">
                    <Button label="close" severity="secondary" icon="pi pi-times" outlined @click="postData('close')" />
                </div>
            </div>
            <div class="col-12 md:col-6">
                <div class="flex justify-content-end gap-2">
                    <Button label="Save" severity="success" icon="pi pi-save" @click="postData('save')"/>
                    <Button label="Reset" severity="danger" icon="pi pi-refresh" @click="reset_form()"/>
                </div>
            </div>
        </div>
    </form>
</template>