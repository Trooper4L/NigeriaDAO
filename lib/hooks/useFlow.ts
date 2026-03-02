import { useState, useEffect } from 'react';
import { FlowService } from '@/lib/services/flow';

export function useFlow() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = FlowService.subscribeToUser((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const connect = async () => {
    try {
      await FlowService.authenticate();
    } catch (error) {
      console.error('Flow connection error:', error);
      throw error;
    }
  };

  const disconnect = async () => {
    try {
      await FlowService.unauthenticate();
    } catch (error) {
      console.error('Flow disconnection error:', error);
      throw error;
    }
  };

  return {
    user,
    loading,
    connect,
    disconnect,
    isConnected: !!user?.addr,
    address: user?.addr,
  };
}
