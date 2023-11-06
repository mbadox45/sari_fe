<script setup>
    import { onMounted, ref } from 'vue';
    import moment from 'moment';

    // const date_now = moment(new Date()).format('yyyy-mm-dd');
    const date_input = ref({start:'', end:''});
    const dark = 'text-white';

    onMounted(() => {
        resetDate();
    });

    const resetDate = () => {
        const start = moment(new Date()).format('YYYY-MM-01');
        const end = moment(new Date()).format('YYYY-MM-DD');
        date_input.value = {start: start, end:end}
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
                <InputText type="date" v-model="date_input.start" @change="aksi"/>
                <label for="username">Start Date</label>
            </span>
        </div>
        <div class="col-12 md:col-3 p-fluid">
            <span class="p-float-label">
                <InputText type="date" v-model="date_input.end" @change="aksi"/>
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
                        <span :class="`${dark} font-bold text-3xl`">23</span>
                    </div>
                </div>
                <div class="p-3 bg-white mt-5 border-round-2xl">
                    <Button class="font-semibold" label="Show Details" icon="pi pi-search" severity="info" outlined size="sm"></Button>
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
                        <span :class="`${dark} font-bold text-3xl`">23</span>
                    </div>
                </div>
                <div class="p-3 bg-white mt-5 border-round-2xl">
                    <Button class="font-semibold" label="Show Details" icon="pi pi-search" severity="warning" outlined size="sm"></Button>
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
                        <span :class="`${dark} font-bold text-3xl`">23</span>
                    </div>
                </div>
                <div class="p-3 bg-white mt-5 border-round-2xl">
                    <Button class="font-semibold" label="Show Details" icon="pi pi-search" severity="success" outlined size="sm"></Button>
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
                        <span :class="`${dark} font-bold text-3xl`">23</span>
                    </div>
                </div>
                <div class="p-3 bg-white mt-5 border-round-2xl">
                    <Button class="font-semibold" label="Show Details" icon="pi pi-search" severity="danger" outlined size="sm"></Button>
                </div>
            </div>
        </div>
        <div class="col-12 md:col-12">
            <div class="card">
                <h6 class="text-2xl">Details Data</h6>
                <Divider/>
                <h6 class="text-center"> -- Not Found --</h6>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
