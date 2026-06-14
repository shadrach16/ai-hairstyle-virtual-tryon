// G3: Push notification preference toggle for mobile profile
import React, { useState, useCallback, useEffect } from 'react';
import { Bell, BellOff, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { apiService } from '@/lib/api';
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { toast } from 'sonner';

interface NotificationToggleProps {
  initialEnabled?: boolean;
  className?: string;
}

const triggerHaptic = async () => {
  try {
    if (Capacitor.isNativePlatform()) {
      await Haptics.impact({ style: ImpactStyle.Light });
    }
  } catch (e) {}
};

export default function NotificationToggle({
  initialEnabled = true,
  className,
}: NotificationToggleProps) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setEnabled(initialEnabled);
  }, [initialEnabled]);

  const handleToggle = useCallback(async () => {
    const newVal = !enabled;
    setSaving(true);
    triggerHaptic();

    try {
      const result = await apiService.updateProfile({
        preferences: { notifications: newVal },
      });

      if (result.success) {
        setEnabled(newVal);
        toast.success(newVal ? 'Notifications enabled' : 'Notifications paused');

        // If disabling, also unregister device token to stop pushes
        if (!newVal) {
          await apiService.unregisterDeviceToken();
        }
      } else {
        toast.error(result.message || 'Failed to update');
      }
    } catch {
      toast.error('Could not update preference');
    } finally {
      setSaving(false);
    }
  }, [enabled]);

  return (
    <button
      onClick={handleToggle}
      disabled={saving}
      className={cn(
        'flex items-center justify-between w-full px-4 py-3 rounded-xl transition-colors',
        enabled ? 'bg-amber-50' : 'bg-gray-50',
        className
      )}
      role="switch"
      aria-checked={enabled}
      aria-label="Push notifications"
    >
      <div className="flex items-center gap-3">
        {enabled ? (
          <Bell className="w-5 h-5 text-amber-500" />
        ) : (
          <BellOff className="w-5 h-5 text-gray-400" />
        )}
        <div className="text-left">
          <p className="text-sm font-medium text-gray-800">Push Notifications</p>
          <p className="text-xs text-gray-500">
            {enabled ? 'Streaks, rewards & new styles' : 'Paused'}
          </p>
        </div>
      </div>

      {saving ? (
        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
      ) : (
        <div
          className={cn(
            'w-11 h-6 rounded-full relative transition-colors',
            enabled ? 'bg-amber-500' : 'bg-gray-300'
          )}
        >
          <div
            className={cn(
              'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform',
              enabled ? 'translate-x-[22px]' : 'translate-x-0.5'
            )}
          />
        </div>
      )}
    </button>
  );
}
