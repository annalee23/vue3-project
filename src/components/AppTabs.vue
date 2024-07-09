<template>
  <q-layout>
    <q-page-container>
      <div class="q-pa-md">
        <q-toolbar class="bg-purple text-white shadow-2 rounded-borders">
          <q-space />
          <q-tabs v-model="activeTab" shrink stretch>
            <q-tab v-for="tab in tabs" :key="tab.name" :name="tab.name">
              <div class="tab-content">
                <span class="tab-label">{{ tab.label }}</span>
                <q-icon v-if="tab.meta.isOrderDetail" name="close" class="cursor-pointer close-icon" @click.stop="closeTab(tab.name)" />
              </div>
            </q-tab>
          </q-tabs>
        </q-toolbar>

        <q-page>
          <router-view :key="activeTab" :component="getComponent(activeTab)" @select-order="addOrderTab" />
        </q-page>

      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { markRaw } from 'vue';

const MyApplications = markRaw(require('@/components/MyApplications.vue').default);
const MyAccounts = markRaw(require('@/components/MyAccounts.vue').default);
const OrderDetails = markRaw(require('@/components/OrderDetails.vue').default);


export default {
  components: {
    MyApplications,
    MyAccounts,
    OrderDetails
  },
  setup() {
    const router = useRouter();
    const route = useRoute();

    const tabs = ref([
      { name: 'applications', label: 'Заявки', meta: { path: '/applications', component: MyApplications } },
      { name: 'accounts', label: 'Счета', meta: { path: '/accounts', component: MyAccounts } }
    ]);

    const activeTab = ref(localStorage.getItem('activeTab') || null);

    const addOrderTab = ({ orderId, num }) => {
      const existingTab = tabs.value.find(tab => tab.name === `order-${orderId}`);
      if (existingTab) {
        activeTab.value = existingTab.name;
      } else {
        const newTab = {
          name: `order-${orderId}`,
          label: `Заявка ${num}`,
          component: OrderDetails,
          meta: { path: `/applications/${orderId}`, component: OrderDetails, isOrderDetail: true }
        };
        tabs.value.push(newTab);
        activeTab.value = newTab.name;
        router.push({ path: newTab.meta.path });
      }
    };

    const closeTab = (tabName) => {
      const index = tabs.value.findIndex(tab => tab.name === tabName);
      if (index !== -1) {
        tabs.value.splice(index, 1);
        if (tabName === activeTab.value) {
          const defaultTab = tabs.value.length > 0 ? tabs.value[0].name : null;
          activeTab.value = defaultTab;
          if (defaultTab) {
            router.push({ path: tabs.value[0].meta.path });
          } else {
            router.push('/');
          }
        }
      }
    };

    watch(activeTab, (newVal) => {
      const selectedTab = tabs.value.find(tab => tab.name === newVal);
      if (selectedTab && selectedTab.meta.path && route.path !== selectedTab.meta.path) {
        router.push({ path: selectedTab.meta.path });
      }
      localStorage.setItem('activeTab', newVal);
    });

    onMounted(() => {
      const initialTab = tabs.value.find(tab => tab.meta.path === route.path);
      if (initialTab) {
        activeTab.value = initialTab.name;
      } else {
        activeTab.value = tabs.value[0].name;
        router.push({ path: tabs.value[0].meta.path });
      }
    });

    const getComponent = (tabName) => {
      const tab = tabs.value.find(tab => tab.name === tabName);
      return tab ? tab.meta.component : null;
    };

    return {
      activeTab,
      tabs,
      addOrderTab,
      getComponent,
      closeTab
    };
  },
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.tab-content {
  display: flex;
  align-items: center;
}

.tab-label {
  font-weight: bold;
  margin-right: 10px; 
}

.close-icon {
  margin-left: auto; 
}
</style>