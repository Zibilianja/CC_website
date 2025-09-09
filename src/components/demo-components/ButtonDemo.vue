<script lang="ts" setup>
import { ref } from 'vue';

const toastMessage = ref('default');
const valueToast = ref(false);

const buttonDisabled = ref<Record<string, boolean>>({
  announcement: false,
  success: false,
  error: false,
  info: false,
});

const manageToast = (message: string): void => {
  buttonDisabled.value[message] = true; // Disable the button after click
  if (valueToast.value) {
    valueToast.value = false; // Close the toast
    setTimeout(() => {
      displayToast(message); // Trigger the toast again after a short delay
    }, 100); // Adjust the delay as needed
  } else {
    displayToast(message);
  }
};

const displayToast = (message: string): void => {
  valueToast.value = true;
  toastMessage.value = message;
};

const handleUpdateToast = (): void => {
  buttonDisabled.value[toastMessage.value] = false; // Re-enable the button after the toast is closed
  valueToast.value = false; // Close the toast
};
</script>
/* Template ============================================================== */
<template>
  <div class="CC__demo-container">
    <div class="CC__demo-header">
      <h2>Button Demo</h2>
      <div>Click the buttons below to see a demo of Toast alerts.</div>
    </div>
    <div class="CC__demo-wrapper">
      <CCButton
        class="CC__blue-gray"
        :disabled="buttonDisabled.announcement"
        @click="manageToast('announcement')"
        >Announcement Button</CCButton
      >
      <CCButton
        class="CC__green"
        :disabled="buttonDisabled.success"
        @click="manageToast('success')"
        >Submit Button</CCButton
      >
      <CCButton
        class="CC__red"
        :leadingIcon="['fas', 'trash-alt']"
        :disabled="buttonDisabled.error"
        @click="manageToast('error')"
        >Delete Button</CCButton
      >
      <CCButton
        class="CC__purple"
        :disabled="buttonDisabled.info"
        @click="manageToast('info')"
        >Info Button</CCButton
      >
      <CCButton disabled>Disabled Button</CCButton>
      <CCButton
        class="CC__blue loading-button"
        disabled
        >Loading...<font-awesome-icon
          id="spinner"
          :icon="['fas', 'spinner']"
      /></CCButton>
    </div>
  </div>
  <CCToastAlert
    v-model="valueToast"
    :type="toastMessage"
    :timeout="2000"
    @update:modelValue="handleUpdateToast"
  >
    <template v-slot:title>Toast: {{ toastMessage }}</template>
    <template v-slot:message
      >This is a toast {{ toastMessage }} message.</template
    >
  </CCToastAlert>
</template>
