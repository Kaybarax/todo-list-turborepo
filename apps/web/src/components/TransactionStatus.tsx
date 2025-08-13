'use client';

import { useState, useEffect } from 'react';
import { createBlockchainService } from '@/services/blockchainService';
import { BlockchainNetwork } from '@todo/services';

interface TransactionStatusProps {
  transactionHash: string;
  network: BlockchainNetwork;
  onStatusChange?: (status: 'pending' | 'confirmed' | 'failed') => void;
}

export function TransactionStatus({ transactionHash, network, onStatusChange }: TransactionStatusProps) {
  const [status, setStatus] = useState<'pending' | 'confirmed' | 'failed'>('pending');
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    let timeoutId: NodeJS.Timeout;

    const checkStatus = async () => {
      try {
        const blockchainService = createBlockchainService(network);
        const currentStatus = await blockchainService.getTransactionStatus(transactionHash);

        setStatus(currentStatus);
        onStatusChange?.(currentStatus);

        if (currentStatus === 'confirmed' || currentStatus === 'failed') {
          setIsChecking(false);
          clearInterval(intervalId);
          clearTimeout(timeoutId);
        }
      } catch (error) {
        console.error('Failed to check transaction status:', error);
        setStatus('failed');
        setIsChecking(false);
        clearInterval(intervalId);
        clearTimeout(timeoutId);
      }
    };

    // Check status immediately
    checkStatus();

    // Set up polling for status updates
    intervalId = setInterval(checkStatus, 3000); // Check every 3 seconds

    // Set timeout to stop checking after 5 minutes
    timeoutId = setTimeout(
      () => {
        setIsChecking(false);
        clearInterval(intervalId);
      },
      5 * 60 * 1000,
    );

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [transactionHash, network, onStatusChange]);

  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'confirmed':
        return 'text-green-600 bg-green-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return (
          <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        );
      case 'confirmed':
        return (
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'failed':
        return (
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return null;
    }
  };

  const formatHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  return (
    <div className="flex items-center space-x-2 text-xs">
      <span className={`inline-flex items-center px-2 py-1 rounded-full font-medium ${getStatusColor()}`}>
        {getStatusIcon()}
        <span className="ml-1 capitalize">{status}</span>
      </span>

      <span className="text-gray-500">
        Tx: <code className="bg-gray-100 px-1 py-0.5 rounded">{formatHash(transactionHash)}</code>
      </span>

      {isChecking && status === 'pending' && <span className="text-gray-400 text-xs">Checking...</span>}
    </div>
  );
}
