<template>
    <q-dialog v-model="localDialog">
        <q-card>
            <q-card-section>
                <div class="text-h6">{{ dialogTitle }}</div>
            </q-card-section>
            <q-card-section>
                <q-form ref="form">
                    <q-input v-model="localEditedItem.num" :rules="[rules.counter, rules.numIfNonEmpty]"
                        label="№ Заявки" />
                    <q-input v-model="formStgString" :rules="[rules.stgCheck, rules.max20Characters]" label="Продукт"
                        @update:model-value="updateFormStg" />
                    <div class="row">
                        <q-input v-model="localEditedItem.dadd" label="Дата и время" readonly>
                            <template v-slot:prepend>
                                <q-icon name="event" class="cursor-pointer">
                                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                        <q-date v-model="localEditedItem.dadd" mask="YYYY-MM-DD HH:mm">
                                            <div class="row items-center justify-end">
                                                <q-btn v-close-popup label="Закрыть" color="primary" flat />
                                            </div>
                                        </q-date>
                                    </q-popup-proxy>
                                </q-icon>
                            </template>
                            <template v-slot:append>
                                <q-icon name="access_time" class="cursor-pointer">
                                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                        <q-time v-model="localEditedItem.dadd" mask="YYYY-MM-DD HH:mm" format24h>
                                            <div class="row items-center justify-end">
                                                <q-btn v-close-popup label="Закрыть" color="primary" flat />
                                            </div>
                                        </q-time>
                                    </q-popup-proxy>
                                </q-icon>
                            </template>
                        </q-input>
                    </div>
                    <q-input v-model="localEditedItem.client_name" :rules="[rules.client_nameCheck]" label="Клиент" />
                    <q-select v-model="localEditedItem.state" :options="statusOptions" label="Статус" />
                    <q-input v-model="localEditedItem.person_phone" :rules="[rules.personPhoneCheck]" label="Телефон" />
                </q-form>
            </q-card-section>
            <q-card-actions align="right">
                <q-btn flat label="Отмена" @click="closeDialog" />
                <q-btn flat label="Сохранить" @click="saveLocalItem" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script>
import { ref, watch, computed } from 'vue';
import moment from 'moment';

export default {
    props: {
        dialog: {
            type: Boolean,
            required: true
        },
        editedItem: {
            type: Object,
            required: true
        },
        dialogTitle: {
            type: String,
            required: true
        }
    },
    emits: ['update:dialog', 'save', 'close'],
    setup(props, { emit }) {
        const menu2 = ref(false);
        const localDialog = ref(props.dialog);
        const localEditedItem = ref({ ...props.editedItem });

        const statusOptions = [
            'init',
            'error',
            'upload_docs',
            'process',
            'reupload_fls'
        ];

        const rules = {
            counter: value => !value || String(value).length <= 8 || 'Максимум 8 символов',
            numIfNonEmpty: value => !value || /^[0-9]+$/.test(value) || 'Недопустимый номер заявки. Используйте только цифры',
            max20Characters: value => !value || String(value).length <= 20 || 'Максимум 20 символов',
            stgCheck: value => !value || /^[a-zA-Zа-яА-Я.'"0-9\s]+$/.test(value) || 'Используйте цифры (0-9) или буквы (a-z, A-Z, а-я, А-Я)',
            client_nameCheck: value => !value || /^[a-zA-Zа-яА-Я\s.'"0-9]+$/.test(value) || 'Используйте цифры (0-9) или буквы (a-z, A-Z, а-я, А-Я). Максимум 30 символов',
            personPhoneCheck: value => !value || /^[0-9]{11}$/.test(value) || 'Недопустимый номер телефона. Должен содержать ровно 11 цифр'
        };


        watch(() => props.dialog, newVal => {
            localDialog.value = newVal;
        });

        watch(localDialog, newVal => {
            emit('update:dialog', newVal);
        });

        watch(() => props.editedItem, newVal => {
            localEditedItem.value = { ...newVal };
        });

        const formStgString = computed({
            get() {
                return localEditedItem.value.stg.join(', ');
            },
            set(value) {
                localEditedItem.value.stg = value.split(', ');
            }
        });

        const updateFormStg = (value) => {
            localEditedItem.value.stg = value.split(', ');
        };

        const saveLocalItem = () => {
            if (localEditedItem.value.dadd && !moment(localEditedItem.value.dadd).isValid()) {
                localEditedItem.value.dadd = moment().format('YYYY-MM-DD HH:mm');
            }
            emit('save', localEditedItem.value);
            closeDialog();
        };

        const closeDialog = () => {
            localDialog.value = false;
            emit('close');
        };

        return {
            menu2,
            localDialog,
            localEditedItem,
            statusOptions,
            rules,
            formStgString,
            updateFormStg,
            saveLocalItem,
            closeDialog
        };
    }
};
</script>

<style scoped>
/* Ваши стили */
</style>