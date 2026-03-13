import React, { useState, useEffect } from 'react';
import {
  Search, Plus, Edit, Trash2, Eye, AlertCircle, CheckCircle, XCircle, Clock,
  Beaker, Mail, Phone, MapPin, Download, RefreshCw, MoreVertical,
  Settings, FileText, Shield, UserCheck, UserX, Building2, CreditCard,
  HardDrive, Filter, Activity, X, Loader, UserPlus
} from 'lucide-react';

// API response interface based on your data
interface ExternalVendor {
  _id: string;
  name: string;
  type: string;
  clinicId: string | null;
  contactPerson: string;
  email: string;
  services: string[];
  technicianIds: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Technician interface
interface Technician {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  technicianId: string;
  labVendorId: string | null;
  labType: 'aligner' | 'external' | 'inHouse';
  createdAt: string;
}

// Extended Lab interface for UI (compatible with your existing UI)
interface Lab {
  id: string;
  name: string;
  registrationNumber: string;
  type: 'Pathology' | 'Radiology' | 'Clinical' | 'Research' | 'Diagnostic' | string;
  status: 'active' | 'pending' | 'suspended' | 'inactive';
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  registrationDate: string;
  expiryDate: string;
  licenseNumber: string;
  accreditation: string[];
  totalStaff: number;
  totalPatients: number;
  monthlyTests: number;
  subscription: {
    plan: 'Basic' | 'Professional' | 'Enterprise' | 'Custom';
    status: 'active' | 'expired' | 'pending';
    amount: number;
    nextBilling: string;
  };
  contactPerson: {
    name: string;
    email: string;
    phone: string;
    designation: string;
  };
  documents: { name: string; status: 'verified' | 'pending' | 'rejected'; url: string; }[];
  equipment: { name: string; count: number; lastCalibration: string; status: 'operational' | 'maintenance' | 'offline'; }[];
  workingHours: { day: string; open: string; close: string; closed: boolean; }[];
  createdAt: string;
  lastActive: string;
  compliance: { hipaa: boolean; iso: boolean; cap: boolean; clia: boolean; };
  performance: { rating: number; reviews: number; avgResponseTime: string; accuracy: number; };
  technicians?: Technician[]; // Added technicians array
}

// Vendor creation form data interface
interface VendorFormData {
  name: string;
  contactPerson: string;
  email: string;
  services: string[];
  isActive: boolean;
  vendorType: 'lab' | 'aligner';
}

// Technician registration form data
interface TechnicianFormData {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  labVendorId: string;
  labType: 'aligner' | 'external';
}

// Available services options
const availableServices = [
  'X-ray',
  'MRI',
  'CT Scan',
  'Ultrasound',
  'Blood Test',
  'Pathology',
  'Radiology',
  'Dental Aligners',
  'Orthodontic Appliances',
  'Retainers',
  'Surgical Guides'
];

// Default values for fields not present in API
const getDefaultLabValues = (vendor: ExternalVendor): Lab => {
  return {
    id: vendor._id,
    name: vendor.name,
    registrationNumber: `REG${Math.floor(Math.random() * 1000000)}`,
    type: vendor.services.includes('X-ray') ? 'Radiology' : 
          vendor.services.includes('Pathology') ? 'Pathology' : 
          vendor.type === 'aligner' ? 'Clinical' : 'Diagnostic',
    status: vendor.isActive ? 'active' : 'inactive',
    email: vendor.email,
    phone: '+1 234-567-8901', // Default as API doesn't provide
    address: '123 Medical Plaza', // Default
    city: 'New York', // Default
    state: 'NY', // Default
    country: 'USA', // Default
    pincode: '10001', // Default
    registrationDate: vendor.createdAt,
    expiryDate: new Date(new Date(vendor.createdAt).setFullYear(new Date(vendor.createdAt).getFullYear() + 1)).toISOString(),
    licenseNumber: `LIC${Math.floor(Math.random() * 1000000)}`,
    accreditation: [],
    totalStaff: vendor.technicianIds?.length || 0,
    totalPatients: 0,
    monthlyTests: 0,
    subscription: {
      plan: 'Basic',
      status: vendor.isActive ? 'active' : 'pending',
      amount: 999,
      nextBilling: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
    },
    contactPerson: {
      name: vendor.contactPerson || 'Not specified',
      email: vendor.email,
      phone: '+1 234-567-8902',
      designation: 'Lab Director',
    },
    documents: [],
    equipment: [],
    workingHours: [
      { day: 'Monday', open: '09:00', close: '18:00', closed: false },
      { day: 'Tuesday', open: '09:00', close: '18:00', closed: false },
      { day: 'Wednesday', open: '09:00', close: '18:00', closed: false },
      { day: 'Thursday', open: '09:00', close: '18:00', closed: false },
      { day: 'Friday', open: '09:00', close: '18:00', closed: false },
      { day: 'Saturday', open: '10:00', close: '14:00', closed: false },
      { day: 'Sunday', open: '00:00', close: '00:00', closed: true }
    ],
    createdAt: vendor.createdAt,
    lastActive: vendor.updatedAt,
    compliance: { hipaa: false, iso: false, cap: false, clia: false },
    performance: { rating: 0, reviews: 0, avgResponseTime: 'N/A', accuracy: 0 },
    technicians: [] // Will be populated when we fetch technicians
  };
};

/* ── reusable mini-components ── */
const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, marginTop: 4 }}>
    <span style={{ fontSize: 10.5, fontWeight: 700, color: '#667eea', textTransform: 'uppercase' as const, letterSpacing: '0.9px', whiteSpace: 'nowrap' as const }}>{children}</span>
    <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(102,126,234,0.35), transparent)' }} />
  </div>
);

const InfoCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={{ background: 'rgba(248,250,252,0.9)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 14, padding: 16 }}>
    <div style={{ fontSize: 10.5, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' as const, letterSpacing: '0.8px', marginBottom: 12 }}>{title}</div>
    {children}
  </div>
);

const DL: React.FC<{ items: [string, string][] }> = ({ items }) => (
  <dl>{items.map(([k, v]) => (
    <div key={k} style={{ marginBottom: 9 }}>
      <dt style={{ fontSize: 11, color: '#94a3b8', marginBottom: 1 }}>{k}</dt>
      <dd style={{ fontSize: 13.5, color: '#1e293b', fontWeight: 500 }}>{v}</dd>
    </div>
  ))}</dl>
);

// Add Vendor Modal Component
interface AddVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  vendorType: 'lab' | 'aligner';
}

const AddVendorModal: React.FC<AddVendorModalProps> = ({ isOpen, onClose, onSuccess, vendorType }) => {
  const [formData, setFormData] = useState<VendorFormData>({
    name: '',
    contactPerson: '',
    email: '',
    services: [],
    isActive: true,
    vendorType: vendorType
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Reset form when modal opens/closes or vendorType changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        contactPerson: '',
        email: '',
        services: [],
        isActive: true,
        vendorType: vendorType
      });
      setError(null);
      setSuccess(null);
    }
  }, [isOpen, vendorType]);

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name || formData.name.trim().length < 2) {
      setError('Vendor name is required and must be at least 2 characters long');
      return false;
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Invalid email format');
      return false;
    }
    if (formData.services.length === 0) {
      setError('Please select at least one service');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const endpoint = vendorType === 'lab' 
        ? 'http://localhost:8006/api/v1/lab/create-vendor'
        : 'http://localhost:8006/api/v1/lab/vendors/create-aligner';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create vendor');
      }

      setSuccess('Vendor created successfully!');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create vendor');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15,23,42,0.4)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div style={{
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        border: '1px solid rgba(148,163,184,0.25)',
        borderRadius: 22,
        width: 500,
        maxWidth: 'calc(100vw - 40px)',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 60px rgba(0,0,0,0.15)'
      }}>
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 24px',
          borderBottom: '1px solid rgba(148,163,184,0.18)',
          background: 'rgba(248,250,252,0.9)',
          borderRadius: '22px 22px 0 0',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: 'linear-gradient(135deg,rgba(102,126,234,0.12),rgba(118,75,162,0.1))',
              border: '1px solid rgba(102,126,234,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#667eea'
            }}>
              <Building2 size={18} />
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: '#1e293b' }}>
                Add New {vendorType === 'lab' ? 'Lab' : 'Aligner'} Vendor
              </div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 1 }}>
                Fill in the vendor details below
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: '1px solid rgba(148,163,184,0.25)',
              background: 'rgba(241,245,249,0.9)',
              cursor: 'pointer',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} style={{ padding: 24 }}>
          {/* Error Message */}
          {error && (
            <div style={{
              padding: '12px 16px',
              marginBottom: 20,
              background: 'rgba(255,107,107,0.1)',
              border: '1px solid rgba(255,107,107,0.3)',
              borderRadius: 10,
              color: '#e03131',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13
            }}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div style={{
              padding: '12px 16px',
              marginBottom: 20,
              background: 'rgba(81,207,102,0.1)',
              border: '1px solid rgba(81,207,102,0.3)',
              borderRadius: 10,
              color: '#2f9e44',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13
            }}>
              <CheckCircle size={16} />
              {success}
            </div>
          )}

          {/* Form Fields */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>
              Vendor Name <span style={{ color: '#e03131' }}>*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter vendor name"
              style={{
                width: '100%',
                height: 42,
                padding: '0 14px',
                background: 'rgba(248,250,252,0.95)',
                border: '1px solid rgba(148,163,184,0.25)',
                borderRadius: 10,
                fontSize: 13.5,
                color: '#1e293b',
                fontFamily: 'inherit',
                outline: 'none'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>
              Contact Person
            </label>
            <input
              type="text"
              value={formData.contactPerson}
              onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
              placeholder="Enter contact person name"
              style={{
                width: '100%',
                height: 42,
                padding: '0 14px',
                background: 'rgba(248,250,252,0.95)',
                border: '1px solid rgba(148,163,184,0.25)',
                borderRadius: 10,
                fontSize: 13.5,
                color: '#1e293b',
                fontFamily: 'inherit',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter email address"
              style={{
                width: '100%',
                height: 42,
                padding: '0 14px',
                background: 'rgba(248,250,252,0.95)',
                border: '1px solid rgba(148,163,184,0.25)',
                borderRadius: 10,
                fontSize: 13.5,
                color: '#1e293b',
                fontFamily: 'inherit',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>
              Services <span style={{ color: '#e03131' }}>*</span>
            </label>
            <div style={{
              background: 'rgba(248,250,252,0.95)',
              border: '1px solid rgba(148,163,184,0.25)',
              borderRadius: 10,
              padding: 12
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                {availableServices.map(service => (
                  <label
                    key={service}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 12.5,
                      color: '#475569',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formData.services.includes(service)}
                      onChange={() => handleServiceToggle(service)}
                      style={{ accentColor: '#667eea' }}
                    />
                    {service}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                style={{ accentColor: '#667eea' }}
              />
              <span style={{ fontSize: 13, color: '#475569' }}>Set as active immediately</span>
            </label>
          </div>

          {/* Modal Footer */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 10,
            paddingTop: 16,
            borderTop: '1px solid rgba(148,163,184,0.18)'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                height: 38,
                padding: '0 18px',
                borderRadius: 10,
                border: '1px solid rgba(148,163,184,0.25)',
                background: 'rgba(248,250,252,0.9)',
                color: '#475569',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                height: 38,
                padding: '0 18px',
                borderRadius: 10,
                border: 'none',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                fontSize: 13,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                boxShadow: '0 4px 12px rgba(102,126,234,0.35)',
                opacity: loading ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              {loading && <Loader size={14} className="spin" />}
              {loading ? 'Creating...' : `Create ${vendorType === 'lab' ? 'Lab' : 'Aligner'} Vendor`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Add Technician Modal Component
interface AddTechnicianModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  labVendorId: string;
  labType: 'aligner' | 'external';
  vendorName: string;
}

const AddTechnicianModal: React.FC<AddTechnicianModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  labVendorId, 
  labType,
  vendorName 
}) => {
  const [formData, setFormData] = useState<TechnicianFormData>({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    labVendorId: labVendorId,
    labType: labType
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        labVendorId: labVendorId,
        labType: labType
      });
      setError(null);
      setSuccess(null);
    }
  }, [isOpen, labVendorId, labType]);

  const validateForm = (): boolean => {
    if (!formData.name || formData.name.trim().length < 2) {
      setError('Name is required and must be at least 2 characters long');
      return false;
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Valid email is required');
      return false;
    }
    if (!formData.phoneNumber || !/^\+?[1-9]\d{1,14}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
      setError('Valid phone number is required (E.164 format recommended)');
      return false;
    }
    if (!formData.password || formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('http://localhost:8001/api/v1/auth/technician/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          password: formData.password,
          labVendorId: formData.labVendorId,
          labType: formData.labType,
          clinicId: null // Important: Set to null for lab technicians
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to register technician');
      }

      setSuccess('Technician registered successfully!');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register technician');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15,23,42,0.4)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div style={{
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        border: '1px solid rgba(148,163,184,0.25)',
        borderRadius: 22,
        width: 500,
        maxWidth: 'calc(100vw - 40px)',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 60px rgba(0,0,0,0.15)'
      }}>
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 24px',
          borderBottom: '1px solid rgba(148,163,184,0.18)',
          background: 'rgba(248,250,252,0.9)',
          borderRadius: '22px 22px 0 0',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: 'linear-gradient(135deg,rgba(102,126,234,0.12),rgba(118,75,162,0.1))',
              border: '1px solid rgba(102,126,234,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#667eea'
            }}>
              <UserPlus size={18} />
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: '#1e293b' }}>
                Add Technician to {vendorName}
              </div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 1 }}>
                Register a new technician for this {labType} vendor
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: '1px solid rgba(148,163,184,0.25)',
              background: 'rgba(241,245,249,0.9)',
              cursor: 'pointer',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} style={{ padding: 24 }}>
          {/* Error Message */}
          {error && (
            <div style={{
              padding: '12px 16px',
              marginBottom: 20,
              background: 'rgba(255,107,107,0.1)',
              border: '1px solid rgba(255,107,107,0.3)',
              borderRadius: 10,
              color: '#e03131',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13
            }}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div style={{
              padding: '12px 16px',
              marginBottom: 20,
              background: 'rgba(81,207,102,0.1)',
              border: '1px solid rgba(81,207,102,0.3)',
              borderRadius: 10,
              color: '#2f9e44',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13
            }}>
              <CheckCircle size={16} />
              {success}
            </div>
          )}

          {/* Form Fields */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>
              Full Name <span style={{ color: '#e03131' }}>*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter technician's full name"
              style={{
                width: '100%',
                height: 42,
                padding: '0 14px',
                background: 'rgba(248,250,252,0.95)',
                border: '1px solid rgba(148,163,184,0.25)',
                borderRadius: 10,
                fontSize: 13.5,
                color: '#1e293b',
                fontFamily: 'inherit',
                outline: 'none'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>
              Email Address <span style={{ color: '#e03131' }}>*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter email address"
              style={{
                width: '100%',
                height: 42,
                padding: '0 14px',
                background: 'rgba(248,250,252,0.95)',
                border: '1px solid rgba(148,163,184,0.25)',
                borderRadius: 10,
                fontSize: 13.5,
                color: '#1e293b',
                fontFamily: 'inherit',
                outline: 'none'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>
              Phone Number <span style={{ color: '#e03131' }}>*</span>
            </label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
              placeholder="+1234567890"
              style={{
                width: '100%',
                height: 42,
                padding: '0 14px',
                background: 'rgba(248,250,252,0.95)',
                border: '1px solid rgba(148,163,184,0.25)',
                borderRadius: 10,
                fontSize: 13.5,
                color: '#1e293b',
                fontFamily: 'inherit',
                outline: 'none'
              }}
              required
            />
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
              Format: +[country code][number] (e.g., +1234567890)
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>
              Password <span style={{ color: '#e03131' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter password (min. 8 characters)"
                style={{
                  width: '100%',
                  height: 42,
                  padding: '0 40px 0 14px',
                  background: 'rgba(248,250,252,0.95)',
                  border: '1px solid rgba(148,163,184,0.25)',
                  borderRadius: 10,
                  fontSize: 13.5,
                  color: '#1e293b',
                  fontFamily: 'inherit',
                  outline: 'none'
                }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  fontSize: 12
                }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>
              Confirm Password <span style={{ color: '#e03131' }}>*</span>
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="Confirm password"
              style={{
                width: '100%',
                height: 42,
                padding: '0 14px',
                background: 'rgba(248,250,252,0.95)',
                border: '1px solid rgba(148,163,184,0.25)',
                borderRadius: 10,
                fontSize: 13.5,
                color: '#1e293b',
                fontFamily: 'inherit',
                outline: 'none'
              }}
              required
            />
          </div>

          {/* Info Box */}
          <div style={{
            padding: '12px 16px',
            marginBottom: 20,
            background: 'rgba(102,126,234,0.08)',
            border: '1px solid rgba(102,126,234,0.2)',
            borderRadius: 10,
            fontSize: 12,
            color: '#475569'
          }}>
            <strong style={{ color: '#667eea' }}>Note:</strong> The technician will receive their login credentials via email after registration.
          </div>

          {/* Modal Footer */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 10,
            paddingTop: 16,
            borderTop: '1px solid rgba(148,163,184,0.18)'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                height: 38,
                padding: '0 18px',
                borderRadius: 10,
                border: '1px solid rgba(148,163,184,0.25)',
                background: 'rgba(248,250,252,0.9)',
                color: '#475569',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                height: 38,
                padding: '0 18px',
                borderRadius: 10,
                border: 'none',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                fontSize: 13,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                boxShadow: '0 4px 12px rgba(102,126,234,0.35)',
                opacity: loading ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              {loading && <Loader size={14} className="spin" />}
              {loading ? 'Registering...' : 'Register Technician'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ── main component ── */
const SuperAdminLabPanel: React.FC = () => {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [filteredLabs, setFilteredLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null);
  const [filters, setFilters] = useState({ status: 'all', type: 'all', subscription: 'all' });
  const [bulkSelected, setBulkSelected] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [vendorType, setVendorType] = useState<'lab' | 'aligner'>('lab');
  const [showTechnicianModal, setShowTechnicianModal] = useState(false);
  const [selectedVendorForTechnician, setSelectedVendorForTechnician] = useState<{ id: string; name: string; type: 'aligner' | 'external' } | null>(null);

  // Fetch labs from API
  const fetchLabs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8006/api/v1/lab/external-labs');
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }
      const data: ExternalVendor[] = await response.json();
      
      // Transform API data to Lab interface
      const transformedLabs = data.map(vendor => getDefaultLabValues(vendor));
      
      setLabs(transformedLabs);
      setFilteredLabs(transformedLabs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch labs');
      console.error('Error fetching labs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabs();
  }, []);

  useEffect(() => {
    let f = [...labs];
    if (searchTerm) f = f.filter(l =>
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filters.status !== 'all') f = f.filter(l => l.status === filters.status);
    if (filters.type !== 'all') f = f.filter(l => l.type === filters.type);
    if (filters.subscription !== 'all') f = f.filter(l => l.subscription.plan === filters.subscription);
    setFilteredLabs(f);
  }, [labs, searchTerm, filters]);

  const totalRevenue = labs.filter(l => l.subscription.status === 'active').reduce((s, l) => s + l.subscription.amount, 0);
  const totalTests = labs.reduce((s, l) => s + l.monthlyTests, 0);
  const avgRating = labs.length > 0 ? (labs.reduce((s, l) => s + l.performance.rating, 0) / labs.length).toFixed(1) : '0';

  const handleStatusChange = async (labId: string, newStatus: Lab['status']) => {
    // In a real app, you'd call an API to update the status
    // For now, just update local state
    setLabs(prev => prev.map(l => l.id === labId ? { ...l, status: newStatus, isActive: newStatus === 'active' } : l));
    setSelectedLab(null);
  };

  const handleBulk = (action: string) => {
    if (action === 'activate') setLabs(prev => prev.map(l => bulkSelected.includes(l.id) ? { ...l, status: 'active' as const, isActive: true } : l));
    if (action === 'suspend') setLabs(prev => prev.map(l => bulkSelected.includes(l.id) ? { ...l, status: 'suspended' as const, isActive: false } : l));
    if (action === 'delete') {
      // In production, you'd call an API to delete
      setLabs(prev => prev.filter(l => !bulkSelected.includes(l.id)));
    }
    setBulkSelected([]);
  };

  const handleAddLab = () => {
    setVendorType('lab');
    setShowAddModal(true);
  };

  const handleAddAligner = () => {
    setVendorType('aligner');
    setShowAddModal(true);
  };

  const handleAddTechnician = (lab: Lab) => {
    setSelectedVendorForTechnician({
      id: lab.id,
      name: lab.name,
      type: lab.type === 'Radiology' || lab.type === 'Pathology' ? 'external' : 'aligner'
    });
    setShowTechnicianModal(true);
  };

  const handleRefresh = () => {
    fetchLabs();
  };

  /* status styling map */
  const statusMap = {
    active:    { bg: 'rgba(81,207,102,0.12)', border: 'rgba(81,207,102,0.3)',   color: '#2f9e44', icon: <CheckCircle size={11}/> },
    pending:   { bg: 'rgba(255,212,59,0.14)', border: 'rgba(255,212,59,0.35)',  color: '#b45309', icon: <Clock size={11}/> },
    suspended: { bg: 'rgba(255,107,107,0.12)', border: 'rgba(255,107,107,0.3)', color: '#e03131', icon: <XCircle size={11}/> },
    inactive:  { bg: 'rgba(148,163,184,0.12)', border: 'rgba(148,163,184,0.2)', color: '#64748b', icon: <AlertCircle size={11}/> },
  };

  /* plan styling */
  const planMap: Record<string, { bg: string; border: string; color: string }> = {
    Enterprise:   { bg: 'rgba(102,126,234,0.12)', border: 'rgba(102,126,234,0.3)',  color: '#667eea' },
    Professional: { bg: 'rgba(118,75,162,0.1)',   border: 'rgba(118,75,162,0.25)', color: '#764ba2' },
    Basic:        { bg: 'rgba(148,163,184,0.1)',   border: 'rgba(148,163,184,0.25)', color: '#64748b' },
    Custom:       { bg: 'rgba(102,126,234,0.1)',   border: 'rgba(102,126,234,0.2)', color: '#667eea' },
  };

  /* shared css strings used inline */
  const glass = {
    background: 'rgba(255,255,255,0.75)' as const,
    backdropFilter: 'blur(20px)' as const,
    WebkitBackdropFilter: 'blur(20px)' as const,
    border: '1px solid rgba(255,255,255,0.5)' as const,
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -1px rgba(0,0,0,0.04)' as const,
  };
  const glassStrong = {
    background: 'rgba(255,255,255,0.85)' as const,
    backdropFilter: 'blur(20px)' as const,
    WebkitBackdropFilter: 'blur(20px)' as const,
    border: '1px solid rgba(148,163,184,0.2)' as const,
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -1px rgba(0,0,0,0.04)' as const,
  };
  const primaryGradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  const inputBase: React.CSSProperties = {
    background: 'rgba(248,250,252,0.95)',
    border: '1px solid rgba(148,163,184,0.25)',
    borderRadius: 10, height: 38, outline: 'none',
    color: '#1e293b', fontFamily: 'inherit', fontSize: 13,
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', fontFamily: 'ui-sans-serif, system-ui, sans-serif', color: '#1e293b' }}>

      {/* ─── HEADER ─── */}
      <header style={{ ...glassStrong, padding: '0 28px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, borderRadius: 0, borderLeft: 'none', borderRight: 'none', borderTop: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: primaryGradient, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(102,126,234,0.4)' }}>
            <Building2 size={19} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', letterSpacing: '-0.3px' }}>Lab Control Panel</div>
            <div style={{ fontSize: 11.5, color: '#94a3b8' }}>Super Admin · Full System Access</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 14px', borderRadius: 10, background: 'rgba(102,126,234,0.08)', border: '1px solid rgba(102,126,234,0.2)', fontSize: 12.5, fontWeight: 600, color: '#667eea' }}>
            <Shield size={13} /> Admin Access
          </div>
          <button onClick={handleRefresh}
            style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(248,250,252,0.9)', border: '1px solid rgba(148,163,184,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
            <RefreshCw size={14} className={loading ? 'spin' : ''} />
          </button>
        </div>
      </header>

      {/* ─── STATS ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16, padding: '24px 28px 0' }}>
        {[
          { label: 'Total Labs',       value: String(labs.length),            },
          { label: 'Active Labs',      value: String(labs.filter(l => l.status === 'active').length), icon: <Activity size={17}/>, accent: '#2f9e44', accentBg: 'rgba(81,207,102,0.1)' },
          ].map((card, i) => (
          <div key={i} style={{ ...glass, borderRadius: 18, padding: '20px 22px', position: 'relative', overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'default' }}
            onMouseEnter={e => { const d = e.currentTarget as HTMLDivElement; d.style.transform = 'translateY(-2px)'; d.style.boxShadow = '0 12px 28px rgba(0,0,0,0.1)'; }}
            onMouseLeave={e => { const d = e.currentTarget as HTMLDivElement; d.style.transform = ''; d.style.boxShadow = glass.boxShadow; }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${card.accent}90, transparent)` }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{card.label}</div>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: card.accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.accent }}>{card.icon}</div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#1e293b', lineHeight: 1, letterSpacing: '-0.5px' }}>{card.value}</div>
            {/* <div style={{ marginTop: 10, fontSize: 12, color: '#94a3b8' }}>{card.sub}</div> */}
          </div>
        ))}
      </div>

      {/* ─── MAIN ─── */}
      <div style={{ padding: '20px 28px 48px' }}>

        {/* Toolbar */}
        <div style={{ ...glassStrong, borderRadius: 16, marginBottom: 16, overflow: 'hidden' }}>

          {/* search + filters row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', flexWrap: 'wrap' as const }}>
            <div style={{ flex: 1, minWidth: 260, display: 'flex', alignItems: 'center', gap: 9, ...inputBase, padding: '0 13px' }}>
              <Search size={14} color="#94a3b8" />
              <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search labs by name, ID, or location..."
                style={{ background: 'none', border: 'none', outline: 'none', fontSize: 13.5, color: '#1e293b', width: '100%', fontFamily: 'inherit' }} />
            </div>

            <select value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })}
              style={{ ...inputBase, padding: '0 12px', cursor: 'pointer', minWidth: 120 }}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
              <option value="inactive">Inactive</option>
            </select>

            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handleAddLab} style={{ height: 38, padding: '0 16px', borderRadius: 10, border: 'none', background: primaryGradient, color: '#fff', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 12px rgba(102,126,234,0.35)' }}>
                <Plus size={14}/> Add Lab
              </button>
              <button onClick={handleAddAligner} style={{ height: 38, padding: '0 16px', borderRadius: 10, border: '1px solid rgba(102,126,234,0.3)', background: 'rgba(102,126,234,0.08)', color: '#667eea', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontFamily: 'inherit' }}>
                <Plus size={14}/> Add Aligner
              </button>
            </div>
          </div>

          {/* bulk bar */}
          {bulkSelected.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 16px', background: 'rgba(102,126,234,0.06)', borderTop: '1px solid rgba(102,126,234,0.15)', fontSize: 12.5, color: '#667eea' }}>
              <Shield size={13}/> <strong>{bulkSelected.length}</strong> selected
              {[
                { label: 'Activate', action: 'activate', icon: <UserCheck size={11}/> },
                { label: 'Suspend',  action: 'suspend',  icon: <UserX size={11}/> },
                { label: 'Delete',   action: 'delete',   icon: <Trash2 size={11}/>, danger: true },
              ].map(b => (
                <button key={b.action} onClick={() => handleBulk(b.action)} style={{ height: 26, padding: '0 10px', borderRadius: 7, background: b.danger ? 'rgba(255,107,107,0.08)' : 'rgba(102,126,234,0.08)', border: `1px solid ${b.danger ? 'rgba(255,107,107,0.3)' : 'rgba(102,126,234,0.2)'}`, color: b.danger ? '#e03131' : '#667eea', fontSize: 11.5, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 4, marginLeft: b.action === 'activate' ? 8 : 0 }}>
                  {b.icon} {b.label}
                </button>
              ))}
              <button onClick={() => setBulkSelected([])} style={{ height: 26, padding: '0 10px', borderRadius: 7, background: 'rgba(148,163,184,0.1)', border: '1px solid rgba(148,163,184,0.2)', color: '#64748b', fontSize: 11.5, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div style={{ padding: '20px', marginBottom: '16px', background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)', borderRadius: 12, color: '#e03131', display: 'flex', alignItems: 'center', gap: 10 }}>
            <AlertCircle size={20} />
            <span>Error loading labs: {error}</span>
            <button onClick={handleRefresh} style={{ marginLeft: 'auto', padding: '6px 12px', background: 'rgba(255,107,107,0.2)', border: 'none', borderRadius: 6, color: '#e03131', cursor: 'pointer' }}>Retry</button>
          </div>
        )}

        {/* Table */}
        <div style={{ ...glassStrong, borderRadius: 16, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', border: '2.5px solid rgba(148,163,184,0.2)', borderTopColor: '#667eea', animation: 'lp-spin 0.8s linear infinite' }} />
              <style>{`@keyframes lp-spin{to{transform:rotate(360deg)}}`}</style>
            </div>
          ) : (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(241,245,249,0.8)', borderBottom: '1px solid rgba(148,163,184,0.18)' }}>
                      <th style={{ padding: '11px 14px 11px 20px' }}>
                        </th>
                      {['Lab Details','Status','Contact','Staff','Actions'].map((h, hi) => (
                        <th key={h} style={{ padding: '11px 14px', fontSize: 10.5, fontWeight: 600, color: '#94a3b8', letterSpacing: '0.9px', textTransform: 'uppercase' as const, textAlign: hi === 4 ? 'right' as const : 'left' as const }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLabs.map(lab => {
                      const sc = statusMap[lab.status] || statusMap.inactive;
                      const pc = planMap[lab.subscription.plan] || planMap.Basic;
                      return (
                        <tr key={lab.id} style={{ borderBottom: '1px solid rgba(148,163,184,0.1)', transition: 'background 0.15s' }}
                          onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(241,245,249,0.6)'}
                          onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = ''}>

                          <td style={{ padding: '14px 14px 14px 20px', verticalAlign: 'middle' }}>
                           </td>

                          {/* Lab details */}
                          <td style={{ padding: '14px', verticalAlign: 'middle' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                              <div style={{
                                width: 40, height: 40, borderRadius: 11, flexShrink: 0,
                                background: lab.status === 'active' ? 'linear-gradient(135deg,rgba(102,126,234,0.12),rgba(118,75,162,0.1))' : lab.status === 'pending' ? 'rgba(255,212,59,0.12)' : 'rgba(255,107,107,0.1)',
                                border: `1px solid ${lab.status === 'active' ? 'rgba(102,126,234,0.25)' : lab.status === 'pending' ? 'rgba(255,212,59,0.3)' : 'rgba(255,107,107,0.25)'}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: lab.status === 'active' ? '#667eea' : lab.status === 'pending' ? '#b45309' : '#e03131',
                              }}>
                                <Building2 size={17}/>
                              </div>
                              <div>
                                <div style={{ fontSize: 13.5, fontWeight: 700, color: '#1e293b' }}>{lab.name}</div>
                                <div style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 1 }}>ID: {lab.id} · {lab.type}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 3, fontSize: 11, color: '#94a3b8' }}><MapPin size={9}/>{lab.city}, {lab.state}</div>
                              </div>
                            </div>
                          </td>

                          {/* Status */}
                          <td style={{ padding: '14px', verticalAlign: 'middle' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 20, background: sc.bg, border: `1px solid ${sc.border}`, color: sc.color, fontSize: 11.5, fontWeight: 600 }}>
                              {sc.icon} {lab.status.charAt(0).toUpperCase() + lab.status.slice(1)}
                            </span>
                          </td>

                          {/* Contact */}
                          <td style={{ padding: '14px', verticalAlign: 'middle' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: '#475569', marginBottom: 3 }}><Mail size={11} color="#94a3b8"/>{lab.email}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: '#475569', marginBottom: 3 }}><Phone size={11} color="#94a3b8"/>{lab.phone}</div>
                            <div style={{ fontSize: 11, color: '#94a3b8' }}>Contact: {lab.contactPerson.name}</div>
                          </td>

                          {/* Staff Count */}
                          <td style={{ padding: '14px', verticalAlign: 'middle' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <UserPlus size={14} color="#94a3b8" />
                              <span style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>{lab.totalStaff || 0}</span>
                              <span style={{ fontSize: 11, color: '#94a3b8' }}>technicians</span>
                            </div>
                          </td>

                          {/* Actions */}
                          <td style={{ padding: '14px 20px 14px 14px', verticalAlign: 'middle', textAlign: 'right' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                              {[
                                { icon: <Eye size={13}/>,         title: 'View',     onClick: () => setSelectedLab(lab), hc: '#667eea', hbg: 'rgba(102,126,234,0.1)' },
                                { icon: <UserPlus size={13}/>,    title: 'Add Technician', onClick: () => handleAddTechnician(lab), hc: '#2f9e44', hbg: 'rgba(81,207,102,0.1)' },
                                { icon: <Edit size={13}/>,        title: 'Edit',     onClick: () => console.log('Edit', lab.id), hc: '#0891b2', hbg: 'rgba(8,145,178,0.1)' },
                                { icon: <Settings size={13}/>,    title: 'Settings', onClick: () => console.log('Settings', lab.id), hc: '#475569', hbg: 'rgba(71,85,105,0.08)' },
                              ].map((btn, bi) => (
                                <button key={bi} onClick={btn.onClick} title={btn.title}
                                  style={{ width: 30, height: 30, borderRadius: 7, border: '1px solid transparent', background: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#94a3b8', transition: 'all 0.15s' }}
                                  onMouseEnter={e => { const b = e.currentTarget; b.style.color = btn.hc; b.style.background = btn.hbg; b.style.borderColor = btn.hbg; }}
                                  onMouseLeave={e => { const b = e.currentTarget; b.style.color = '#94a3b8'; b.style.background = 'none'; b.style.borderColor = 'transparent'; }}>
                                  {btn.icon}
                                </button>
                              ))}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {filteredLabs.length === 0 && !loading && (
                <div style={{ padding: '60px 0', textAlign: 'center' }}>
                  <Building2 size={40} color="#cbd5e1" style={{ margin: '0 auto 14px' }}/>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>No labs found</div>
                  <div style={{ fontSize: 13, color: '#94a3b8' }}>Try adjusting your search or filters</div>
                </div>
              )}

              {filteredLabs.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 20px', borderTop: '1px solid rgba(148,163,184,0.15)', background: 'rgba(241,245,249,0.6)', fontSize: 12.5, color: '#94a3b8' }}>
                  <div>Showing <strong style={{ color: '#1e293b' }}>1–{filteredLabs.length}</strong> of <strong style={{ color: '#1e293b' }}>{filteredLabs.length}</strong> results</div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {['‹','1','›'].map((p, i) => (
                      <button key={i} style={{ width: 32, height: 32, borderRadius: 8, border: p === '1' ? 'none' : '1px solid rgba(148,163,184,0.25)', background: p === '1' ? primaryGradient : 'rgba(255,255,255,0.8)', color: p === '1' ? '#fff' : '#475569', fontSize: 13, fontWeight: p === '1' ? 700 : 400, cursor: 'pointer', fontFamily: 'inherit', boxShadow: p === '1' ? '0 2px 8px rgba(102,126,234,0.3)' : 'none' }}>{p}</button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ─── ADD VENDOR MODAL ─── */}
      <AddVendorModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleRefresh}
        vendorType={vendorType}
      />

      {/* ─── ADD TECHNICIAN MODAL ─── */}
      {selectedVendorForTechnician && (
        <AddTechnicianModal
          isOpen={showTechnicianModal}
          onClose={() => {
            setShowTechnicianModal(false);
            setSelectedVendorForTechnician(null);
          }}
          onSuccess={handleRefresh}
          labVendorId={selectedVendorForTechnician.id}
          labType={selectedVendorForTechnician.type}
          vendorName={selectedVendorForTechnician.name}
        />
      )}

      {/* ─── VIEW DETAILS MODAL ─── */}
      {selectedLab && (
        <div onClick={e => e.target === e.currentTarget && setSelectedLab(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)', border: '1px solid rgba(148,163,184,0.25)', borderRadius: 22, width: 880, maxWidth: 'calc(100vw - 40px)', maxHeight: '88vh', overflowY: 'auto', boxShadow: '0 25px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(102,126,234,0.06)' }}>

            {/* modal header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid rgba(148,163,184,0.18)', background: 'rgba(248,250,252,0.9)', borderRadius: '22px 22px 0 0', position: 'sticky', top: 0, zIndex: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg,rgba(102,126,234,0.12),rgba(118,75,162,0.1))', border: '1px solid rgba(102,126,234,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#667eea' }}>
                  <Building2 size={18}/>
                </div>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: '#1e293b' }}>{selectedLab.name}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 1 }}>{selectedLab.id} · {selectedLab.type} · {selectedLab.licenseNumber}</div>
                </div>
              </div>
              <button onClick={() => setSelectedLab(null)} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid rgba(148,163,184,0.25)', background: 'rgba(241,245,249,0.9)', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <XCircle size={16}/>
              </button>
            </div>

            <div style={{ padding: 24 }}>
              <SectionTitle>Basic & Contact Information</SectionTitle>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 22 }}>
                <InfoCard title="Lab Details">
                  <DL items={[
                    ['Registration', selectedLab.registrationNumber], 
                    ['License', selectedLab.licenseNumber], 
                    ['Accreditation', selectedLab.accreditation.join(', ') || 'None'], 
                    ['Expiry', new Date(selectedLab.expiryDate).toLocaleDateString()],
                    ['Services', selectedLab.type]
                  ]} />
                </InfoCard>
                <InfoCard title="Contact">
                  <DL items={[
                    ['Email', selectedLab.email], 
                    ['Phone', selectedLab.phone], 
                    ['Location', `${selectedLab.address}, ${selectedLab.city}, ${selectedLab.state}`], 
                    ['Person', `${selectedLab.contactPerson.name} · ${selectedLab.contactPerson.designation}`]
                  ]} />
                </InfoCard>
              </div>

              <SectionTitle>Staff Information</SectionTitle>
              <div style={{ marginBottom: 22 }}>
                <InfoCard title="Technicians">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ fontSize: 13, color: '#475569' }}>Total Technicians:</span>
                    <span style={{ fontSize: 18, fontWeight: 700, color: '#667eea' }}>{selectedLab.totalStaff || 0}</span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedLab(null);
                      handleAddTechnician(selectedLab);
                    }}
                    style={{
                      width: '100%',
                      height: 38,
                      padding: '0 16px',
                      borderRadius: 10,
                      border: '1px solid rgba(102,126,234,0.3)',
                      background: 'rgba(102,126,234,0.08)',
                      color: '#667eea',
                      fontSize: 13,
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      cursor: 'pointer',
                      fontFamily: 'inherit'
                    }}
                  >
                    <UserPlus size={14} /> Add Technician
                  </button>
                </InfoCard>
              </div>

              <SectionTitle>Compliance Status</SectionTitle>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 22 }}>
                {(['hipaa','iso','cap','clia'] as const).map(k => {
                  const pass = selectedLab.compliance[k];
                  return (
                    <div key={k} style={{ borderRadius: 12, padding: '14px 12px', textAlign: 'center', background: pass ? 'rgba(81,207,102,0.08)' : 'rgba(255,107,107,0.08)', border: `1px solid ${pass ? 'rgba(81,207,102,0.25)' : 'rgba(255,107,107,0.25)'}` }}>
                      <Shield size={17} color={pass ? '#2f9e44' : '#e03131'} style={{ margin: '0 auto 7px' }}/>
                      <div style={{ fontSize: 14, fontWeight: 800, color: pass ? '#2f9e44' : '#e03131', letterSpacing: '0.5px' }}>{k.toUpperCase()}</div>
                      <div style={{ fontSize: 11, color: pass ? '#2f9e4470' : '#e0313170', marginTop: 3, fontWeight: 500 }}>{pass ? '✓ Compliant' : '✗ Non-compliant'}</div>
                    </div>
                  );
                })}
              </div>

              <SectionTitle>Equipment</SectionTitle>
              {selectedLab.equipment.length > 0 ? selectedLab.equipment.map((eq, i) => {
                const ec = eq.status === 'operational' ? { c: '#2f9e44', bg: 'rgba(81,207,102,0.1)', b: 'rgba(81,207,102,0.3)' } : eq.status === 'maintenance' ? { c: '#b45309', bg: 'rgba(255,212,59,0.1)', b: 'rgba(255,212,59,0.3)' } : { c: '#e03131', bg: 'rgba(255,107,107,0.1)', b: 'rgba(255,107,107,0.3)' };
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', marginBottom: 8, background: 'rgba(248,250,252,0.9)', border: '1px solid rgba(148,163,184,0.18)', borderRadius: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <HardDrive size={14} color="#94a3b8"/>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{eq.name}</div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>×{eq.count} units</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20, background: ec.bg, color: ec.c, border: `1px solid ${ec.b}` }}>{eq.status}</span>
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>Cal: {new Date(eq.lastCalibration).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              }) : (
                <div style={{ padding: '20px', textAlign: 'center', background: 'rgba(248,250,252,0.9)', border: '1px solid rgba(148,163,184,0.18)', borderRadius: 10, color: '#94a3b8' }}>
                  No equipment data available
                </div>
              )}

              <div style={{ marginTop: 20 }}><SectionTitle>Working Hours</SectionTitle></div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 22 }}>
                {selectedLab.workingHours.map((h, i) => (
                  <div key={i} style={{ background: 'rgba(248,250,252,0.9)', border: '1px solid rgba(148,163,184,0.18)', borderRadius: 10, padding: '9px 12px' }}>
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' as const, letterSpacing: '0.5px', marginBottom: 4 }}>{h.day.slice(0,3)}</div>
                    {h.closed ? <div style={{ fontSize: 12, color: '#e03131', fontWeight: 500 }}>Closed</div> : <div style={{ fontSize: 12, color: '#1e293b', fontWeight: 500 }}>{h.open} – {h.close}</div>}
                  </div>
                ))}
              </div>

              <SectionTitle>Documents</SectionTitle>
              {selectedLab.documents.length > 0 ? selectedLab.documents.map((doc, i) => {
                const dc = doc.status === 'verified' ? { c: '#2f9e44', bg: 'rgba(81,207,102,0.1)', b: 'rgba(81,207,102,0.25)' } : doc.status === 'pending' ? { c: '#b45309', bg: 'rgba(255,212,59,0.1)', b: 'rgba(255,212,59,0.3)' } : { c: '#e03131', bg: 'rgba(255,107,107,0.1)', b: 'rgba(255,107,107,0.25)' };
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', marginBottom: 8, background: 'rgba(248,250,252,0.9)', border: '1px solid rgba(148,163,184,0.18)', borderRadius: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#475569' }}><FileText size={13} color="#94a3b8"/>{doc.name}</div>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20, background: dc.bg, color: dc.c, border: `1px solid ${dc.b}` }}>{doc.status}</span>
                  </div>
                );
              }) : (
                <div style={{ padding: '20px', textAlign: 'center', background: 'rgba(248,250,252,0.9)', border: '1px solid rgba(148,163,184,0.18)', borderRadius: 10, color: '#94a3b8' }}>
                  No documents uploaded
                </div>
              )}
            </div>

            {/* modal footer */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '15px 24px', borderTop: '1px solid rgba(148,163,184,0.18)', background: 'rgba(248,250,252,0.9)', borderRadius: '0 0 22px 22px' }}>
              <button onClick={() => handleStatusChange(selectedLab.id, 'suspended')} style={{ height: 38, padding: '0 18px', borderRadius: 10, border: '1px solid rgba(255,107,107,0.3)', background: 'rgba(255,107,107,0.08)', color: '#e03131', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Suspend Lab</button>
              <button style={{ height: 38, padding: '0 18px', borderRadius: 10, border: '1px solid rgba(148,163,184,0.25)', background: 'rgba(248,250,252,0.9)', color: '#475569', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Send Message</button>
              <button onClick={() => handleStatusChange(selectedLab.id, 'active')} style={{ height: 38, padding: '0 18px', borderRadius: 10, border: 'none', background: primaryGradient, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 12px rgba(102,126,234,0.35)' }}>Activate Lab</button>
            </div>
          </div>
        </div>
      )}

      {/* Add CSS for spin animation */}
      <style>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SuperAdminLabPanel;