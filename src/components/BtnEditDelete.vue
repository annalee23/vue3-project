<template>
    <div>
      <q-icon name="edit" size="sm" class="mr-2" @click="emitEdit" />
      <q-icon name="delete" size="sm" @click="emitDelete" />
    </div>
  </template>
  
  <script>
  export default {
    props: {
      item: {
        type: Object,
        required: true
      }
    },
    emits: ['edit', 'delete'],
    setup(props, { emit }) {
      const emitEdit = () => {
        emit('edit', props.item);
      };
  
      const emitDelete = () => {
        emit('delete', props.item);
      };
  
      return {
        emitEdit,
        emitDelete
      };
    }
  };
  </script>
  
  <style scoped>
  .mr-2 {
    margin-right: 0.5rem;
  }
  </style>
  