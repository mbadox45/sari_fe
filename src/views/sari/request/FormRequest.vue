<script setup>
    import { onMounted, ref } from 'vue';
    import { useRouter } from 'vue-router';
    import { useToast } from 'primevue/usetoast';
    import moment from 'moment';

    // API
    import { listOffice } from '@/api/DataVariable'
    import { URL_WEB } from '../../../api/env';
    import RequestService from '@/api/RequestService'
    import CategoryService from '@/api/CategoryService'
    import UserService from '@/api/UserService'

    const router = useRouter();
    
    const loadings = ref(false);
    const time = ref(3000)
    const payload = ref(JSON.parse(localStorage.getItem('payload')));
    const form = ref({id:null, office:null, email_inl:payload.value.email, atasan_id:null, kategori:null, jenis_permintaan:null, keperluan:''})
    const list_office = ref(listOffice);
    const list_kategori = ref([]);
    const list_sub_kategori = ref([]);
    const list_atasan = ref([]);
    const disabled_sub_category = ref(true);
    
    const toast = useToast();
    
    onMounted(() => {
        aksi();
    });

    const aksi = () => {
        loadKategori()
        loadUser();
        // console.log(date_input.value)
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

    const postData = async() => {
        try {
            const aksi = await RequestService.addRequest(form.value);
            const data = aksi.data
            if (data.code == 200) {
                toast.add({ severity: 'success', summary: 'Successfully', detail: `Data saved successfully`, life: 3000 });
                setTimeout(function() {
                    loadings.value = false;
                    window.location.replace(URL_WEB+'home');
                }, time.value);
            } else {
                toast.add({ severity: 'warn', summary: 'Failed', detail: `Please check your data!`, life: 3000 });
            }
        } catch (error) {
            console.log(error)
            toast.add({ severity: 'danger', summary: 'Attention', detail: 'Unable to post data', life: 3000 });
        }
        // RequestService.addRequest(form.value).then(res => {
        //     loadings.value = true
        //     const load = res.data;
        //     if (load.code == 200) {
        //         setTimeout(function() {
        //             loadings.value = false;
        //             window.location.replace(URL_WEB+'home');
        //         }, time.value);
        //     } else {
        //         toast.add({ severity: 'warning', summary: 'Failed', detail: `Please check your data!`, life: 3000 });
        //         loadings.value = false;
        //     }
        // }).catch(error => {
        //     toast.add({ severity: 'danger', summary: 'Error', detail: `Please confirm to IT Development!`, life: 3000 });
        //     console.error(error.response.status);
        // })
    }

    const link_route = (link) => {
        router.push(`/${link}`);
    };
</script>

<template>
    <div class="grid align-items-center">
        <Toast/>
        <div class="col-12 md:col-12">
            <div class="card">
                <div class="flex align-items-center justify-content-end md:justify-content-between">
                    <div>
                        <i class="mx-2 text-5xl pi pi-ticket"></i>
                        <strong class="text-5xl font-normal">Form Request</strong>
                    </div>
                    <div class="hidden md:block">
                        <strong class="text-500 font-light">Request <i class="pi pi-angle-double-right mx-2"></i> Form Request</strong>
                    </div>
                </div>
                <Divider/>
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
                                <Button label="Back" severity="secondary" icon="pi pi-arrow-left" outlined @click="link_route('my-request')" />
                            </div>
                        </div>
                        <div class="col-12 md:col-6">
                            <div class="flex justify-content-end gap-2">
                                <Button label="Save" severity="success" icon="pi pi-save" @click="postData()"/>
                                <Button label="Reset" severity="danger" icon="pi pi-refresh" @click="reset_form()"/>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
