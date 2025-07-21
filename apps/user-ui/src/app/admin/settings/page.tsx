'use client';

import { AlertTriangle, Save, Settings, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  AdminGrid,
  AdminPageLayout,
  AdminSection,
} from '../../../components/admin/layout/AdminPageLayout';
import { FormSkeleton } from '../../../components/admin/skeletons/AdminSkeletons';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Label } from '../../../components/ui/label';
import { Separator } from '../../../components/ui/separator';
import { Switch } from '../../../components/ui/switch';
import { dataProvider } from '../../../lib/data';
import { ShopControls } from '../../../types/domain';

/**
 * Shop controls and settings page
 */
export default function SettingsPage() {
  const [shopControls, setShopControls] = useState<ShopControls | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load shop controls
  useEffect(() => {
    const loadShopControls = async () => {
      setLoading(true);
      try {
        const controls = await dataProvider.getShopControls();
        setShopControls(controls);
      } catch (error) {
        console.error('Failed to load shop controls:', error);
      } finally {
        setLoading(false);
      }
    };

    loadShopControls();
  }, []);

  const handleToggle = (field: keyof ShopControls, value: boolean) => {
    if (!shopControls) return;

    setShopControls({
      ...shopControls,
      [field]: value,
    });
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!shopControls || !hasChanges) return;

    setSaving(true);
    try {
      const updatedControls = await dataProvider.updateShopControls({
        isPreOrderEnabled: shopControls.isPreOrderEnabled,
        isOfferEnabled: shopControls.isOfferEnabled,
        isPremiumCollectionEnabled: shopControls.isPremiumCollectionEnabled,
        maintenanceMode: shopControls.maintenanceMode,
      });

      setShopControls(updatedControls);
      setHasChanges(false);

      // Show success message
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save shop controls:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    // Reload original data
    const loadShopControls = async () => {
      try {
        const controls = await dataProvider.getShopControls();
        setShopControls(controls);
        setHasChanges(false);
      } catch (error) {
        console.error('Failed to reload shop controls:', error);
      }
    };

    loadShopControls();
  };

  if (loading) {
    return (
      <AdminPageLayout
        title="Settings"
        description="Manage shop controls and system settings"
      >
        <AdminSection>
          <FormSkeleton />
        </AdminSection>
      </AdminPageLayout>
    );
  }

  if (!shopControls) {
    return (
      <AdminPageLayout
        title="Settings"
        description="Manage shop controls and system settings"
      >
        <AdminSection>
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Failed to load settings
            </h3>
            <p className="text-gray-500 mb-4">Unable to load shop controls.</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </AdminSection>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout
      title="Settings"
      description="Manage shop controls and system settings"
      actions={
        <div className="flex items-center space-x-2">
          {hasChanges && (
            <>
              <Button variant="outline" onClick={handleReset}>
                Reset Changes
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <span className="animate-spin mr-2">⟳</span>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      }
    >
      {/* Shop Controls */}
      <AdminSection
        title="Shop Controls"
        description="Configure global shop features and functionality"
      >
        <div className="space-y-6">
          {/* Pre-Order Settings */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Label className="text-base font-medium">
                  Pre-Order System
                </Label>
                <Badge
                  variant={
                    shopControls.isPreOrderEnabled ? 'default' : 'secondary'
                  }
                >
                  {shopControls.isPreOrderEnabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              <p className="text-sm text-gray-500">
                Allow customers to place pre-orders for upcoming products
              </p>
            </div>
            <Switch
              checked={shopControls.isPreOrderEnabled}
              onCheckedChange={(checked) =>
                handleToggle('isPreOrderEnabled', checked)
              }
            />
          </div>

          {/* Offers System */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Label className="text-base font-medium">
                  Offers & Promotions
                </Label>
                <Badge
                  variant={
                    shopControls.isOfferEnabled ? 'default' : 'secondary'
                  }
                >
                  {shopControls.isOfferEnabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              <p className="text-sm text-gray-500">
                Display offer labels and promotional badges on products
              </p>
            </div>
            <Switch
              checked={shopControls.isOfferEnabled}
              onCheckedChange={(checked) =>
                handleToggle('isOfferEnabled', checked)
              }
            />
          </div>

          {/* Premium Collection */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Label className="text-base font-medium">
                  Premium Collection
                </Label>
                <Badge
                  variant={
                    shopControls.isPremiumCollectionEnabled
                      ? 'default'
                      : 'secondary'
                  }
                >
                  {shopControls.isPremiumCollectionEnabled
                    ? 'Enabled'
                    : 'Disabled'}
                </Badge>
              </div>
              <p className="text-sm text-gray-500">
                Showcase premium products in a dedicated collection
              </p>
            </div>
            <Switch
              checked={shopControls.isPremiumCollectionEnabled}
              onCheckedChange={(checked) =>
                handleToggle('isPremiumCollectionEnabled', checked)
              }
            />
          </div>

          <Separator />

          {/* Maintenance Mode */}
          <div className="flex items-center justify-between p-4 border rounded-lg border-orange-200 bg-orange-50">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <Label className="text-base font-medium text-orange-900">
                  Maintenance Mode
                </Label>
                <Badge
                  variant={
                    shopControls.maintenanceMode ? 'destructive' : 'outline'
                  }
                >
                  {shopControls.maintenanceMode ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <p className="text-sm text-orange-700">
                Put the shop in maintenance mode to prevent new orders while
                updating
              </p>
            </div>
            <Switch
              checked={shopControls.maintenanceMode}
              onCheckedChange={(checked) =>
                handleToggle('maintenanceMode', checked)
              }
            />
          </div>
        </div>
      </AdminSection>

      {/* System Information */}
      <AdminGrid columns={2}>
        <AdminSection title="System Information">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Last Updated</span>
              <span className="text-sm text-gray-600">
                {new Date(shopControls.updatedAt).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Updated By</span>
              <span className="text-sm text-gray-600">
                {shopControls.updatedBy}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Environment</span>
              <Badge
                variant={
                  process.env.NODE_ENV === 'production'
                    ? 'default'
                    : 'secondary'
                }
              >
                {process.env.NODE_ENV === 'production'
                  ? 'Production'
                  : 'Development'}
              </Badge>
            </div>
          </div>
        </AdminSection>

        <AdminSection
          title="Access Control"
          description="Role-based access control settings"
        >
          <div className="space-y-4">
            <div className="text-center py-8">
              <Shield className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                RBAC Settings
              </h3>
              <p className="text-gray-500 mb-4">
                Role-based access control settings will be available in a future
                update.
              </p>
              <Button variant="outline" disabled>
                <Settings className="mr-2 h-4 w-4" />
                Configure Roles
              </Button>
            </div>
          </div>
        </AdminSection>
      </AdminGrid>

      {/* Feature Status Overview */}
      <AdminSection title="Feature Status Overview">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {shopControls.isPreOrderEnabled ? 'ON' : 'OFF'}
            </div>
            <div className="text-sm text-gray-500">Pre-Orders</div>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {shopControls.isOfferEnabled ? 'ON' : 'OFF'}
            </div>
            <div className="text-sm text-gray-500">Offers</div>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {shopControls.isPremiumCollectionEnabled ? 'ON' : 'OFF'}
            </div>
            <div className="text-sm text-gray-500">Premium</div>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div
              className={`text-2xl font-bold mb-1 ${
                shopControls.maintenanceMode ? 'text-red-600' : 'text-green-600'
              }`}
            >
              {shopControls.maintenanceMode ? 'ON' : 'OFF'}
            </div>
            <div className="text-sm text-gray-500">Maintenance</div>
          </div>
        </div>
      </AdminSection>

      {/* Changes Warning */}
      {hasChanges && (
        <div className="fixed bottom-6 right-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-lg">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">
              You have unsaved changes
            </span>
          </div>
        </div>
      )}
    </AdminPageLayout>
  );
}
