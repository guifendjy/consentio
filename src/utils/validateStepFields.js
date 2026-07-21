// utils/formValidation.js
import { Alert } from "../store";

/**
 * Validates all visible, required fields for a single wizard step.
 * @param {Object} stepData - The active step object from consentFormSchema
 * @param {Object} formData - Map of reactive signals holding user input values
 * @returns {boolean} True if all visible fields pass compliance parameters
 */
const validateStepFields = (stepData, formData) => {
  // If we are on the virtual preview page or a step without fields, bypass instantly
  if (!stepData || !stepData.fields) return true;

  /**
   * Helper function to evaluate single field structures (flattens nested fields)
   */
  const checkField = (field) => {
    // 1. Skip validation if the field is hidden via a dependency mismatch
    if (field.dependsOn) {
      const sourceSignal = formData[field.dependsOn.field];
      if (!sourceSignal || sourceSignal.value !== field.dependsOn.value) {
        return true;
      }
    }

    // 2. Handle group fields recursively by unrolling their children
    if (field.type === "group" && Array.isArray(field.children)) {
      for (const child of field.children) {
        if (!checkField(child)) return false;
      }
      return true;
    }

    // 3. Skip if explicitly flagged as an optional parameter
    if (field.optional) return true;

    const valueSignal = formData[field.id];
    const val = valueSignal ? valueSignal.value : null;

    // 4. Structural Type Enforcement
    switch (field.type) {
      case "static":
        return true;
      case "date":
        if (
          !val ||
          typeof val !== "object" ||
          !val.day ||
          !val.from ||
          !val.to
        ) {
          Alert.show(
            `Please fill out a complete date and time window for "${field.label}".`,
          );
          return false;
        }
        break;

      case "multi-select":
        if (!val || !Array.isArray(val) || val.length === 0) {
          Alert.show(`Please select at least one option for "${field.label}".`);
          return false;
        }
        break;

      case "text":
      case "radio":
      default:
        // Catches uninitialized inputs, empty array loops, or plain empty string configurations
        if (
          val === undefined ||
          val === null ||
          (typeof val === "string" && !val.trim())
        ) {
          Alert.show(
            `"${field.label || "Required field"}" must be completed to proceed.`,
          );
          return false;
        }
        break;
    }

    return true;
  };

  // Run the checker across every primary field in the step schema array
  for (const field of stepData.fields) {
    if (!checkField(field)) return false;
  }

  return true;
};

export default validateStepFields;
