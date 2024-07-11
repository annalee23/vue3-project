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
import MyApplications from '@/components/MyApplications.vue';
import MyAccounts from '@/components/MyAccounts.vue';
import OrderDetails from '@/components/OrderDetails.vue';


export default {
  components: {
    MyApplications,
    MyAccounts,
    OrderDetails
  },
  setup() {
    const router = useRouter();
    const route = useRoute();

    const defaultTabs = [
      { name: 'applications', label: 'Заявки', meta: { path: '/applications', component: MyApplications } },
      { name: 'accounts', label: 'Счета', meta: { path: '/accounts', component: MyAccounts } }
    ];

    const storedTabs = JSON.parse(localStorage.getItem('tabs')) || defaultTabs;
    const tabs = ref(storedTabs);

    const activeTab = ref(localStorage.getItem('activeTab') || (storedTabs.length > 0 ? storedTabs[0].name : null));

    const saveTabsToLocalStorage = () => {
      localStorage.setItem('tabs', JSON.stringify(tabs.value));
    };

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
        saveTabsToLocalStorage();
      }
    };

    const closeTab = (tabName) => {
      const index = tabs.value.findIndex(tab => tab.name === tabName);
      if (index !== -1) {
        tabs.value.splice(index, 1);
        saveTabsToLocalStorage();
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
      const storedActiveTab = localStorage.getItem('activeTab');
      const initialTab = tabs.value.find(tab => tab.name === storedActiveTab);
      
      if (initialTab) {
        activeTab.value = initialTab.name;
        router.push({ path: initialTab.meta.path });
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