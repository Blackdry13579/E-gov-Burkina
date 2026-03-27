export const RECENT_REQUESTS = [
  {
    id: 'CDB-2026-004521',
    type: 'Acte de Naissance',
    status: 'VALIDÉE',
    date: '12 Mai 2026',
    citizen: {
      name: 'Jean-Baptiste Ouedraogo',
      cnib: 'B12345678',
      phone: '+226 70 00 00 00',
      email: 'j.ouedraogo@mail.bf'
    },
    details: {
      father: 'Moussa Ouedraogo',
      mother: 'Aminata Traoré',
      birthPlace: 'Ouagadougou, Secteur 15',
      birthDate: '12 Mars 1992'
    },
    documents: [
      { name: 'CNIB_recto.jpg', size: '1.2 MB', type: 'image' },
      { name: 'CNIB_verso.jpg', size: '1.1 MB', type: 'image' },
      { name: 'Certificat_Residence.pdf', size: '2.4 MB', type: 'pdf' }
    ]
  },
  {
    id: 'CDB-2026-008912',
    type: 'Renouvellement CNI',
    status: 'EN COURS',
    date: '18 Mai 2026'
  },
  {
    id: 'CDB-2026-003301',
    type: 'Casier Judiciaire',
    status: 'REJETÉE',
    date: '05 Mai 2026',
    reason: 'Document illisible'
  }
];

export const POPULAR_SERVICES = [
  { id: 'civil', name: 'État Civil', icon: 'civil' },
  { id: 'justice', name: 'Justice', icon: 'justice' }
];

export const AGENTS_LIST = [
  {
    id: '1',
    name: 'Abdoulaye Traoré',
    department: 'Mairie Centrale',
    status: 'EN SERVICE',
    avatar: 'https://i.pravatar.cc/150?u=abdoulaye'
  },
  {
    id: '2',
    name: 'Fatoumata Ouédraogo',
    department: 'Police Municipale',
    status: 'EN SERVICE',
    avatar: 'https://i.pravatar.cc/150?u=fatoumata'
  },
  {
    id: '3',
    name: 'Moussa Sanon',
    department: 'Service de Santé',
    status: 'EN REPOS',
    avatar: 'https://i.pravatar.cc/150?u=moussa'
  }
];
