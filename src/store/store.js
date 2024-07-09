import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import moment from "moment";

export const useStore = defineStore("main", () => {
  const ordersList = ref([]);
  const meetingsList = ref([]);
  const currentOrder = ref(null);
  const DetailsList = ref([]);

  const fetchOrdersList = async () => {
    try {
      const response = await axios.get(
        "https://my-json-server.typicode.com/plushevy/demo/list"
      );
      setOrdersList(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке списка заявок:", error);
      throw error;
    }
  };

  const fetchMeetingsList = async () => {
    try {
      const response = await axios.get(
        "https://my-json-server.typicode.com/plushevy/demo/meetings"
      );
      setMeetingsList(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке списка встреч:", error);
      throw error;
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      let orderDetails = DetailsList.value.find((item) => item.id === orderId);
      if (!orderDetails) {
        const response = await axios.get(
          `https://my-json-server.typicode.com/plushevy/demo/orders/${orderId}`
        );
        // console.log("NEW JSON RESPONSE");
        orderDetails = response.data;
        DetailsList.value.push(orderDetails);
      }
      setCurrentOrder(orderDetails);
    } catch (error) {
      console.error("Ошибка при загрузке данных заявки:", error);
      throw error;
    }
  };

  const setOrdersList = (orders) => {
    ordersList.value = orders.map((order) => ({
      ...order,
      dadd: moment(order.dadd).isValid()
        ? moment(order.dadd).format("YYYY-MM-DD HH:mm")
        : "Invalid date",
    }));
  };

  const addNewItem = (item) => {
    ordersList.value.push(item);
  };

  const setMeetingsList = (meetings) => {
    meetingsList.value = meetings;
  };

  const setCurrentOrder = (order) => {
    currentOrder.value = order;
  };

  return {
    ordersList,
    meetingsList,
    currentOrder,
    DetailsList,
    fetchOrdersList,
    fetchMeetingsList,
    fetchOrderDetails,
    setOrdersList,
    addNewItem,
    setMeetingsList,
    setCurrentOrder,
  };
});