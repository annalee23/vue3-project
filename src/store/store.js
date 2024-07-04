import { defineStore } from 'pinia';
import axios from 'axios';
import moment from 'moment';

export const useStore = defineStore('main', {
  state: () => ({
      ordersList: [],
      meetingsList: [],
      currentOrder: null
  }),
  actions: {
    async fetchOrdersList() {
      try {
        const response = await axios.get('https://my-json-server.typicode.com/plushevy/demo/list');
        this.setOrdersList(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке списка заявок:', error);
        throw error;
      }
    },
    async fetchMeetingsList() {
      try {
        const response = await axios.get('https://my-json-server.typicode.com/plushevy/demo/meetings');
        this.setMeetingsList(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке списка встреч:', error);
        throw error;
      }
    },
    async fetchOrderDetails(orderId) {
      try {
        const response = await axios.get(`https://my-json-server.typicode.com/plushevy/demo/orders/${orderId}`);
        console.log('Orders details loaded:', response.data);
        this.setCurrentOrder(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке данных заявки:', error);
        throw error;
      }
    },
    setOrdersList(orders) {
      this.ordersList = orders.map(order => ({
        ...order,
        dadd: moment(order.dadd).isValid() ? moment(order.dadd).format('YYYY-MM-DD HH:mm') : 'Invalid date'
      }));
    },
    addNewItem(item) {
      this.ordersList.push(item);
    },
    setMeetingsList(meetings) {
      this.meetingsList = meetings;
    },
    setCurrentOrder(order) {
      this.currentOrder = order;
    }
  }
});
