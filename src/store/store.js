import { createStore } from 'vuex';
import axios from 'axios';
import moment from 'moment';

export default createStore({
  state() {
    return {
      ordersList: [],
      meetingsList: [],
      currentOrder: null
    };
  },
  mutations: {
    setOrdersList(state, orders) {
      state.ordersList = orders.map(order => ({
        ...order,
        dadd: moment(order.dadd).isValid() ? moment(order.dadd).format('YYYY-MM-DD HH:mm') : 'Invalid date'
      }));
    },
    addNewItem(state, item) {
      // state.ordersList.push(item);
      console.log('Adding new item (Store):', item); // Логирование
      state.ordersList.push(item);
      console.log('Updated ordersList (Store):', state.ordersList);
    },
    setMeetingsList(state, meetings) {
      state.meetingsList = meetings;
    },
    setCurrentOrder(state, order) {
      state.currentOrder = order;
    }
  },
  actions: {
    async fetchOrdersList({ commit }) {
      try {
        const response = await axios.get('https://my-json-server.typicode.com/plushevy/demo/list');
        commit('setOrdersList', response.data);
      } catch (error) {
        console.error('Ошибка при загрузке списка заявок:', error);
        throw error;
      }
    },
    async fetchMeetingsList({ commit }) {
      try {
        const response = await axios.get('https://my-json-server.typicode.com/plushevy/demo/meetings');
        commit('setMeetingsList', response.data);
      } catch (error) {
        console.error('Ошибка при загрузке списка встреч:', error);
        throw error;
      }
    },
    async fetchOrderDetails({ commit }, orderId) {
      try {
        const response = await axios.get(`https://my-json-server.typicode.com/plushevy/demo/orders/${orderId}`);
        console.log('Orders details loaded:', response.data);
        commit('setCurrentOrder', response.data);
      } catch (error) {
        console.error('Ошибка при загрузке данных заявки:', error);
        throw error;
      }
    }
  }
});
