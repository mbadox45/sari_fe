import moment from "moment/moment"
const date_now = moment().format('DD-MM-YYYY')
const date_ago =  moment().subtract(10, 'days').format('DD-MM-YYYY');

// List for dropdown
export const listOffice = [
    { name: 'Head Office', office: 'Head Office' },
    { name: 'KLB Belawan', office: 'KLB Belawan' },
    { name: 'KLB Kualatanjung', office: 'KLB Kualatanjung' },
    { name: 'RO Medan', office: 'RO Medan' },
    { name: 'Filling Plan Surabaya', office: 'Filling Plan Surabaya' },
];
export const listJenis = [
    { name: 'Software', jenis: 1},
    { name: 'Hardware', jenis: 2},
    { name: 'Jaringan Internet', jenis: 3},
    { name: 'Lain-lain', jenis: 4},
];
export const listPrioritas = [
    { name: 'Rendah', prioritas: 1},
    { name: 'Menengah', prioritas: 2},
    { name: 'Tinggi', prioritas: 3},
];
export const listAction = [
    { name: 'Excute', aksi: 1},
    { name: 'Pending', aksi: 2},
    { name: 'Done', aksi: 3},
];

// Menu Pertanyaan
export const settingPertanyaan = [
    {
        label: 'Options',
        items: [
            {
                label: 'Update',
                icon: 'pi pi-refresh',
                command: () => {
                    toast.add({ severity: 'success', summary: 'Updated', detail: 'Data Updated', life: 3000 });
                }
            },
            {
                label: 'Delete',
                icon: 'pi pi-times',
                command: () => {
                    toast.add({ severity: 'warn', summary: 'Delete', detail: 'Data Deleted', life: 3000 });
                }
            }
        ]
    },
    {
        label: 'Navigate',
        items: [
            {
                label: 'Vue Website',
                icon: 'pi pi-external-link',
                url: 'https://vuejs.org/'
            },
            {
                label: 'Router',
                icon: 'pi pi-upload',
                to: '/fileupload'
            }
        ]
    }
];


// Breadcrumb Variable
export const BreadcrumbHome =  { icon: 'pi pi-home', to: '/home' };
export const listStatusRequest = [
    {status:'incoming', name:'Incoming'},
    {status:'done', name:'Done'},
    {status:'reject', name:'Reject'},
]
export const listStatus = [
    {id:0, name:'Reject / Cancel', color:'red-500'},
    {id:1, name:'Menunggu Persetujuan', color:'pink-500'},
    {id:2, name:'Menunggu Persetujuan Dalam Antrian', color:'indigo-500'},
    {id:3, name:'Sedang Dalam Antrian', color:'blue-500'},
    {id:4, name:'Pending', color:'orange-500'},
    {id:5, name:'Sedang Dalam Pengerjaan Tim', color:'cyan-500'},
    {id:6, name:'Selesai', color:'green-500'},
]
export const listStatusProblem = [
    {id:0, name:'Cancel / Reject', color:'red-500'},
    {id:1, name:'Waiting for a response from department of ', color:'pink-500'},
]

// Data Menu
export const menu_ict_executor = [
    {
        label: 'Home',
        items: [{ label: 'Home', icon: 'pi pi-fw pi-home', to: '/home' }]
    },
    {
        label: 'Main Menu',
        items: [
            { label: 'Request', icon: 'pi pi-fw pi-book', 
                items: [
                    {
                        label: 'My Request',
                        icon: 'pi pi-fw pi-ticket',
                        to: '/my-request'
                    },
                    {
                        label: 'Incoming Request',
                        icon: 'pi pi-fw pi-tag',
                        to: '/request'
                    },
                ]
            },
            { label: 'Problem', icon: 'pi pi-fw pi-exclamation-circle', 
                items: [
                    {
                        label: 'All Problem',
                        icon: 'pi pi-fw pi-exclamation-triangle',
                        to: '/problem'
                    },
                ]
            },
        ]
    },
];
export const menu_ict_approver = [
    {
        label: 'Home',
        items: [{ label: 'Home', icon: 'pi pi-fw pi-home', to: '/home' }]
    },
    {
        label: 'Main Menu',
        items: [
            { label: 'Request', icon: 'pi pi-fw pi-book', 
                items: [
                    {
                        label: 'My Request',
                        icon: 'pi pi-fw pi-ticket',
                        to: '/my-request'
                    },
                    {
                        label: 'Approval',
                        icon: 'pi pi-fw pi-check',
                        to: '/approve-request'
                    },
                    {
                        label: 'Incoming Request',
                        icon: 'pi pi-fw pi-tag',
                        to: '/request'
                    },
                ]
            },
            { label: 'Problem', icon: 'pi pi-fw pi-exclamation-circle', 
                items: [
                    {
                        label: 'Incoming Problem',
                        icon: 'pi pi-fw pi-exclamation-triangle',
                        to: '/problem'
                    },
                ]
            },
        ]
    },
];
export const menu_approver_after_grade_3 = [
    {
        label: 'Home',
        items: [{ label: 'Home', icon: 'pi pi-fw pi-home', to: '/home' }]
    },
    {
        label: 'Main Menu',
        items: [
            { label: 'Request', icon: 'pi pi-fw pi-book', 
                items: [
                    {
                        label: 'My Request',
                        icon: 'pi pi-fw pi-ticket',
                        to: '/my-request'
                    },
                    {
                        label: 'Approval',
                        icon: 'pi pi-fw pi-check',
                        to: '/approve-request'
                    },
                ]
            },
            { label: 'Problem', icon: 'pi pi-fw pi-exclamation-circle', 
                items: [
                    {
                        label: 'My Problem',
                        icon: 'pi pi-fw pi-info',
                        to: '/my-problem'
                    },
                ]
            },
        ]
    },
];
export const menu_user_requester = [
    {
        label: 'Home',
        items: [{ label: 'Home', icon: 'pi pi-fw pi-home', to: '/home' }]
    },
    {
        label: 'Main Menu',
        items: [
            { label: 'Request', icon: 'pi pi-fw pi-book', 
                items: [
                    {
                        label: 'My Request',
                        icon: 'pi pi-fw pi-ticket',
                        to: '/my-request'
                    },
                    {
                        label: 'Incoming Request',
                        icon: 'pi pi-fw pi-tag',
                        to: '/request'
                    },
                ]
            },
            { label: 'Problem', icon: 'pi pi-fw pi-exclamation-circle', 
                items: [
                    {
                        label: 'My Problem',
                        icon: 'pi pi-fw pi-info',
                        to: '/my-problem'
                    },
                ]
            },
        ]
    },
];
export const menu_user_approver = [
    {
        label: 'Home',
        items: [{ label: 'Home', icon: 'pi pi-fw pi-home', to: '/home' }]
    },
    {
        label: 'Main Menu',
        items: [
            { label: 'Request', icon: 'pi pi-fw pi-book', 
                items: [
                    {
                        label: 'My Request',
                        icon: 'pi pi-fw pi-ticket',
                        to: '/my-request'
                    },
                    {
                        label: 'Approval',
                        icon: 'pi pi-fw pi-check',
                        to: '/approve-request'
                    },
                    {
                        label: 'Incoming Request',
                        icon: 'pi pi-fw pi-tag',
                        to: '/request'
                    },
                ]
            },
            { label: 'Problem', icon: 'pi pi-fw pi-exclamation-circle', 
                items: [
                    {
                        label: 'My Problem',
                        icon: 'pi pi-fw pi-info',
                        to: '/my-problem'
                    },
                ]
            },
        ]
    },
];

// Data Bodong
export const listIncommingRequest = [
    {id:293, nomor:'REQ0002/ICT/X/2023', status:6, tgl:'2023-10-11', nama:'Meldeana Br.Tarigan', jabatan:'Officer Customer Service - Logistic', kategori:'ICT'},
    {id:235, nomor:'REQ0003/ICT/V/2023', status:3, tgl:'2023-05-02', nama:'Kiki Lestari', jabatan:'Officer GA - AMGA', kategori:'ICT'},
    {id:232, nomor:'REQ0003/ICT/I/2023', status:2, tgl:'2023-01-02', nama:'Doni Setiawan', jabatan:'Officer AM - AMGA', kategori:'ICT'},
]
export const listProblem = [
    {id:82, nomor:'IN0001/XI/2023', jenis_permintaan:'Software', user_id:'211', tgl:'2023-11-02', status:6, keperluan:'Test', office:'Head Office', info:'Mengajukan', keterangan:'kdodong', remark:'121120305', hp:'0859339068281', email_inl:'rioteguhard@gmail.com'},
]