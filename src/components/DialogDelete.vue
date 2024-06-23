<template>
    <q-dialog v-model="localDialog">
      <q-card>
        <q-card-section class="text-h5">
          Хотите удалить заявку?
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Отмена" color="primary" @click="onCancel" />
          <q-btn flat label="Да" color="primary" @click="onConfirm" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </template>
  
  <script>
  import { ref, watch } from 'vue';
  
  export default {
    props: {
      dialog: {
        type: Boolean,
        required: true
      }
    },
    emits: ['close', 'confirm', 'update:dialog'],
    setup(props, { emit }) {
      const localDialog = ref(props.dialog);
  
      watch(() => props.dialog, (newVal) => {
        localDialog.value = newVal;
      });
  
      watch(localDialog, (newVal) => {
        if (newVal !== props.dialog) {
        emit('update:dialog', newVal);
      }     
     });
  
      const onCancel = () => {
        emit('close');
        localDialog.value = false;
      };
  
      const onConfirm = () => {
        emit('confirm');
        localDialog.value = false;
      };
  
      return {
        localDialog,
        onCancel,
        onConfirm
      };
    }
  };
  </script>
  
  <style scoped>
  </style>
  