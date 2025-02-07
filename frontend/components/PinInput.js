// frontend/components/PinInput.js
import React, { useRef, useEffect } from 'react';
import {
  HStack,
  PinInput as ChakraPinInput,
  PinInputField,
} from '@chakra-ui/react';

const PinInput = ({ value = '', onChange, isInvalid }) => {
  const inputRefs = useRef([]);

  useEffect(() => {
    // Ensure initial focus if no value
    if (!value && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [value]);

  const handleChange = (value) => {
    // Only allow numbers
    if (/^\d*$/.test(value)) {
      onChange(value);
    }
  };

  return (
    <HStack spacing="4">
      <ChakraPinInput
        value={value}
        onChange={handleChange}
        type="number"
        mask
        size="lg"
      >
        <PinInputField ref={el => inputRefs.current[0] = el} />
        <PinInputField ref={el => inputRefs.current[1] = el} />
        <PinInputField ref={el => inputRefs.current[2] = el} />
        <PinInputField ref={el => inputRefs.current[3] = el} />
      </ChakraPinInput>
    </HStack>
  );
};

export default PinInput;