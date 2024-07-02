<template>
  <div class="q-pa-md">
    <q-table :grid="isMobile" :hide-header="isMobile" :rows="rows" :columns="columns" row-key="num"
      :pagination.sync="pagination">

      <template v-slot:top>
        <q-td colspan="7">
          <div class="q-table__title">
            <span class="title-text">Список заявок</span>
            <q-btn class="btn-create" color="primary" @click="openDialog()">
              {{ isMobile ? '+' : 'Добавить заявку' }}</q-btn>
          </div>
        </q-td>
      </template>


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
          <span>{{ formatDate(props.row.dadd) }}</span>
        </q-td>
      </template>

      <template v-slot:body-cell-num="props">
        <q-td :props="props">
          <div @click="selectOrder(props.row.id, props.row.num)" class="clickable">
            {{ props.row.num }}
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <BtnEditDelete :item="props.row" @edit="editItem" @delete="openDialog(props.row, 'delete')" />
        </q-td>
      </template>

    </q-table>

    <DialogDelete :dialog="dialogDelete" @close="closeDialog" @confirm="deleteItem"
      @update:dialog="val => dialogDelete = val" />
    <DialogEditCreate :dialog="dialog" :editedItem="editedItem" :dialogTitle="dialogTitle" @save="saveItem"
      @close="closeDialog" @update:dialog="val => dialog = val" />

  </div>
</template>

<script>
import { ref, computed, onMounted, watch, onUnmounted, nextTick } from 'vue';
import { useStore } from 'vuex';
import BtnEditDelete from '@/components/BtnEditDelete.vue';
import DialogDelete from '@/components/DialogDelete.vue';
import DialogEditCreate from '@/components/DialogEditCreate.vue';
import moment from 'moment';

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
  components: {
    BtnEditDelete,
    DialogDelete,
    DialogEditCreate
  },
  props: ['onSelectOrder'],
  setup(props, { emit }) {
    const store = useStore();
    const rows = computed(() => store.state.ordersList);

    const dialog = ref(false);
    const dialogDelete = ref(false);
    const dialogTitle = ref("Создать заявку");
    const editedIndex = ref(-1);
    const editedItem = ref({
      id: 0,
      num: 0,
      stg: [],
      dadd: moment().format('YYYY-MM-DD HH:mm'),
      client_name: "",
      state: "init",
      person_phone: ""
    });
    const defaultItem = {
      id: 6,
      num: 0,
      stg: [],
      dadd: moment().format('YYYY-MM-DD HH:mm'),
      client_name: "",
      state: "init",
      person_phone: ""
    };
    const dialogMode = ref('create'); // 'create', 'edit', 'delete'
    const nextId = ref(6);
    const pagination = ref({ page: 1, rowsPerPage: 10 });
    const isMobile = ref(window.innerWidth <= 600);

    const handleResize = () => {
      isMobile.value = window.innerWidth <= 600;
      nextTick(() => {
        const table = document.querySelector('.q-table');
        if (table && table.__vue__) {
          table.__vue__.onResize();
        }
      });
    };
    onMounted(() => {
      const savedOrders = localStorage.getItem('ordersList');
      if (savedOrders) {
        store.commit('setOrdersList', JSON.parse(savedOrders));
      } else {
        store.dispatch('fetchOrdersList');
      }
      window.addEventListener('resize', handleResize);
    });

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
    });

    watch(dialog, (val) => {
      if (!val) closeDialog();
    });

    watch(dialogDelete, (val) => {
      if (!val) closeDialog();
    });

    const formatDate = (date) => {
      return moment(date).isValid() ? moment(date).format('DD.MM.YYYY HH:mm') : 'Invalid date';
    };

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
      props.onSelectOrder({ orderId, num });
    };

    const openDialog = (item = null, mode = 'create') => {
      console.log(`Opening dialog (MyApp): mode=${mode}`);

      dialogMode.value = mode;
      dialogTitle.value = mode === 'create' ? "Создать заявку" : "Редактировать заявку";

      if (mode === 'create') {
        editedItem.value = { ...defaultItem };
        editedItem.value.id = nextId.value++;
        editedIndex.value = -1;
      } else {
        editedIndex.value = rows.value.indexOf(item);
        editedItem.value = { ...item };
      }

      if (mode === 'delete') {
        dialogDelete.value = true;
      } else {
        dialog.value = true;
      }
    };

    const closeDialog = () => {
      dialog.value = false;
      dialogDelete.value = false;
      nextTick(() => {
        editedItem.value = { ...defaultItem };
        editedIndex.value = -1;
        dialogMode.value = 'create';
      });
    };

    const saveItem = (localEditedItem) => {
      if (editedIndex.value > -1) {
        Object.assign(rows.value[editedIndex.value], localEditedItem);
      } else {
        store.commit('addNewItem', localEditedItem);
      }
      closeDialog();
    };

    const editItem = (item) => {
      openDialog(item, 'edit');
    };


    const deleteItem = () => {
      if (editedIndex.value > -1) {
        rows.value.splice(editedIndex.value, 1);
      }
      closeDialog();
    };



    return {
      columns,
      rows,
      dialog,
      dialogDelete,
      dialogTitle,
      editedItem,
      formatDate,
      statusClass,
      selectOrder,
      openDialog,
      closeDialog,
      saveItem,
      editItem,
      deleteItem,
      pagination,
      isMobile
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

.btn-create {
  /* margin-left: 580px; */
  position: absolute;
  right: 0.3cm;
}

.q-table__title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.q-table__title .title-text {
  flex: 1;
}

.q-table__title q-btn {
  margin-top: 8px;
}

@media (max-width: 600px) {
  .btn-create {
    right: 0.5cm;
  }
}
</style>
