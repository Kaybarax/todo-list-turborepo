import React from 'react';
import { Select } from '../../Select';

export interface NetworkSelectorProps {
  networks: string[];
  selectedNetwork: string;
  onSelect: (network: string) => void;
  id?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

export const NetworkSelector: React.FC<NetworkSelectorProps> = ({
  networks,
  selectedNetwork,
  onSelect,
  id = 'network-selector',
  'aria-label': ariaLabel = 'Select Network',
  'aria-labelledby': ariaLabelledby,
}) => {
  return (
    <Select
      id={id}
      value={selectedNetwork}
      onChange={e => onSelect(e.target.value)}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      title={ariaLabel} // Add title attribute as fallback
    >
      {networks.map(network => (
        <option key={network} value={network}>
          {network}
        </option>
      ))}
    </Select>
  );
};
