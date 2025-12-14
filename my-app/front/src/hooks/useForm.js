import { useState, useCallback } from 'react';

const useForm = (initialValues = {}, validationRules = {}) => {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((field) => (value) => {
    const finalValue = value?.target ? value.target.value : value;
    
    setFormData(prev => ({ 
      ...prev, 
      [field]: finalValue 
    }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const validate = useCallback(() => {
    const newErrors = {};
    
    Object.keys(validationRules).forEach(field => {
      const rules = validationRules[field];
      const value = formData[field];
      
      if (rules.required) {
        if (value === null || value === undefined || value === '') {
          newErrors[field] = rules.required;
          return;
        }
        
        if (typeof value === 'string' && !value.trim()) {
          newErrors[field] = rules.required;
          return;
        }
      }
      
      if (rules.pattern && value && !rules.pattern.test(value)) {
        newErrors[field] = rules.patternMessage || 'Некорректный формат';
      }
      
      if (rules.min !== undefined && value && !isNaN(value) && parseFloat(value) < rules.min) {
        newErrors[field] = rules.minMessage || `Значение должно быть не менее ${rules.min}`;
      }

      if (rules.validate && typeof rules.validate === 'function') {
        const customError = rules.validate(value, formData);
        if (customError) {
          newErrors[field] = customError;
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validationRules]);

  const resetForm = useCallback(() => {
    setFormData(initialValues);
    setErrors({});
    setSubmitError('');
    setIsSubmitting(false);
  }, [initialValues]);

  const setFieldValue = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  return {
    formData,
    setFormData,
    errors,
    submitError,
    setSubmitError,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    validate,
    resetForm,
    setFieldValue
  };
};

export default useForm;