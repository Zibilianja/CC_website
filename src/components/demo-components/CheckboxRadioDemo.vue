<script lang="ts" setup>
import { reactive } from 'vue';

const checkboxValues = reactive({
  announcement: {
    value: false,
    error: false,
  },
  success: {
    value: false,
    error: false,
  },
  error: {
    value: false,
    error: false,
  },
  info: {
    value: false,
    error: false,
  },
  disabled: {
    value: false,
    error: false,
  },
  loading: {
    value: false,
    error: false,
  },
});

const radioData = {
  radio1: [
    { label: 'Option 1', value: 'sample1' },
    { label: 'Option 2', value: 'sample2' },
    { label: 'Option 3', value: 'sample3' },
  ],
  radio2: [
    { label: 'Option A', value: 'sampleA' },
    { label: 'Option B', value: 'sampleB' },
    { label: 'Option C', value: 'sampleC' },
  ],
  radio3: [
    { label: 'Option X', value: 'sampleX' },
    { label: 'Option Y', value: 'sampleY' },
    { label: 'Option Z', value: 'sampleZ' },
  ],
  radio4: [
    { label: 'Option I', value: 'sampleI' },
    { label: 'Option II', value: 'sampleII' },
    { label: 'Option III', value: 'sampleIII' },
  ],
};

const radioSelected = reactive({
  radio1: '',
  radio2: '',
  radio3: '',
  radio4: '',
});

const handleSubmit = () => {
  checkboxValues.announcement.error = !checkboxValues.announcement.value;
  checkboxValues.success.error = !checkboxValues.success.value;
  checkboxValues.error.error = !checkboxValues.error.value;

  if (
    checkboxValues.announcement.error ||
    checkboxValues.success.error ||
    checkboxValues.error.error
  ) {
    alert('Please answer all required sections.');
  } else {
    alert('Form submitted successfully!');
  }
};
</script>
/* Template ============================================================== */
<template>
  <div class="CC__demo-radio-container">
    <div class="CC__demo-header">
      <h2>Checkbox and Radio Demo</h2>
      <div>Click the inputs below to see styles.</div>
    </div>
    <label class="CC__demo-label">Please Choose one or more checkbox:</label>
    <div class="CC__demo-wrapper">
      <CCCheckbox
        v-model="checkboxValues.announcement.value"
        label="Sample 1 Checkbox"
      />
      <CCCheckbox
        v-model="checkboxValues.success.value"
        label="Sample 2 Checkbox"
      />
      <CCCheckbox
        v-model="checkboxValues.error.value"
        label="Sample 3 Checkbox"
      />
      <CCCheckbox
        v-model="checkboxValues.info.value"
        label="Sample 4 Checkbox"
      />
    </div>
    <label class="CC__demo-label cc-my-4">Please select some radios:</label>
    <div class="CC__demo-wrapper cc-w-100 cc-d-flex cc-justify-evenly">
      <CCRadio
        v-model="radioSelected.radio1"
        :options="radioData.radio1"
        direction="row"
        label="Choose a Sample 1"
        name="sample-radio-1"
      />
      <CCRadio
        v-model="radioSelected.radio2"
        :options="radioData.radio2"
        direction="row"
        label="Choose another Sample 2"
        name="sample-radio-2"
      />
    </div>
    <div class="CC__demo-wrapper cc-w-100 cc-d-flex cc-justify-evenly cc-mt-8">
      <CCRadio
        v-model="radioSelected.radio3"
        :options="radioData.radio3"
        direction="column"
        label="Choose a Sample 3"
        name="sample-radio-3"
      />
      <CCRadio
        v-model="radioSelected.radio4"
        :options="radioData.radio4"
        direction="column"
        label="Choose another Sample 4"
        name="sample-radio-4"
      />
    </div>
    <CCButton
      class="CC__green cc-mt-6"
      :leadingIcon="['fas', 'paper-plane']"
      @click="handleSubmit"
      >Submit</CCButton
    >
  </div>
</template>
/* Styles ============================================================== */
<style lang="scss">
.CC__demo-label {
  margin: 0 0 1rem 0;
}

.CC__demo-radio-container {
  padding: 1.5rem;
  margin: 2rem 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.37);
  border-radius: 0.5rem;
  background-color: #f3f0f0;
}

.CC__demo-wrapper {
  display: flex;
  justify-content: space-evenly;
  gap: 1.5rem;
}
</style>
