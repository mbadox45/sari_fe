<script setup>
    import { onMounted, ref } from 'vue';
    import { useRouter } from 'vue-router';
    import moment from 'moment';

    // API
    import { listOffice } from '@/api/DataVariable'
    import RequestService from '@/api/RequestService'

    const router = useRouter();

    const payload = ref(JSON.parse(localStorage.getItem('payload')));
    const form = ref({id:null, office:'', email_inl:payload.value.email, atasan_id:41, kategori:1, jenis_permintaan:1, keperluan:''})
    const list_office = ref(listOffice);

    onMounted(() => {

    });

    const aksi = () => {
        console.log(date_input.value)
    }

    const reset_form = () => {
        form.value = {
            office: '',
            email_inl:payload.value.email, 
            atasan_id:41, 
            kategori:1, 
            jenis_permintaan:1, 
            keperluan:''
        }
    }

    const postData = () => {
        RequestService.addRequest(form.value).then(res => {
            const load = res.data;
            // if (load.code == 200) {
            //     emit('submit', ket)
            // } else {
            //     emit('submit', 'warning')
            // }
        }).catch(error => {
            // emit('submit', 'error')
            console.error(error.response.status);
        })
    }

    const link_route = (link) => {
        router.push(`/${link}`);
    };
</script>

<template>
    <div class="grid align-items-center">
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
                                <Dropdown v-model="form.atasan_id" :options="countries" filter optionLabel="name" placeholder="Select a Head of Division" class="w-full"></Dropdown>
                            </div>
                        </div>
                        <div class="col-12 md:col-6">
                            <div class="flex flex-column gap-2">
                                <label>Category</label>
                                <Dropdown v-model="form.kategori" :options="countries" filter optionLabel="name" placeholder="Select a Category" class="w-full"></Dropdown>
                            </div>
                        </div>
                        <div class="col-12 md:col-6">
                            <div class="flex flex-column gap-2">
                                <label>Sub-Category</label>
                                <InputText id="username" v-model="form.jenis_permintaan" />
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
