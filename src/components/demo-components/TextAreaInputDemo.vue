/* ==========================================================================
TextAreaInputDemo.vue - Demo for TextAreaInput component.
========================================================================== */
<script setup lang="ts">
import { ref } from 'vue';

const information = ref(null);

const rules = {
  required: (value: string) => !!value || 'Additional information is required.',
  minLength: (value: string) =>
    (value && value.length >= 3) ||
    'Additional information must be at least 3 characters.',
};

const onInputUpdate = (): void => {
  console.log('input updated');
};
</script>

/* ==========================================================================
Template
========================================================================== */
<template>
  <div class="CC__demo-container">
    <div class="CC__demo-header">
      <h2 class="demo-header">Input Textarea</h2>
      <div class="demo-description">
        This component is used to display a textarea input field with
        auto-sizing.
      </div>
    </div>

    <CCTextArea
      inputId="CC__input-textarea"
      v-model="information"
      label="Additional Information"
      placeholder="Enter additional information"
      :maxlength="500"
      :required="true"
      :max-height="500"
      :rules="[rules.required, rules.minLength]"
      @update:model-value="onInputUpdate"
    />
  </div>
</template>
<style lang="scss"></style>
