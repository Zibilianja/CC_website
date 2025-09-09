<script lang="ts" setup>
import { ref } from 'vue';

type InputValuesDemo = {
  [key: string]: {
    value: string;
    error: boolean;
    errorMessage: string;
  };
};

const inputValues = ref<InputValuesDemo>({
  text: {
    value: '',
    error: false,
    errorMessage: 'This field is required.',
  },
  search: {
    value: '',
    error: false,
    errorMessage: 'This field is required.',
  },
  formField: {
    value: '',
    error: false,
    errorMessage: 'This field is required.',
  },
});
const toastValue = ref('default');
const valueToast = ref(false);
const inputError = ref(false);

const handleInputChange = (input: string) => {
  if (validateInput(inputValues.value[input].value)) {
    inputValues.value[input].error = false;
  } else {
    inputValues.value[input].error = true;
  }
};

const submitInput = () => {
  inputError.value = false;
  const valuesArray = [
    { key: 'text', value: inputValues.value.text.value },
    { key: 'search', value: inputValues.value.search.value },
    { key: 'formField', value: inputValues.value.formField.value },
  ];
  let toastMessage = '';
  if (valuesArray.some((value) => !value.value.trim())) {
    toastMessage = 'error'; // Trigger the toast again after a short delay
  } else {
    toastMessage = 'success'; // Trigger the toast again after a short delay
  }
  displayToast(toastMessage);
};

const displayToast = (message: string): void => {
  valueToast.value = true;
  toastValue.value = message;
};

const validateInput = (value: string): boolean => {
  return value.trim() !== '';
};
</script>
/* Template ============================================================== */
<template>
  <div class="CC__demo-container">
    <div class="demo__input-btn-container">
      <div class="CC__demo-header">
        <h2 class="demo__input-title">Text Input Demo</h2>
        <div class="demo__input-description">
          This component is used to demonstrate the input component and
          variations.
        </div>
      </div>
      <form
        autocomplete="off"
        @submit.prevent
      >
        <div class="CC__demo-wrapper">
          <CCTextInput
            v-model="inputValues.text.value"
            label="Text Field"
            type="text"
            inputId="input-text-demo"
            placeholder="Type up..."
            :leadingIcon="['fas', 'pen-to-square']"
            :maxLength="50"
            clearable
            required
            :error="inputValues.text.error"
            @update:focus="inputValues.text.error = false"
            @update:blur=""
            @update:model-value="handleInputChange('text')"
          />
          <CCTextInput
            v-model="inputValues.search.value"
            label="Search Field"
            type="text"
            inputId="input-text-demo-search"
            placeholder="Type up..."
            hint="Search for something..."
            :leadingIcon="['fas', 'magnifying-glass']"
            :maxLength="50"
            clearable
            required
            :error="inputValues.search.error"
            @update:focus="inputValues.search.error = false"
            @update:model-value="handleInputChange('search')"
          />
          <CCTextInput
            v-model="inputValues.formField.value"
            label="Form Field"
            type="text"
            inputId="input-text-demo-form-field"
            placeholder="Type up..."
            :maxLength="50"
            clearable
            @update:model-value="handleInputChange"
          />
        </div>
        <div class="CC__demo-wrapper section-lower cc-mt-6">
          <CCTextInput
            v-model="inputValues.text.value"
            label="With Trailing Icon"
            type="text"
            inputId="input-text-demo"
            placeholder="Type up..."
            :trailing-icon="['fas', 'pen-to-square']"
            :maxLength="50"
            clearable
            required
            :error="inputValues.text.error"
            @update:focus="inputValues.text.error = false"
            @update:blur=""
            @update:model-value="handleInputChange('text')"
          />
          <CCTextInput
            v-model="inputValues.search.value"
            label="Search Field"
            type="text"
            inputId="input-text-demo-search"
            placeholder="Type up..."
            hint="Search for something..."
            :leadingIcon="['fas', 'magnifying-glass']"
            :maxLength="50"
            clearable
            required
            :error="inputValues.search.error"
            @update:focus="inputValues.search.error = false"
            @update:model-value="handleInputChange('search')"
          />
          <CCTextInput
            v-model="inputValues.formField.value"
            label="Form Field"
            type="text"
            inputId="input-text-demo-form-field"
            placeholder="Type up..."
            :maxLength="50"
            clearable
            @update:model-value="handleInputChange"
          />
        </div>
        <CCButton
          class="CC__green cc-mt-6"
          :leadingIcon="['fas', 'paper-plane']"
          :disabled="valueToast === true"
          @click="submitInput"
          >Submit</CCButton
        >
      </form>
    </div>
  </div>
  <CCToastAlert
    v-model="valueToast"
    :type="toastValue"
    :state="toastValue"
    :timeout="2500"
    @update:modelValue="valueToast = false"
  >
    <template v-slot:title>Toast: {{ toastValue }}</template>
    <template v-slot:message>
      {{
        toastValue === 'success'
          ? 'Input submitted successfully!'
          : 'Please fill all required fields.'
      }}
    </template>
  </CCToastAlert>
</template>
/* Styles ============================================================== */
<style lang="postcss">
.demo__input-btn-container {
  padding: 0 1.5rem;
}
.demo__input {
  &-btn-container {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    align-items: center;
    border-radius: 0.5rem;

    .submit-button {
      display: flex;
      flex-wrap: nowrap;
      padding: 0.75rem 1rem;
      margin-top: 1.5rem;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.37);
    }
  }
}
.CC__close-button {
  width: auto !important;
  padding: 0 !important;
  justify-content: center !important;
  align-items: center !important;
  svg {
    width: 1.25rem;
    margin-top: 0.15rem;
    margin-right: 0.07rem;
  }
}
</style>
