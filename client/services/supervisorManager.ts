export interface SupervisorPermissions {
  canEditCountryInfo: boolean;
  canAddCities: boolean;
  canEditCities: boolean;
  canDeleteCities: boolean;
  canAddOffices: boolean;
  canEditOffices: boolean;
  canDeleteOffices: boolean;
  canViewReports: boolean;
  canManageReviews: boolean;
  canAddOffers?: boolean;
  canEditOffers?: boolean;
  canDeleteOffers?: boolean;
}

export interface Supervisor {
  id: string;
  email: string;
  name: {
    ar: string;
    en: string;
    fr: string;
  };
  countryId: string;
  permissions: SupervisorPermissions;
  isActive: boolean;
  avatar?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  password: string; // In production, this should be hashed
}

export interface SupervisorActivity {
  id: string;
  supervisorId: string;
  action: string;
  targetType: 'city' | 'office' | 'country' | 'review';
  targetId: string;
  details: {
    ar: string;
    en: string;
    fr: string;
  };
  timestamp: string;
}

const API_SUPERVISORS = '/api/admin-data';

class SupervisorManager {
  private readonly SUPERVISORS_KEY = 'supervisors_data';
  private readonly ACTIVITIES_KEY = 'supervisor_activities';
  private readonly SESSION_KEY = 'supervisor_session';

  // Default permissions for new supervisors
  private defaultPermissions: SupervisorPermissions = {
    canEditCountryInfo: false,
    canAddCities: true,
    canEditCities: true,
    canDeleteCities: false,
    canAddOffices: true,
    canEditOffices: true,
    canDeleteOffices: false,
    canViewReports: true,
    canManageReviews: true,
    canAddOffers: true,
    canEditOffers: true,
    canDeleteOffers: false
  };

  private mergePermissions(permissions?: Partial<SupervisorPermissions>): SupervisorPermissions {
    return {
      ...this.defaultPermissions,
      ...(permissions || {}),
      canAddOffers:
        permissions?.canAddOffers !== undefined ? permissions.canAddOffers : this.defaultPermissions.canAddOffers,
      canEditOffers:
        permissions?.canEditOffers !== undefined ? permissions.canEditOffers : this.defaultPermissions.canEditOffers,
      canDeleteOffers:
        permissions?.canDeleteOffers !== undefined ? permissions.canDeleteOffers : this.defaultPermissions.canDeleteOffers,
    };
  }

  /** تحميل المشرفين من السيرفر لظهورهم على كل الأجهزة */
  async getSupervisorsAsync(): Promise<Supervisor[]> {
    try {
      const response = await fetch(`${API_SUPERVISORS}/supervisors`);
      if (response.ok) {
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          const normalized = result.data.map((sup: Supervisor) => ({
            ...sup,
            permissions: this.mergePermissions(sup.permissions)
          }));
          this.saveSupervisors(normalized);
          return normalized;
        }
      }
    } catch (error) {
      console.error('Error loading supervisors from server:', error);
    }
    return this.getSupervisors();
  }

  /** حفظ قائمة المشرفين على السيرفر */
  async saveSupervisorsAsync(supervisors: Supervisor[]): Promise<boolean> {
    try {
      const response = await fetch(`${API_SUPERVISORS}/supervisors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(supervisors)
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          this.saveSupervisors(supervisors);
          return true;
        }
      }
    } catch (error) {
      console.error('Error saving supervisors to server:', error);
    }
    return false;
  }

  // Get all supervisors
  getSupervisors(): Supervisor[] {
    try {
      const data = localStorage.getItem(this.SUPERVISORS_KEY);
      const parsed: Supervisor[] = data ? JSON.parse(data) : [];
      return parsed.map((sup) => ({
        ...sup,
        permissions: this.mergePermissions(sup.permissions)
      }));
    } catch (error) {
      console.error('Error loading supervisors:', error);
      return [];
    }
  }

  // Save supervisors
  private saveSupervisors(supervisors: Supervisor[]): boolean {
    try {
      localStorage.setItem(this.SUPERVISORS_KEY, JSON.stringify(supervisors));
      return true;
    } catch (error) {
      console.error('Error saving supervisors:', error);
      return false;
    }
  }

  // Add new supervisor
  addSupervisor(supervisorData: Omit<Supervisor, 'id' | 'createdAt' | 'updatedAt'>): Supervisor | null {
    try {
      const supervisors = this.getSupervisors();
      
      // Check if email already exists
      if (supervisors.some(s => s.email === supervisorData.email)) {
        throw new Error('Email already exists');
      }

      const newSupervisor: Supervisor = {
        ...supervisorData,
        id: `supervisor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      permissions: this.mergePermissions(supervisorData.permissions),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      supervisors.push(newSupervisor);
      if (this.saveSupervisors(supervisors)) {
        this.saveSupervisorsAsync(supervisors).catch((e) => console.error('Server sync:', e));
        this.logActivity(newSupervisor.id, 'supervisor_created', 'supervisor', newSupervisor.id, {
          ar: `تم إنشاء حساب مشرف جديد: ${newSupervisor.name.ar}`,
          en: `New supervisor account created: ${newSupervisor.name.en}`,
          fr: `Nouveau compte superviseur créé: ${newSupervisor.name.fr}`
        });
        return newSupervisor;
      }
      return null;
    } catch (error) {
      console.error('Error adding supervisor:', error);
      return null;
    }
  }

  // Update supervisor
  updateSupervisor(id: string, updates: Partial<Supervisor>): boolean {
    try {
      const supervisors = this.getSupervisors();
      const index = supervisors.findIndex(s => s.id === id);
      
      if (index === -1) return false;
      
      const oldSupervisor = supervisors[index];
      supervisors[index] = {
        ...supervisors[index],
        ...updates,
        permissions: updates.permissions
          ? this.mergePermissions(updates.permissions)
          : supervisors[index].permissions,
        updatedAt: new Date().toISOString()
      };
      
      if (this.saveSupervisors(supervisors)) {
        this.saveSupervisorsAsync(supervisors).catch((e) => console.error('Server sync:', e));
        this.logActivity(id, 'supervisor_updated', 'supervisor', id, {
          ar: `تم تحديث بيانات المشرف: ${supervisors[index].name.ar}`,
          en: `Supervisor data updated: ${supervisors[index].name.en}`,
          fr: `Données du superviseur mises à jour: ${supervisors[index].name.fr}`
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating supervisor:', error);
      return false;
    }
  }

  // Delete supervisor
  deleteSupervisor(id: string): boolean {
    try {
      const supervisors = this.getSupervisors();
      const supervisor = supervisors.find(s => s.id === id);
      if (!supervisor) return false;
      
      const filteredSupervisors = supervisors.filter(s => s.id !== id);
      
      if (this.saveSupervisors(filteredSupervisors)) {
        this.saveSupervisorsAsync(filteredSupervisors).catch((e) => console.error('Server sync:', e));
        this.logActivity(id, 'supervisor_deleted', 'supervisor', id, {
          ar: `تم حذف حساب المشرف: ${supervisor.name.ar}`,
          en: `Supervisor account deleted: ${supervisor.name.en}`,
          fr: `Compte superviseur supprimé: ${supervisor.name.fr}`
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting supervisor:', error);
      return false;
    }
  }

  // Get supervisor by ID
  getSupervisorById(id: string): Supervisor | null {
    const supervisors = this.getSupervisors();
    return supervisors.find(s => s.id === id) || null;
  }

  // Get supervisors by country
  getSupervisorsByCountry(countryId: string): Supervisor[] {
    const supervisors = this.getSupervisors();
    return supervisors.filter(s => s.countryId === countryId && s.isActive);
  }

  // Login supervisor
  loginSupervisor(email: string, password: string): Supervisor | null {
    try {
      const supervisors = this.getSupervisors();
      const supervisor = supervisors.find(s => 
        s.email === email && 
        s.password === password && 
        s.isActive
      );
      
      if (supervisor) {
        // Update last login
        this.updateSupervisor(supervisor.id, { lastLogin: new Date().toISOString() });
        
        // Create session
        const session = {
          supervisorId: supervisor.id,
          email: supervisor.email,
          countryId: supervisor.countryId,
          permissions: supervisor.permissions,
          loginTime: new Date().toISOString()
        };
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
        
        this.logActivity(supervisor.id, 'supervisor_login', 'supervisor', supervisor.id, {
          ar: `تسجيل دخول المشرف: ${supervisor.name.ar}`,
          en: `Supervisor login: ${supervisor.name.en}`,
          fr: `Connexion superviseur: ${supervisor.name.fr}`
        });
        
        return supervisor;
      }
      return null;
    } catch (error) {
      console.error('Error during supervisor login:', error);
      return null;
    }
  }

  // Logout supervisor
  logoutSupervisor(): boolean {
    try {
      const session = this.getCurrentSession();
      if (session) {
        const supervisor = this.getSupervisorById(session.supervisorId);
        if (supervisor) {
          this.logActivity(supervisor.id, 'supervisor_logout', 'supervisor', supervisor.id, {
            ar: `تسجيل خروج المشرف: ${supervisor.name.ar}`,
            en: `Supervisor logout: ${supervisor.name.en}`,
            fr: `Déconnexion superviseur: ${supervisor.name.fr}`
          });
        }
      }
      localStorage.removeItem(this.SESSION_KEY);
      return true;
    } catch (error) {
      console.error('Error during supervisor logout:', error);
      return false;
    }
  }

  // Get current session
  getCurrentSession(): any {
    try {
      const session = localStorage.getItem(this.SESSION_KEY);
      return session ? JSON.parse(session) : null;
    } catch (error) {
      console.error('Error getting current session:', error);
      return null;
    }
  }

  // Check if supervisor is logged in
  isLoggedIn(): boolean {
    const session = this.getCurrentSession();
    return session !== null;
  }

  // Get current supervisor
  getCurrentSupervisor(): Supervisor | null {
    const session = this.getCurrentSession();
    if (session) {
      return this.getSupervisorById(session.supervisorId);
    }
    return null;
  }

  // Check permission
  hasPermission(permission: keyof SupervisorPermissions): boolean {
    const session = this.getCurrentSession();
    if (session && session.permissions) {
      return session.permissions[permission] === true;
    }
    return false;
  }

  // Update permissions
  updatePermissions(supervisorId: string, permissions: SupervisorPermissions): boolean {
    const result = this.updateSupervisor(supervisorId, { permissions });
    if (result) {
      // Update session if it's the current supervisor
      const session = this.getCurrentSession();
      if (session && session.supervisorId === supervisorId) {
        session.permissions = permissions;
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
      }
    }
    return result;
  }

  // Activity logging
  logActivity(supervisorId: string, action: string, targetType: SupervisorActivity['targetType'], targetId: string, details: { ar: string; en: string; fr: string }): void {
    try {
      const activities = this.getActivities();
      const newActivity: SupervisorActivity = {
        id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        supervisorId,
        action,
        targetType,
        targetId,
        details,
        timestamp: new Date().toISOString()
      };
      
      activities.unshift(newActivity); // Add to beginning
      
      // Keep only last 1000 activities
      if (activities.length > 1000) {
        activities.splice(1000);
      }
      
      localStorage.setItem(this.ACTIVITIES_KEY, JSON.stringify(activities));
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  }

  // Get activities
  getActivities(supervisorId?: string): SupervisorActivity[] {
    try {
      const data = localStorage.getItem(this.ACTIVITIES_KEY);
      const activities = data ? JSON.parse(data) : [];
      
      if (supervisorId) {
        return activities.filter((a: SupervisorActivity) => a.supervisorId === supervisorId);
      }
      
      return activities;
    } catch (error) {
      console.error('Error loading activities:', error);
      return [];
    }
  }

  // Get statistics
  getStatistics() {
    const supervisors = this.getSupervisors();
    const activities = this.getActivities();
    
    const totalSupervisors = supervisors.length;
    const activeSupervisors = supervisors.filter(s => s.isActive).length;
    const inactiveSupervisors = totalSupervisors - activeSupervisors;
    
    // Group by country
    const supervisorsByCountry = supervisors.reduce((acc, supervisor) => {
      acc[supervisor.countryId] = (acc[supervisor.countryId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Recent activities (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentActivities = activities.filter(a => 
      new Date(a.timestamp) > sevenDaysAgo
    ).length;
    
    return {
      totalSupervisors,
      activeSupervisors,
      inactiveSupervisors,
      supervisorsByCountry,
      recentActivities,
      totalActivities: activities.length
    };
  }

  // Validate supervisor data
  validateSupervisorData(data: Partial<Supervisor>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
      errors.push('Valid email is required');
    }
    
    if (!data.name?.ar || data.name.ar.trim().length < 2) {
      errors.push('Arabic name is required (min 2 characters)');
    }
    
    if (!data.name?.en || data.name.en.trim().length < 2) {
      errors.push('English name is required (min 2 characters)');
    }
    
    if (!data.countryId) {
      errors.push('Country assignment is required');
    }
    
    if (!data.password || data.password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Ensure each country has at least one supervisor
  ensureSupervisorsForAllCountries(countries: Array<{ id: string; name: { ar: string; en: string; fr: string }; capital?: { ar?: string; en?: string; fr?: string } }>): void {
    try {
      const supervisors = this.getSupervisors();
      let changed = false;
      let addedCount = 0;

      countries.forEach((country) => {
        // Check if supervisor already exists for this country
        const existingSupervisor = supervisors.find((s) => s.countryId === country.id);
        if (existingSupervisor) {
          return; // Supervisor already exists for this country
        }

        // Generate unique email if default email already exists
        let email = this.getDefaultEmailForCountry(country.id);
        let emailCounter = 1;
        while (supervisors.some(s => s.email === email)) {
          const countryName = country.id;
          email = `supervisor${emailCounter}@${countryName}.ciar.com`;
          emailCounter++;
        }

        // Create default supervisor for this country
        const defaultSupervisor: Omit<Supervisor, 'id' | 'createdAt' | 'updatedAt'> = {
          email: email,
          name: {
            ar: `مشرف ${country.name.ar}`,
            en: `${country.name.en} Supervisor`,
            fr: `Superviseur ${country.name.fr}`,
          },
          countryId: country.id,
          password: 'supervisor123', // Default password - should be changed
          phone: this.getDefaultPhoneForCountry(country.id),
          permissions: {
            canEditCountryInfo: false,
            canAddCities: true,
            canEditCities: true,
            canDeleteCities: false,
            canAddOffices: true,
            canEditOffices: true,
            canDeleteOffices: false,
            canViewReports: true,
            canManageReviews: true,
          },
          isActive: true,
        };

        const newSupervisor = this.addSupervisor(defaultSupervisor);
        if (newSupervisor) {
          changed = true;
          addedCount++;
        }
      });

      if (changed) {
        console.log(`تم إضافة ${addedCount} مشرف جديد للدول`);
      } else {
        console.log('جميع الدول لديها مشرفين بالفعل');
      }
    } catch (error) {
      console.error('Error ensuring default supervisors:', error);
    }
  }

  // Get default phone number for country
  private getDefaultPhoneForCountry(countryId: string): string {
    const phoneMap: Record<string, string> = {
      sudan: '+249 123 456 789',
      saudi: '+966 11 234 5678',
      uae: '+971 4 567 8901',
      egypt: '+20 2 234 5678',
      turkey: '+90 212 345 6789',
      morocco: '+212 522 123 456',
      jordan: '+962 6 123 4567',
      lebanon: '+961 1 234 567',
      tunisia: '+216 71 123 456',
      algeria: '+213 21 123 456',
      iraq: '+964 1 123 4567',
      yemen: '+967 1 234 567',
      syria: '+963 11 123 4567',
      libya: '+218 21 123 456',
      oman: '+968 24 123 456',
      kuwait: '+965 1 234 5678',
      qatar: '+974 4 123 456',
      bahrain: '+973 17 123 456',
    };
    return phoneMap[countryId] || '+1 234 567 8900';
  }

  // Get default email for country
  private getDefaultEmailForCountry(countryId: string): string {
    const countryNames: Record<string, string> = {
      sudan: 'khartoum',
      saudi: 'riyadh',
      uae: 'dubai',
      egypt: 'cairo',
      turkey: 'istanbul',
      morocco: 'casablanca',
      jordan: 'amman',
      lebanon: 'beirut',
      tunisia: 'tunis',
      algeria: 'algiers',
      iraq: 'baghdad',
      yemen: 'sanaa',
      syria: 'damascus',
      libya: 'tripoli',
      oman: 'muscat',
      kuwait: 'kuwait',
      qatar: 'doha',
      bahrain: 'manama',
    };
    const cityName = countryNames[countryId] || 'supervisor';
    return `supervisor@${cityName}.ciar.com`;
  }

  // Clear all data
  clearAllData(): boolean {
    try {
      localStorage.removeItem(this.SUPERVISORS_KEY);
      localStorage.removeItem(this.ACTIVITIES_KEY);
      localStorage.removeItem(this.SESSION_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing supervisor data:', error);
      return false;
    }
  }
}

// Create singleton instance
export const supervisorManager = new SupervisorManager();
export default supervisorManager;
