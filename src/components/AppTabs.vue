<template>
  <q-layout>
    <q-page-container>
      <div class="q-pa-md">
        <q-toolbar class="bg-purple text-white shadow-2 rounded-borders">
          <q-space />
          <q-tabs v-model="activeTab" shrink stretch>
            <q-tab
              v-for="tab in tabs"
              :key="tab.name"
              :name="tab.name"
              :label="tab.label"
            />
          </q-tabs>
        </q-toolbar>

        <q-page>
          <router-view />
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
    const activeTab = ref('applications');
    const tabs = ref([
      { name: 'applications', label: 'Заявки', component: MyApplications, path: '/applications' },
      { name: 'accounts', label: 'Счета', component: MyAccounts, path: '/accounts' }
    ]);

    const addOrderTab = ({ orderId, num }) => {
      const existingTab = tabs.value.find(tab => tab.name === `order-${orderId}`);
      if (existingTab) {
        activeTab.value = existingTab.name;
      } else {
        const newTab = {
          name: `order-${orderId}`,
          label: `Заявка ${num}`,
          component: OrderDetails,
          path: `/applications/${orderId}`
        };
        tabs.value.push(newTab);
        activeTab.value = newTab.name;
        router.push({ path: newTab.path });
      }
    };

    watch(activeTab, (newVal) => {
      const selectedTab = tabs.value.find(tab => tab.name === newVal);
      if (selectedTab && selectedTab.path && route.path !== selectedTab.path) {
        router.push({ path: selectedTab.path });
      }
    });

    onMounted(() => {
      const initialTab = tabs.value.find(tab => tab.path === route.path);
      if (initialTab) {
        activeTab.value = initialTab.name;
      }
    });

    return {
      activeTab,
      tabs,
      addOrderTab
    };
  },
};
</script>

<style scoped>
/* Ваши стили здесь */
</style>