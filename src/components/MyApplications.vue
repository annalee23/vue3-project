<template>
  <div class="q-pa-md">
    <q-table
      title="Список заявок"
      :rows="rows"
      :columns="columns"
      row-key="num"
    >
      <template v-slot:body-cell-state="props">
        <q-td :props="props" :class="statusClass(props.row.state)">
          {{ props.row.state }}
        </q-td>
      </template>
      <template v-slot:body-cell-stg="props">
        <q-td :props="props">
          <span>{{ Array.isArray(props.row.stg) ? props.row.stg.join(', ') : props.row.stg }}</span>
        </q-td>
      </template>
      <template v-slot:body-cell-dadd="props">
        <q-td :props="props">
          <span>{{ props.row.dadd }}</span>
        </q-td>
      </template>
      <template v-slot:body-cell-num="props">
        <q-td :props="props">
          <div @click="selectOrder(props.row.id, props.row.num)" style="cursor: pointer;">
            {{ props.row.num }}
          </div>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';

const columns = [
  { name: 'num', label: '№ Заявки', align: 'left', field: 'num', sortable: true },
  { name: 'stg', label: 'Продукт', align: 'left', field: 'stg', sortable: true },
  { name: 'dadd', label: 'Дата', align: 'left', field: 'dadd', sortable: true },
  { name: 'client_name', label: 'Клиент', align: 'left', field: 'client_name', sortable: true },
  { name: 'state', label: 'Статус', align: 'left', field: 'state', sortable: true },
  { name: 'person_phone', label: 'Телефон', align: 'left', field: 'person_phone', sortable: true },
  { name: 'actions', label: 'Действия', align: 'left', field: 'actions', sortable: false }
];

export default {
  setup(_, { emit }) {
    const store = useStore();
    const rows = computed(() => store.state.ordersList);

    const statusClass = (status) => {
      return {
        'status-init': status === 'init',
        'status-error': status === 'error',
        'status-upload_docs': status === 'upload_docs',
        'status-process': status === 'process',
        'status-reupload_fls': status === 'reupload_fls'
      };
    };

    const selectOrder = (orderId, num) => {
      emit('select-order', { orderId, num });
    };

    onMounted(() => {
      store.dispatch('fetchOrdersList');
    });

    return {
      columns,
      rows,
      statusClass,
      selectOrder
    };
  }
};
</script>

<style scoped>
.status-init {
  color: #ff6f00;
  /* Ярко-оранжевый */
  font-weight: bold;
}

.status-error {
  color: #d32f2f;
  /* Ярко-красный */
  font-weight: bold;
}

.status-upload_docs {
  color: #0288d1;
  /* Ярко-голубой */
  font-weight: bold;
}

.status-process {
  color: #388e3c;
  /* Ярко-зеленый */
  font-weight: bold;
}

.status-reupload_fls {
  color: #7b1fa2;
  /* Ярко-фиолетовый */
  font-weight: bold;
}

tr:hover {
  background-color: #f5f5f5;
  /* Светло-серый */
}
</style>
