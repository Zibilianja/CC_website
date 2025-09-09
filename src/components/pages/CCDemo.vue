/* ==========================================================================
CCDemo.vue - Demo page for Creative Corvid components.
========================================================================== */
<script setup lang="ts">
import ButtonDemo from '../demo-components/ButtonDemo.vue';
import CheckboxRadioDemo from '../demo-components/CheckboxRadioDemo.vue';
import InputTextDemo from '../demo-components/InputTextDemo.vue';
import InputTextAreaInputDemo from '../demo-components/TextAreaInputDemo.vue';
import DateDemo from '../demo-components/DateDemo.vue';
import InfoPanelDemo from '../demo-components/InfoPanelDemo.vue';
</script>
/* Template ============================================================== */
<template>
  <h2>Creative Corvid Components Demo</h2>
  <div class="cc-mx-6">
    <ButtonDemo />
    <CheckboxRadioDemo />
    <InputTextDemo />
    <InputTextAreaInputDemo />
    <DateDemo />
    <InfoPanelDemo />
  </div>
</template>
/* Styles ================================================================ */
<style lang="scss">
.CC__demo-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  h2 {
    margin: 0;
  }
}

.CC__demo-container {
  padding: 1.5rem;
  margin: 2rem 0;
}

.CC__demo-wrapper {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}

label {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.CC__panel-reset-button {
  margin-top: 1rem;
  color: #ffffff;
  background-color: var(--CC-color-blue);
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #66a481;
  }
}

.cc-clear-button {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--CC-color-gray-dark);
  background-color: transparent;
  border: none;
  border-radius: 50%;
  padding: 0.24rem;
  cursor: pointer;
  &.button-present {
    margin-left: -2rem;
    transition: background-color 0.5s ease, color 0.5s ease;
  }
  &:hover {
    background-color: var(--CC-color-gray-dark);
    color: #fff;
  }
}

.CC__demo-container {
  background-color: #f3f3f3;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.37);
}

label {
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  user-select: none;

  .CC__input-checkbox-icon {
    height: 1rem;
    width: 1rem;
  }

  svg {
    &.CC__input-checkbox-icon {
      border: 1px solid var(--CC-color-gray-darker);
      border-radius: 0.2rem;
      background-color: var(--CC-color-gray-light);
      &.invalid__input {
        border-color: #ff002b;
        path {
          fill: #ff002b5b;
          &:hover {
            fill: #e7c7cc;
          }
        }
      }
      &:not(.invalid__input) {
        &:not(.checked) {
          path {
            fill: var(--CC-color-gray-light);

            &:hover {
              fill: #d0d4d2;
            }
          }
        }

        &.checked {
          border: 2px inset var(--CC-color-green-darker);
          background-color: var(--CC-color-green-darker);
          path {
            fill: var(--CC-color-gray-shadow);

            &:hover {
              fill: var(--CC-color-gray);
            }
          }
        }
      }
    }
  }
}

label {
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  user-select: none;

  .CC__input-checkbox-icon {
    height: 1rem;
    width: 1rem;
  }
}
label {
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  user-select: none;

  .CC__input-radio-input {
    margin: 0;
    opacity: 0;
    position: absolute;
    width: 1px;
    height: 1px;

    &[disabled] {
      cursor: not-allowed;
    }
  }

  svg {
    &.CC__input-radio-icon {
      font-size: 1rem;
      border-radius: 50%;

      &.checked {
        border: 2px inset var(--CC-color-green-dark);
        background-color: var(--CC-color-focus-darker);
        path {
          fill: var(--CC-color-gray-shadow);
        }
      }

      &:not(.checked) {
        border: 1px solid var(--CC-color-gray-darker);
        margin: 1px;

        path {
          fill: var(--CC-color-gray-light);
        }
      }
    }
  }
}

.leading-icon {
  color: #333;
}

@media (max-width: 960px) {
  .CC__demo-container {
    .CC__demo-label {
      width: fit-content;
      margin: 0 auto 1rem auto;
    }
  }

  .CC__demo-wrapper {
    flex-direction: column;
    align-items: center;
  }
}

header {
  text-align: center;
  margin-bottom: 1rem;
}
.CC__demo {
  &-container {
    padding: 1rem 0;
    background-color: #f3f0f0;
    border-radius: 0.5rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.37);
    margin: 1rem 0;
  }
  display: flex;
  justify-content: space-evenly;
}
.loading-button {
  #spinner {
    margin-left: 0.5rem;
    animation: cc-animate-spin 1.75s linear infinite;
  }
}

@keyframes cc-animate-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.shown {
  animation: showToast 0.5s ease-in-out forwards;
  @keyframes showToast {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .hidden {
    animation: hideToast 0.5s ease-in-out forwards;
    @keyframes hideToast {
      from {
        opacity: 1;
        transform: translateY(0);
      }
      to {
        opacity: 0;
        transform: translateY(20px);
      }
    }
  }
}
</style>
