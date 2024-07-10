<script setup>
    import { onMounted, ref } from 'vue';
    import { FilterMatchMode } from 'primevue/api';

    // API
    import CategoryService from '@/api/CategoryService.js';

    const load_category = ref([])
    const forms = ref({
        id: null,
        nama_permintaan: null,
    })
    const loading = ref(true);
    const status_form = ref('add')

    const messages = ref([]);
    let count = ref(0);

    onMounted(() => {
        load_data()
    });

    const load_data = async() => {
        try {
            load_category.value = []
            const response = await CategoryService.getCategoryUserDept()
            const load = response.data;
            const data = load.data;
            for (let i = 0; i < data.length; i++) {
                load_category.value.push({
                    id: data[i].id,
                    id_kategori: data[i].id_kategori,
                    nama_kategori: data[i].nama_kategori,
                    nama_permintaan: data[i].nama_permintaan,
                })
            }
            loading.value = false
        } catch (error) {
            load_category.value = []
            loading.value = false
        }
    }

    const editData = (data) => {
        status_form.value = 'edit'
        forms.value= {
            id: data.id,
            nama_permintaan: data.nama_permintaan,
        }
    }

    const resetForm = () => {
        status_form.value = 'add'
        forms.value= {
            id: null,
            nama_permintaan: null,
        }
        messages.value = [];
    }

    const add_data = async(data) => {
        try {
            const response = await CategoryService.addCategory(data)
            const load = response.data;
            return {
                success: load.success,
                message: load.message
            }
        } catch (error) {
            return {
                success: error.response.data.success,
                message: error.response.data.message
            };
        }
    }

    const edit_data = async(data) => {
        try {
            const response = await CategoryService.updateCategory(data.id, data)
            const load = response.data;
            return {
                success: load.success,
                message: load.message
            }
        } catch (error) {
            return {
                success: error.response.data.success,
                message: error.response.data.message
            };
        }
    }

    const postData = async() => {
        if (forms.value.nama_permintaan != null) {
            let response;
            if (status_form.value == 'add') {
                response = await add_data(forms.value);
            } else {
                response = await edit_data(forms.value);
            }
            if (response.success == true) {
                loading.value = true
                setTimeout(function() {
                    load_data()
                    resetForm()
                }, 3000);
                messages.value = [
                    { severity: 'success', content: 'Data berhasil disimpan.', id: count.value++ }
                ];
            } else {
                messages.value = [
                    { severity: 'error', content: 'Terjadi kesalahan sistem.', id: count.value++ }
                ];
            }
        } else {
            messages.value = [
                { severity: 'warn', content: 'Mohon data dilengkapi', id: count.value++ }
            ];
        }
    }
    
</script>

<template>
    <transition-group name="p-message" tag="div">
        <Message v-for="msg of messages" :key="msg.id" :severity="msg.severity">{{ msg.content }}</Message>
    </transition-group>
    <div class="w-full flex flex-column gap-2">
        <Panel :header="status_form == 'add' ? 'Form Category (Add)' : 'Form Category (Edit)'">
            <div class="flex gap-3 align-items-center m-0">
                <InputText v-model="forms.nama_permintaan" placeholder="Category" class="w-full"/>
                <div class="flex gap-2">
                    <Button icon="pi pi-save" :disabled="loading" severity="success" @click="postData"/>
                    <Button icon="pi pi-refresh" outlined severity="secondary" @click="resetForm"/>
                </div>
            </div>
        </Panel>
        <DataTable :value="load_category" scrollable scrollHeight="400px" :loading="loading">
            <template #loading> Loading category data. Please wait. </template>
            <Column field="nama_permintaan" header="Category" sortable>
                <template #body="{ data }">
                    <small class="capitalize">{{ data.nama_permintaan }}</small>
                </template>
            </Column>
            <Column field="nama_kategori" header="Dept">
                <template #body="{ data }">
                    <small class="capitalize">{{ data.nama_kategori }}</small>
                </template>
            </Column>
            <Column field="id">
                <template #body="{ data }">
                    <Button icon="pi pi-pencil" size="small" severity="warning" @click="editData(data)"/>
                </template>
            </Column>
        </DataTable>
    </div>
</template>