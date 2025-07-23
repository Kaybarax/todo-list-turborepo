import React, { useState } from 'react';
import { View } from 'react-native';
import { Checkbox } from './Checkbox';
import theme from '../../theme';

export default {
  title: 'Components/Checkbox',
  component: Checkbox,
};

export const Default = () => {
  const [checked, setChecked] = useState(false);
  
  return (
    <Checkbox 
      checked={checked} 
      onValueChange={setChecked} 
    />
  );
};

export const WithLabel = () => {
  const [checked, setChecked] = useState(false);
  
  return (
    <Checkbox 
      checked={checked} 
      onValueChange={setChecked} 
      label="Accept terms and conditions" 
    />
  );
};

export const Checked = () => {
  const [checked, setChecked] = useState(true);
  
  return (
    <Checkbox 
      checked={checked} 
      onValueChange={setChecked} 
      label="This checkbox is checked by default" 
    />
  );
};

export const Disabled = () => {
  return (
    <View style={{ gap: 16 }}>
      <Checkbox 
        checked={false} 
        onValueChange={() => {}} 
        label="Disabled unchecked" 
        disabled={true} 
      />
      <Checkbox 
        checked={true} 
        onValueChange={() => {}} 
        label="Disabled checked" 
        disabled={true} 
      />
    </View>
  );
};

export const CustomColors = () => {
  const [checked, setChecked] = useState(false);
  
  return (
    <Checkbox 
      checked={checked} 
      onValueChange={setChecked} 
      label="Custom colors" 
      activeColor="#8B5CF6"
      inactiveColor="#C4B5FD"
      checkColor="#FFFFFF"
    />
  );
};

export const CheckboxGroup = () => {
  const [selected, setSelected] = useState({
    option1: false,
    option2: true,
    option3: false,
  });
  
  const handleChange = (option: keyof typeof selected) => (value: boolean) => {
    setSelected({
      ...selected,
      [option]: value,
    });
  };
  
  return (
    <View style={{ gap: 12 }}>
      <Checkbox 
        checked={selected.option1} 
        onValueChange={handleChange('option1')} 
        label="Option 1" 
      />
      <Checkbox 
        checked={selected.option2} 
        onValueChange={handleChange('option2')} 
        label="Option 2" 
      />
      <Checkbox 
        checked={selected.option3} 
        onValueChange={handleChange('option3')} 
        label="Option 3" 
      />
    </View>
  );
};