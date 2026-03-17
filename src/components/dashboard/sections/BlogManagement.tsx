// components/dashboard/sections/BlogManagement.tsx
import React, { useState, useEffect } from 'react';
import {
  Search,
  Eye,
  EyeOff,
  Ban,
  CheckCircle,
  RefreshCw,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ThumbsUp,
  MessageCircle,
  Calendar
} from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import BASE_URLS from '../../../inventoryUrl';
import axios from 'axios';

dayjs.extend(relativeTime);

// Types
interface Doctor {
  _id: string;
  name: string;
  email?: string;
  profilePicture?: string | null;
  specialty?: string;
}

interface Blog {
  _id: string;
  doctorId: string;
  title: string;
  content: string;
  imageUrl?: string[];
  tags?: string[];
  likesCount: number;
  commentCount: number;
  viewCount: number;
  status: 'draft' | 'published' | 'archived';
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  doctor?: Doctor;
}

interface Stats {
  total: number;
  active: number;
  blocked: number;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalBlogs: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface Filters {
  search: string;
  showBlocked: 'false' | 'true' | 'all';
  sortBy: 'createdAt' | 'likesCount' | 'viewCount' | 'commentCount';
  sortOrder: 'desc' | 'asc';
  page: number;
  limit: number;
}

const BlogManagement: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    active: 0,
    blocked: 0
  });
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalBlogs: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [filters, setFilters] = useState<Filters>({
    search: '',
    showBlocked: 'false',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 10
  });
  const [selectedBlogs, setSelectedBlogs] = useState<string[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [bulkAction, setBulkAction] = useState<'block' | 'unblock' | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [detailsBlog, setDetailsBlog] = useState<Blog | null>(null);

  // Fetch blogs
  const fetchBlogs = async (page: number = 1): Promise<void> => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: filters.limit.toString(),
        search: filters.search || '',
        showBlocked: filters.showBlocked,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      });

      const response = await fetch(`${BASE_URLS.blogBaseUrl}/api/v1/blog/admin/blogs?${params}`, {
        method: 'GET',
      });
      
      const data = await response.json();
      console.log(data);
      
      if (data.success) {
        setBlogs(data.blogs || []);
        setStats(data.stats || {
          total: 0,
          active: 0,
          blocked: 0
        });
        setPagination(data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalBlogs: 0,
          hasNextPage: false,
          hasPrevPage: false
        });
      } else {
        alert(data.message || 'Failed to fetch blogs');
      }
    } catch (error) {
      console.error('Fetch blogs error:', error);
      alert('Failed to fetch blogs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(1);
  }, [filters.search, filters.showBlocked, filters.sortBy, filters.sortOrder]);

  // Toggle blog selection
  const toggleBlogSelection = (blogId: string) => {
    setSelectedBlogs(prev => 
      prev.includes(blogId) 
        ? prev.filter(id => id !== blogId)
        : [...prev, blogId]
    );
  };

  // Select all blogs
  const toggleSelectAll = () => {
    if (selectedBlogs.length === blogs.length) {
      setSelectedBlogs([]);
    } else {
      setSelectedBlogs(blogs.map(blog => blog._id));
    }
  };

  // Toggle individual blog block status
  const toggleBlogBlock = async (blog: Blog): Promise<void> => {
    setSelectedBlog(blog);
    setShowConfirmModal(true);
  };

  // Confirm block/unblock action
  const confirmAction = async (): Promise<void> => {
    if (!selectedBlog) return;
    
    const action = selectedBlog.blocked ? 'unblock' : 'block';
    
    try {
      const response = await axios.patch(`${BASE_URLS.blogBaseUrl}/api/v1/blog/admin/toggle-block/${selectedBlog._id}`);
      
      const data = await response.data;

      if (data.success) {
        alert(data.message || `Blog ${action}ed successfully`);
        fetchBlogs(pagination.currentPage);
      } else {
        alert(data.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Toggle block error:', error);
      alert('Operation failed. Please try again.');
    } finally {
      setShowConfirmModal(false);
      setSelectedBlog(null);
    }
  };

  // Bulk action
  const handleBulkAction = async (action: 'block' | 'unblock'): Promise<void> => {
    if (selectedBlogs.length === 0) {
      alert('Please select blogs first');
      return;
    }

    setBulkAction(action);
    setShowConfirmModal(true);
  };

  // Confirm bulk action
  const confirmBulkAction = async (): Promise<void> => {
    if (!bulkAction || selectedBlogs.length === 0) return;

    try {
      const promises = selectedBlogs.map(blogId => 
        fetch(`${BASE_URLS.blogBaseUrl}/api/v1/blog/admin/toggle-block/${blogId}`, {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(res => res.json())
      );

      const results = await Promise.all(promises);
      const allSuccess = results.every(r => r.success);

      if (allSuccess) {
        alert(`${selectedBlogs.length} blog(s) ${bulkAction}ed successfully`);
        setSelectedBlogs([]);
        fetchBlogs(pagination.currentPage);
      } else {
        alert('Some operations failed. Check the blogs and try again.');
      }
    } catch (error) {
      console.error('Bulk action error:', error);
      alert('Bulk operation failed. Please try again.');
    } finally {
      setShowConfirmModal(false);
      setBulkAction(null);
    }
  };

  // View blog details
  const viewBlogDetails = async (blogId: string): Promise<void> => {
    try {
      const response = await fetch(`${BASE_URLS.blogBaseUrl}/api/v1/blog/admin/blog/${blogId}`, {
        method: 'GET',
      });
      
      const data = await response.json();

      if (data.success && data.blog) {
        setDetailsBlog(data.blog);
        setShowDetailsModal(true);
      } else {
        alert('Failed to fetch blog details');
      }
    } catch (error) {
      console.error('Fetch blog details error:', error);
      alert('Failed to fetch blog details');
    }
  };

  // Styles
  const styles = {
    container: {
      padding: '24px',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    header: {
      marginBottom: '24px'
    },
    headerTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: 'black',
      marginBottom: '4px'
    },
    headerSubtitle: {
      color: 'rgba(34, 33, 33, 0.8)',
      fontSize: '14px'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '24px',
      marginBottom: '24px'
    },
    statCard: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
    },
    statContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    statLabel: {
      fontSize: '14px',
      color: '#666',
      marginBottom: '8px'
    },
    statValue: {
      fontSize: '32px',
      fontWeight: 'bold'
    },
    statIcon: {
      padding: '12px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    filtersCard: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      padding: '16px',
      marginBottom: '24px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
    },
    filtersRow: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: '16px',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    filtersGroup: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: '16px',
      flex: '1'
    },
    searchWrapper: {
      position: 'relative' as const,
      flex: '1',
      minWidth: '200px'
    },
    searchIcon: {
      position: 'absolute' as const,
      left: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#999'
    },
    searchInput: {
      width: '100%',
      padding: '10px 10px 10px 40px',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      fontSize: '14px',
      outline: 'none',
      transition: 'border-color 0.2s'
    },
    select: {
      padding: '10px 16px',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      fontSize: '14px',
      backgroundColor: 'white',
      cursor: 'pointer',
      outline: 'none',
      minWidth: '140px'
    },
    refreshButton: {
      padding: '8px',
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      color: '#666',
      borderRadius: '8px',
      transition: 'background-color 0.2s'
    },
    bulkActions: {
      marginTop: '16px',
      paddingTop: '16px',
      borderTop: '1px solid #e0e0e0',
      display: 'flex',
      gap: '12px'
    },
    bulkButton: {
      padding: '10px 16px',
      border: 'none',
      borderRadius: '8px',
      color: 'white',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'opacity 0.2s'
    },
    tableContainer: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse' as const
    },
    tableHead: {
      background: '#f8f9fa'
    },
    tableHeaderCell: {
      padding: '16px 24px',
      textAlign: 'left' as const,
      fontSize: '12px',
      fontWeight: '600',
      color: '#666',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.5px'
    },
    tableRow: {
      borderBottom: '1px solid #e0e0e0',
      transition: 'background-color 0.2s',
      cursor: 'pointer'
    },
    tableCell: {
      padding: '16px 24px'
    },
    checkbox: {
      width: '18px',
      height: '18px',
      cursor: 'pointer',
      accentColor: '#667eea'
    },
    tag: {
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '11px',
      fontWeight: '500',
      background: '#667eea',
      color: 'white',
      marginRight: '4px'
    },
    tagMore: {
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '11px',
      fontWeight: '500',
      background: '#f0f0f0',
      color: '#666'
    },
    authorAvatar: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      background: '#f0f0f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      fontWeight: '500',
      color: '#666'
    },
    statsGroup: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px'
    },
    statItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      fontSize: '14px',
      color: '#666'
    },
    statusBadge: (blocked: boolean) => ({
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      background: blocked ? '#ffebee' : '#e8f5e9',
      color: blocked ? '#f44336' : '#4caf50',
      display: 'inline-block'
    }),
    actionButton: {
      padding: '6px',
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      borderRadius: '4px',
      transition: 'background-color 0.2s',
      color: '#666'
    },
    pagination: {
      padding: '16px 24px',
      borderTop: '1px solid #e0e0e0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    paginationInfo: {
      fontSize: '14px',
      color: '#666'
    },
    paginationControls: {
      display: 'flex',
      gap: '8px'
    },
    paginationButton: {
      padding: '8px',
      border: '1px solid #e0e0e0',
      background: 'white',
      borderRadius: '6px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s',
      color: '#666'
    },
    paginationButtonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed'
    },
    paginationText: {
      padding: '8px 16px',
      fontSize: '14px',
      color: '#333'
    },
    modalOverlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    modalContent: {
      background: 'white',
      borderRadius: '16px',
      padding: '24px',
      maxWidth: '500px',
      width: '90%',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
    },
    modalHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '16px'
    },
    modalTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#333'
    },
    modalText: {
      color: '#666',
      marginBottom: '24px',
      lineHeight: '1.5'
    },
    modalFooter: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '12px'
    },
    modalButton: {
      padding: '10px 20px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'opacity 0.2s'
    },
    modalButtonCancel: {
      background: '#f0f0f0',
      color: '#666'
    },
    modalButtonConfirm: (isDanger: boolean) => ({
      background: isDanger ? '#f44336' : '#4caf50',
      color: 'white'
    }),
    detailsModal: {
      maxWidth: '800px',
      maxHeight: '90vh',
      overflowY: 'auto' as const
    },
    detailsSection: {
      marginBottom: '16px'
    },
    detailsLabel: {
      fontSize: '13px',
      fontWeight: '500',
      color: '#999',
      marginBottom: '4px'
    },
    detailsValue: {
      fontSize: '15px',
      color: '#333'
    },
    detailsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '16px'
    },
    detailsStatsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '16px'
    },
    detailsTags: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap' as const
    },
    detailsTag: {
      padding: '6px 12px',
      background: '#667eea',
      color: 'white',
      borderRadius: '20px',
      fontSize: '13px'
    },
    detailsContent: {
      background: '#f8f9fa',
      padding: '16px',
      borderRadius: '8px',
      maxHeight: '240px',
      overflowY: 'auto' as const,
      lineHeight: '1.6',
      fontSize: '14px'
    },
    detailsImages: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '8px',
      marginTop: '8px'
    },
    detailsImage: {
      width: '100%',
      height: '96px',
      objectFit: 'cover' as const,
      borderRadius: '8px'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Blog Management</h1>
        <p style={styles.headerSubtitle}>Manage and moderate all blog posts</p>
      </div>

      {/* Statistics Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statContent}>
            <div>
              <p style={styles.statLabel}>Total Blogs</p>
              <p style={{...styles.statValue, color: '#667eea'}}>{stats.total}</p>
            </div>
            <div style={{...styles.statIcon, background: '#e8eaf6'}}>
              <Calendar size={24} color="#667eea" />
            </div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statContent}>
            <div>
              <p style={styles.statLabel}>Active Blogs</p>
              <p style={{...styles.statValue, color: '#4caf50'}}>{stats.active}</p>
            </div>
            <div style={{...styles.statIcon, background: '#e8f5e9'}}>
              <CheckCircle size={24} color="#4caf50" />
            </div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statContent}>
            <div>
              <p style={styles.statLabel}>Blocked Blogs</p>
              <p style={{...styles.statValue, color: '#f44336'}}>{stats.blocked}</p>
            </div>
            <div style={{...styles.statIcon, background: '#ffebee'}}>
              <Ban size={24} color="#f44336" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div style={styles.filtersCard}>
        <div style={styles.filtersRow}>
          <div style={styles.filtersGroup}>
            {/* Search */}
            <div style={styles.searchWrapper}>
              <Search style={styles.searchIcon} size={16} />
              <input
                type="text"
                placeholder="Search blogs..."
                style={styles.searchInput}
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
              />
            </div>

            {/* Status Filter */}
            <select
              style={styles.select}
              value={filters.showBlocked}
              onChange={(e) => setFilters({ 
                ...filters, 
                showBlocked: e.target.value as Filters['showBlocked'],
                page: 1 
              })}
            >
              <option value="false">Active Only</option>
              <option value="true">Blocked Only</option>
              <option value="all">All Blogs</option>
            </select>

            {/* Sort By */}
            <select
              style={styles.select}
              value={filters.sortBy}
              onChange={(e) => setFilters({ 
                ...filters, 
                sortBy: e.target.value as Filters['sortBy'],
                page: 1 
              })}
            >
              <option value="createdAt">Date</option>
              <option value="likesCount">Likes</option>
              <option value="viewCount">Views</option>
              <option value="commentCount">Comments</option>
            </select>

            {/* Sort Order */}
            <select
              style={styles.select}
              value={filters.sortOrder}
              onChange={(e) => setFilters({ 
                ...filters, 
                sortOrder: e.target.value as Filters['sortOrder'],
                page: 1 
              })}
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => fetchBlogs(pagination.currentPage)}
            style={styles.refreshButton}
            disabled={loading}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Bulk Actions */}
        {selectedBlogs.length > 0 && (
          <div style={styles.bulkActions}>
            <button
              onClick={() => handleBulkAction('block')}
              style={{...styles.bulkButton, background: '#f44336'}}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              <Ban size={16} />
              Block ({selectedBlogs.length})
            </button>
            <button
              onClick={() => handleBulkAction('unblock')}
              style={{...styles.bulkButton, background: '#4caf50'}}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              <CheckCircle size={16} />
              Unblock ({selectedBlogs.length})
            </button>
          </div>
        )}
      </div>

      {/* Blog Table */}
      <div style={styles.tableContainer}>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead style={styles.tableHead}>
              <tr>
                
                <th style={styles.tableHeaderCell}>Blog</th>
                <th style={styles.tableHeaderCell}>Author</th>
                <th style={{...styles.tableHeaderCell, textAlign: 'center'}}>Stats</th>
                <th style={{...styles.tableHeaderCell, textAlign: 'center'}}>Status</th>
                <th style={styles.tableHeaderCell}>Created</th>
                <th style={{...styles.tableHeaderCell, textAlign: 'center'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ padding: '48px 24px', textAlign: 'center', color: '#666' }}>
                    <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 8px' }} />
                    Loading blogs...
                  </td>
                </tr>
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '48px 24px', textAlign: 'center', color: '#666' }}>
                    No blogs found
                  </td>
                </tr>
              ) : (
                blogs.map((blog) => (
                  <tr 
                    key={blog._id} 
                    style={styles.tableRow}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    
                    <td style={styles.tableCell}>
                      <div>
                        <div style={{ 
                          fontWeight: '500', 
                          color: blog.blocked ? '#999' : '#333',
                          textDecoration: blog.blocked ? 'line-through' : 'none'
                        }}>
                          {blog.title}
                        </div>
                        <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                          {blog.tags?.slice(0, 3).map(tag => (
                            <span key={tag} style={styles.tag}>
                              {tag}
                            </span>
                          ))}
                          {blog.tags && blog.tags.length > 3 && (
                            <span style={styles.tagMore}>
                              +{blog.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={styles.tableCell}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={styles.authorAvatar}>
                          {blog.doctor?.name?.charAt(0) || 'D'}
                        </div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>
                            {blog.doctor?.name || 'Unknown'}
                          </div>
                          <div style={{ fontSize: '12px', color: '#999' }}>
                            {blog.doctor?.specialty || 'General'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={styles.tableCell}>
                      <div style={styles.statsGroup}>
                        <div style={styles.statItem} title="Views">
                          <Eye size={14} color="#999" />
                          <span>{blog.viewCount || 0}</span>
                        </div>
                        <div style={styles.statItem} title="Likes">
                          <ThumbsUp size={14} color="#999" />
                          <span>{blog.likesCount || 0}</span>
                        </div>
                        <div style={styles.statItem} title="Comments">
                          <MessageCircle size={14} color="#999" />
                          <span>{blog.commentCount || 0}</span>
                        </div>
                      </div>
                    </td>
                    <td style={styles.tableCell}>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <span style={styles.statusBadge(blog.blocked)}>
                          {blog.blocked ? 'BLOCKED' : 'ACTIVE'}
                        </span>
                      </div>
                    </td>
                    <td style={styles.tableCell}>
                      <div style={{ fontSize: '14px', color: '#999' }} title={dayjs(blog.createdAt).format('YYYY-MM-DD HH:mm')}>
                        {dayjs(blog.createdAt).fromNow()}
                      </div>
                    </td>
                    <td style={styles.tableCell}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <button
                          onClick={() => viewBlogDetails(blog._id)}
                          style={styles.actionButton}
                          title="View Details"
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <Eye size={16} />
                        </button>
                        
                        <button
                          onClick={() => toggleBlogBlock(blog)}
                          style={{...styles.actionButton, color: blog.blocked ? '#4caf50' : '#f44336'}}
                          title={blog.blocked ? 'Unblock' : 'Block'}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          {blog.blocked ? (
                            <CheckCircle size={16} />
                          ) : (
                            <Ban size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={styles.pagination}>
          <div style={styles.paginationInfo}>
            Showing {((pagination.currentPage - 1) * filters.limit) + 1} to{' '}
            {Math.min(pagination.currentPage * filters.limit, pagination.totalBlogs)} of{' '}
            {pagination.totalBlogs} blogs
          </div>
          <div style={styles.paginationControls}>
            <button
              onClick={() => fetchBlogs(1)}
              disabled={pagination.currentPage === 1}
              style={{
                ...styles.paginationButton,
                ...(pagination.currentPage === 1 ? styles.paginationButtonDisabled : {})
              }}
              onMouseEnter={(e) => {
                if (pagination.currentPage !== 1) {
                  e.currentTarget.style.backgroundColor = '#f0f0f0';
                  e.currentTarget.style.borderColor = '#999';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.borderColor = '#e0e0e0';
              }}
            >
              <ChevronsLeft size={18} />
            </button>
            <button
              onClick={() => fetchBlogs(pagination.currentPage - 1)}
              disabled={!pagination.hasPrevPage}
              style={{
                ...styles.paginationButton,
                ...(!pagination.hasPrevPage ? styles.paginationButtonDisabled : {})
              }}
              onMouseEnter={(e) => {
                if (pagination.hasPrevPage) {
                  e.currentTarget.style.backgroundColor = '#f0f0f0';
                  e.currentTarget.style.borderColor = '#999';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.borderColor = '#e0e0e0';
              }}
            >
              <ChevronLeft size={18} />
            </button>
            <span style={styles.paginationText}>
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() => fetchBlogs(pagination.currentPage + 1)}
              disabled={!pagination.hasNextPage}
              style={{
                ...styles.paginationButton,
                ...(!pagination.hasNextPage ? styles.paginationButtonDisabled : {})
              }}
              onMouseEnter={(e) => {
                if (pagination.hasNextPage) {
                  e.currentTarget.style.backgroundColor = '#f0f0f0';
                  e.currentTarget.style.borderColor = '#999';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.borderColor = '#e0e0e0';
              }}
            >
              <ChevronRight size={18} />
            </button>
            <button
              onClick={() => fetchBlogs(pagination.totalPages)}
              disabled={pagination.currentPage === pagination.totalPages}
              style={{
                ...styles.paginationButton,
                ...(pagination.currentPage === pagination.totalPages ? styles.paginationButtonDisabled : {})
              }}
              onMouseEnter={(e) => {
                if (pagination.currentPage !== pagination.totalPages) {
                  e.currentTarget.style.backgroundColor = '#f0f0f0';
                  e.currentTarget.style.borderColor = '#999';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.borderColor = '#e0e0e0';
              }}
            >
              <ChevronsRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <AlertTriangle 
                size={24} 
                color={
                  selectedBlog?.blocked || bulkAction === 'unblock' 
                    ? '#4caf50' 
                    : '#f44336'
                } 
              />
              <h3 style={styles.modalTitle}>
                {bulkAction 
                  ? `Bulk ${bulkAction === 'block' ? 'Block' : 'Unblock'} Blogs`
                  : `${selectedBlog?.blocked ? 'Unblock' : 'Block'} Blog`
                }
              </h3>
            </div>
            <p style={styles.modalText}>
              {bulkAction 
                ? `Are you sure you want to ${bulkAction} ${selectedBlogs.length} selected blog(s)?`
                : `Are you sure you want to ${selectedBlog?.blocked ? 'unblock' : 'block'} "${selectedBlog?.title}"?`
              }
            </p>
            <div style={styles.modalFooter}>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setSelectedBlog(null);
                  setBulkAction(null);
                }}
                style={{...styles.modalButton, ...styles.modalButtonCancel}}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                Cancel
              </button>
              <button
                onClick={bulkAction ? confirmBulkAction : confirmAction}
                style={{
                  ...styles.modalButton,
                  ...styles.modalButtonConfirm(
                    !(selectedBlog?.blocked || bulkAction === 'unblock')
                  )
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Blog Details Modal */}
      {showDetailsModal && detailsBlog && (
        <div style={styles.modalOverlay}>
          <div style={{...styles.modalContent, ...styles.detailsModal}}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={styles.modalTitle}>Blog Details</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                style={{ ...styles.actionButton, fontSize: '20px' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                ✕
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Title */}
              <div style={styles.detailsSection}>
                <div style={styles.detailsLabel}>Title</div>
                <div style={styles.detailsValue}>{detailsBlog.title}</div>
              </div>

              {/* Author and Specialty */}
              <div style={styles.detailsGrid}>
                <div>
                  <div style={styles.detailsLabel}>Author</div>
                  <div style={styles.detailsValue}>{detailsBlog.doctor?.name || 'Unknown'}</div>
                </div>
                <div>
                  <div style={styles.detailsLabel}>Specialty</div>
                  <div style={styles.detailsValue}>{detailsBlog.doctor?.specialty || 'General'}</div>
                </div>
              </div>

              {/* Stats */}
              <div style={styles.detailsStatsGrid}>
                <div>
                  <div style={styles.detailsLabel}>Status</div>
                  <div style={{ ...styles.detailsValue, color: detailsBlog.blocked ? '#f44336' : '#4caf50', fontWeight: '500' }}>
                    {detailsBlog.blocked ? 'Blocked' : 'Active'}
                  </div>
                </div>
                <div>
                  <div style={styles.detailsLabel}>Views</div>
                  <div style={styles.detailsValue}>{detailsBlog.viewCount || 0}</div>
                </div>
                <div>
                  <div style={styles.detailsLabel}>Likes</div>
                  <div style={styles.detailsValue}>{detailsBlog.likesCount || 0}</div>
                </div>
              </div>

              {/* Created Date */}
              <div style={styles.detailsSection}>
                <div style={styles.detailsLabel}>Created</div>
                <div style={styles.detailsValue}>
                  {dayjs(detailsBlog.createdAt).format('YYYY-MM-DD HH:mm')}
                </div>
              </div>

              {/* Tags */}
              {detailsBlog.tags && detailsBlog.tags.length > 0 && (
                <div style={styles.detailsSection}>
                  <div style={styles.detailsLabel}>Tags</div>
                  <div style={styles.detailsTags}>
                    {detailsBlog.tags.map(tag => (
                      <span key={tag} style={styles.detailsTag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Content */}
              <div style={styles.detailsSection}>
                <div style={styles.detailsLabel}>Content</div>
                <div style={styles.detailsContent}>
                  {detailsBlog.content}
                </div>
              </div>

              {/* Images */}
              {detailsBlog.imageUrl && detailsBlog.imageUrl.length > 0 && (
                <div style={styles.detailsSection}>
                  <div style={styles.detailsLabel}>Images</div>
                  <div style={styles.detailsImages}>
                    {detailsBlog.imageUrl.map((url, index) => (
                      <img
                        key={index}
                        src={`${BASE_URLS.blogBaseUrl}${url}`}
                        alt={`Blog image ${index + 1}`}
                        style={styles.detailsImage}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowDetailsModal(false)}
                style={{
                  padding: '10px 24px',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManagement;