<script setup>
    import { onMounted, ref } from 'vue';
    import { useRouter } from 'vue-router';
    import moment from 'moment';
    

    const router = useRouter();

    const request_data = ref([])

    onMounted(() => {
        aksi()
    });
    

    const aksi = async () => {
        
    }

    const link_route = (link) => {
        if (link.status === 'add') {
            router.push(`/form-request?status=${link.status}`);
        } else {
            router.push(`/form-request?status=${link.status}&id=${link.id}`);
        }
    };
</script>

<template>
    <div class="grid align-items-center">
        <div class="col-12 md:col-12">
            <div class="flex align-items-center justify-content-end md:justify-content-between">
                <div>
                    <i class="mx-2 text-5xl pi pi-ticket"></i>
                    <strong class="text-5xl font-normal">My Request</strong>
                </div>
                <div class="hidden md:block">
                    <strong class="text-500 font-light">Request <i class="pi pi-angle-double-right mx-2"></i> My Request</strong>
                </div>
            </div>
        </div>
        <div class="col-12 md:col-12">
            <div class="card">
                <div class="flex justify-content-between align-items-center">
                    <div>
                        <h6 class="text-2xl">Table Request</h6>
                    </div>
                    <div>
                        <Button label="Add Request" size="small" outlined severity="info" @click="link_route({status:'add'})"/>
                    </div>
                </div>
                <Divider/>
                <!-- <h6 class="text-center"> -- Not Found --</h6> -->
                <DataTable :value="request_data" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem">
                    <Column field="tgl" header="Tanggal" style="width: 25%"></Column>
                    <Column field="kategori" header="Kategori" style="width: 25%"></Column>
                    <Column field="permintaan" header="Jenis Permintaan" style="width: 25%"></Column>
                    <Column field="keperluan" header="Keperluan" style="width: 25%"></Column>
                    <Column field="status" header="Status" style="width: 25%"></Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
