<script setup>
    import { onMounted, ref } from 'vue';
    import moment from 'moment';
    import { useRouter } from 'vue-router';

    const router = useRouter();

    const form = ref({id:null, office:'', email_inl:'', atasan_id:null, kategori:null, jenis_permintaan:null, keperluan:''})

    onMounted(() => {

    });

    const aksi = () => {
        console.log(date_input.value)
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
                        <i class="mx-2 text-4xl pi pi-ticket"></i>
                        <strong class="text-4xl font-normal">Action Request</strong>
                    </div>
                    <div class="hidden md:block">
                        <strong class="text-500 font-light">Request <i class="pi pi-angle-double-right mx-2"></i> Action Request</strong>
                    </div>
                </div>
                <Divider/>
                <form>
                    <div class="grid">
                        <div class="col-12 md:col-6">
                            <div class="flex flex-column gap-2">
                                <label>Office</label>
                                <Dropdown v-model="selectedCountry" :options="countries" filter optionLabel="name" placeholder="Select a Office" class="w-full"></Dropdown>
                            </div>
                        </div>
                        <div class="col-12 md:col-6">
                            <div class="flex flex-column gap-2">
                                <label>Email : <span class="text-sm text-red-400">@inl.co.id</span></label>
                                <InputText id="username" v-model="value" />
                            </div>
                        </div>
                        <div class="col-12 md:col-12">
                            <div class="flex flex-column gap-2">
                                <label>Head of Division</label>
                                <Dropdown v-model="selectedCountry" :options="countries" filter optionLabel="name" placeholder="Select a Head of Division" class="w-full"></Dropdown>
                            </div>
                        </div>
                        <div class="col-12 md:col-6">
                            <div class="flex flex-column gap-2">
                                <label>Category</label>
                                <Dropdown v-model="selectedCountry" :options="countries" filter optionLabel="name" placeholder="Select a Category" class="w-full"></Dropdown>
                            </div>
                        </div>
                        <div class="col-12 md:col-6">
                            <div class="flex flex-column gap-2">
                                <label>Sub-Category</label>
                                <InputText id="username" v-model="value" />
                            </div>
                        </div>
                        <div class="col-12 md:col-12">
                            <div class="flex flex-column gap-2">
                                <label>Necessary</label>
                                <Textarea v-model="value" rows="5" cols="30" />
                            </div>
                        </div>
                        <div class="col-12 md:col-6">
                            <div class="flex gap-2">
                                <Button label="Back" severity="secondary" icon="pi pi-arrow-left" outlined @click="link_route('request')" />
                            </div>
                        </div>
                        <div class="col-12 md:col-6">
                            <div class="flex justify-content-end gap-2">
                                <Button label="Save" severity="success" icon="pi pi-save"/>
                                <Button label="Reset" severity="danger" icon="pi pi-refresh"/>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
