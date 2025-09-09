/* ==========================================================================
DateDemo.vue - demonstrates the DateInput and DatePicker components This file is
part of the Creative Corvid Component and Style Library.
========================================================================== */
<script setup lang="ts">
import { ref } from 'vue';

const dateValue = ref<string | null>(null);
const datePickerValue = ref<string | undefined>('');
</script>
/* Template ============================================================== */
<template>
  <div class="CC__demo-container date-demo">
    <div class="CC__demo-header">
      <h2 class="demo-header">Date Input Demo</h2>
      <div class="demo-description">
        This component is used to demonstrate the date input component and
        variations.
      </div>
    </div>
    <div class="CC__demo-wrapper">
      <CCDateInput
        v-model="dateValue"
        label="Date Input"
        is-clearable
        required
      />
      <CCDateDropdown
        :value="datePickerValue"
        label="Date Picker"
        format="MM/DD/YYYY"
        :required="true"
        :first-year="2025"
        :years-available="5"
      />
    </div>
  </div>
</template>
<style lang="scss">
.date-demo {
  .CC__close-button {
    margin-right: 0.25rem;
  }
}
</style>
