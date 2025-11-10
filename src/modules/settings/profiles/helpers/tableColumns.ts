import type { QTable } from 'quasar';

export const stateProfileColumns: QTable['columns'] = [
  {
    name: 'id',
    required: true,
    label: 'Id',
    align: 'center',
    field: 'id',
  },
  {
    name: 'name',
    required: true,
    label: 'Nombre',
    align: 'center',
    field: 'name',
  },
  {
    name: 'isActive',
    required: true,
    label: 'Estado',
    align: 'center',
    field: 'isActive',
  },
  {
    name: 'createdAt',
    required: true,
    label: 'Fecha de creación',
    align: 'center',
    field: 'createdAt',
  },
  {
    name: 'updatedAt',
    required: true,
    label: 'Ultima actualización',
    align: 'center',
    field: 'updatedAt',
  },
  {
    name: 'actions',
    required: true,
    label: 'Acc.',
    align: 'center',
    field: 'actions',
    style: 'position: sticky; right:0; background-color: #d6eaf8;',
    headerStyle: 'background-color: #d6eaf8; position: sticky; right:0',
  },
];
