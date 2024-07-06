<template>
  <div class="q-pa-md">
    <q-table 
      title="Открытие счетов" 
      :rows="rows" 
      :columns="columns" 
      row-key="num" 
      :grid="isMobile"
      :hide-header="isMobile"
    >
      <template v-slot:body-cell-meeting_state="props">
        <q-td :props="props" :class="statusClass(props.row.meeting_state)">
          {{ props.row.meeting_state }}
        </q-td>
      </template>

      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition">
          <q-card class="q-pa-md" bordered flat>
            <q-list dense>
              <q-item v-for="col in props.cols.filter(col => col.name !== 'desc')" :key="col.label">
                <q-item-section>
                  <q-item-label>{{ col.label }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label v-if="col.label === 'Статус'" :class="statusClass(col.value)">{{ col.value
                    }}</q-item-label>
                  <q-item-label v-else-if="col.label === 'Клиент'" style="max-width: 185px;">{{ col.value
                    }}</q-item-label>
                  <q-item-label v-else>{{ col.value }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
      </template>


      </q-table>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useStore } from '../store/store';
import moment from 'moment';

const columns = [
  { name: 'client_city', label: 'Город', align: 'left', sortable: true, field: 'client_city' },
  { name: 'client_name', label: 'Клиент', align: 'left', sortable: true, field: 'client_name' },
  { name: 'bank_name', label: 'Банк', align: 'left', sortable: true, field: 'bank_name' },
  { name: 'stg', label: 'Продукт', align: 'left', sortable: true, field: row => row.stg.join(', ') },
  { name: 'meeting_state', label: 'Статус', align: 'left', sortable: true, field: 'meeting_state' },
  {
    name: 'meeting_date',
    label: 'Дата встречи',
    align: 'left',
    sortable: true,
    field: row => moment(row.meeting_date).format('DD.MM.YYYY HH:mm'),
  },
  { name: 'meeting_place', label: 'Место встречи', align: 'left', sortable: true, field: 'meeting_place' },
  { name: 'person_phone', label: 'Телефон', align: 'left', sortable: true, field: 'person_phone' }
];

export default {
  setup() {
    const store = useStore();
    const rows = computed(() => store.meetingsList);

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
      store.fetchMeetingsList();
      window.addEventListener('resize', handleResize);
    });

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
    });

    function statusClass(status) {
      return {
        'status-init': status === 'init',
        'status-error': status === 'error',
        'status-upload_docs': status === 'upload_docs',
        'status-process': status === 'process',
        'status-reupload_fls': status === 'reupload_fls'
      };
    }

    return {
      columns,
      rows,
      statusClass,
      isMobile
    };
  }
};
</script>

<style scoped>
h2 {
  margin-bottom: 20px;
  text-align: center;
}

.status-init {
  color: #ff6f00;
  /* Ярко-оранжевый */
  font-weight: bold;
  padding: 5px;
}

.status-error {
  color: #d32f2f;
  /* Ярко-красный */
  font-weight: bold;
  padding: 5px;
}

.status-upload_docs {
  color: #0288d1;
  /* Ярко-голубой */
  font-weight: bold;
  padding: 5px;
}

.status-process {
  color: #388e3c;
  /* Ярко-зеленый */
  font-weight: bold;
  padding: 5px;
}

.status-reupload_fls {
  color: #7b1fa2;
  /* Ярко-фиолетовый */
  font-weight: bold;
  padding: 5px;
}
</style>