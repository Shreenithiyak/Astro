import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  getAllEnquiries, updateEnquiry, deleteEnquiry, getEnquiryStats,
  getAllProjects, createProject, updateProject, deleteProject, seedProjects
} from '../api';

const STATUS_OPTIONS = ['New', 'Contacted', 'Site Visit Scheduled', 'Converted', 'Not Interested'];
const PROJECT_TYPES = ['Luxury', 'Apartments', 'Plots', 'Villas', 'Commercial'];
const PROJECT_STATUS = ['Ongoing', 'Completed', 'Upcoming'];

function EnquiryModal({ enquiry, onClose, onSave }) {
  const [data, setData] = useState({ ...enquiry });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const res = await updateEnquiry(enquiry._id, data);
      if (res.data.success) onSave(res.data.data);
    } catch (err) {
      alert('Update failed: ' + (err.response?.data?.message || err.message));
    }
    setSaving(false);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h3>Edit Enquiry</h3>
        <div className="form-row">
          <div className="f-group">
            <label className="f-label">Full Name</label>
            <input className="f-input" value={data.fullName} onChange={e => setData({ ...data, fullName: e.target.value })} />
          </div>
          <div className="f-group">
            <label className="f-label">Phone</label>
            <input className="f-input" value={data.phone} onChange={e => setData({ ...data, phone: e.target.value })} />
          </div>
        </div>
        <div className="f-group">
          <label className="f-label">Email</label>
          <input className="f-input" value={data.email} onChange={e => setData({ ...data, email: e.target.value })} />
        </div>
        <div className="f-group">
          <label className="f-label">Status</label>
          <select className="f-select" style={{ width: '100%' }} value={data.status} onChange={e => setData({ ...data, status: e.target.value })}>
            {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="f-group">
          <label className="f-label">Interested Project</label>
          <select className="f-select" style={{ width: '100%' }} value={data.interestedProject} onChange={e => setData({ ...data, interestedProject: e.target.value })}>
            {['Voora One Sea — ECR (₹7,199/sqft)', 'Voora Westside — Ramapuram (From ₹1 Cr)', 'Voora Agastya — Tondiarpet (From ₹2.3 Cr)', 'Voora Beckford — Nungambakkam', 'Voora Highway Haven — Kanchipuram Plots', 'Other / Not sure'].map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div className="f-group">
          <label className="f-label">Message</label>
          <textarea className="f-area" style={{ minHeight: 80 }} value={data.message || ''} onChange={e => setData({ ...data, message: e.target.value })} />
        </div>
        <div className="f-group">
          <label className="f-label">Admin Notes</label>
          <textarea className="f-area" style={{ minHeight: 80 }} placeholder="Internal notes..." value={data.notes || ''} onChange={e => setData({ ...data, notes: e.target.value })} />
        </div>
        <div className="modal-actions">
          <button className="action-btn" onClick={onClose}>Cancel</button>
          <button className="submit-btn" style={{ padding: '10px 32px', width: 'auto' }} onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </div>
    </div>
  );
}

function ProjectModal({ project, onClose, onSave }) {
  const empty = { name: '', type: 'Luxury', location: '', area: '', price: '', description: '', tags: '', status: 'Ongoing', bhkOptions: '', rera: '', featured: false };
  const [data, setData] = useState(project ? {
    ...project,
    tags: project.tags?.join(', ') || '',
    bhkOptions: project.bhkOptions?.join(', ') || ''
  } : empty);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!data.name || !data.location || !data.price) { alert('Please fill Name, Location and Price'); return; }
    setSaving(true);
    const payload = {
      ...data,
      tags: data.tags.split(',').map(t => t.trim()).filter(Boolean),
      bhkOptions: data.bhkOptions.split(',').map(t => t.trim()).filter(Boolean)
    };
    try {
      const res = project
        ? await updateProject(project._id, payload)
        : await createProject(payload);
      if (res.data.success) onSave(res.data.data, !project);
    } catch (err) {
      alert('Save failed: ' + (err.response?.data?.message || err.message));
    }
    setSaving(false);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h3>{project ? 'Edit Project' : 'Add New Project'}</h3>
        <div className="form-row">
          <div className="f-group">
            <label className="f-label">Project Name *</label>
            <input className="f-input" value={data.name} onChange={e => setData({ ...data, name: e.target.value })} />
          </div>
          <div className="f-group">
            <label className="f-label">Type *</label>
            <select className="f-select" style={{ width: '100%' }} value={data.type} onChange={e => setData({ ...data, type: e.target.value })}>
              {PROJECT_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="f-group">
            <label className="f-label">Location *</label>
            <input className="f-input" value={data.location} onChange={e => setData({ ...data, location: e.target.value })} />
          </div>
          <div className="f-group">
            <label className="f-label">Price *</label>
            <input className="f-input" placeholder="e.g. ₹7,199/sqft" value={data.price} onChange={e => setData({ ...data, price: e.target.value })} />
          </div>
        </div>
        <div className="form-row">
          <div className="f-group">
            <label className="f-label">Status</label>
            <select className="f-select" style={{ width: '100%' }} value={data.status} onChange={e => setData({ ...data, status: e.target.value })}>
              {PROJECT_STATUS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="f-group">
            <label className="f-label">RERA Number</label>
            <input className="f-input" value={data.rera || ''} onChange={e => setData({ ...data, rera: e.target.value })} />
          </div>
        </div>
        <div className="f-group">
          <label className="f-label">Tags (comma separated)</label>
          <input className="f-input" placeholder="e.g. Sea View, 3 BHK, RERA" value={data.tags} onChange={e => setData({ ...data, tags: e.target.value })} />
        </div>
        <div className="f-group">
          <label className="f-label">BHK Options (comma separated)</label>
          <input className="f-input" placeholder="e.g. 2 BHK, 3 BHK, 4 BHK" value={data.bhkOptions} onChange={e => setData({ ...data, bhkOptions: e.target.value })} />
        </div>
        <div className="f-group">
          <label className="f-label">Description</label>
          <textarea className="f-area" style={{ minHeight: 80 }} value={data.description || ''} onChange={e => setData({ ...data, description: e.target.value })} />
        </div>
        <div className="f-group" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <input type="checkbox" id="featured" checked={data.featured} onChange={e => setData({ ...data, featured: e.target.checked })} />
          <label htmlFor="featured" className="f-label" style={{ margin: 0 }}>Featured Project</label>
        </div>
        <div className="modal-actions">
          <button className="action-btn" onClick={onClose}>Cancel</button>
          <button className="submit-btn" style={{ padding: '10px 32px', width: 'auto' }} onClick={save} disabled={saving}>{saving ? 'Saving...' : project ? 'Save Changes' : 'Create Project'}</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [tab, setTab] = useState('enquiries');
  const [enquiries, setEnquiries] = useState([]);
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [editEnquiry, setEditEnquiry] = useState(null);
  const [editProject, setEditProject] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadEnquiries = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const res = await getAllEnquiries(params);
      setEnquiries(res.data.data);
      setPagination(res.data.pagination);
    } catch { showToast('Failed to load enquiries', 'error'); }
    setLoading(false);
  }, [page, search, statusFilter]);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllProjects();
      setProjects(res.data.data);
    } catch { showToast('Failed to load projects', 'error'); }
    setLoading(false);
  }, []);

  const loadStats = async () => {
    try {
      const res = await getEnquiryStats();
      setStats(res.data.data);
    } catch { }
  };

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    if (tab === 'enquiries') loadEnquiries();
    else if (tab === 'projects') loadProjects();
  }, [tab, loadEnquiries, loadProjects]);

  const handleDeleteEnquiry = async (id) => {
    if (!window.confirm('Delete this enquiry?')) return;
    try {
      await deleteEnquiry(id);
      setEnquiries(prev => prev.filter(e => e._id !== id));
      showToast('Enquiry deleted');
      loadStats();
    } catch { showToast('Delete failed', 'error'); }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await deleteProject(id);
      setProjects(prev => prev.filter(p => p._id !== id));
      showToast('Project deleted');
    } catch { showToast('Delete failed', 'error'); }
  };

  const handleSeedProjects = async () => {
    try {
      const res = await seedProjects();
      showToast(res.data.message);
      loadProjects();
    } catch { showToast('Seed failed', 'error'); }
  };

  const getStatusClass = (status) => {
    const map = { 'New': 'New', 'Contacted': 'Contacted', 'Site Visit Scheduled': 'Site', 'Converted': 'Converted', 'Not Interested': 'Not' };
    return `status-badge status-${map[status] || 'New'}`;
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="admin-page">
      <nav className="admin-nav">
        <div className="admin-title">VOORA · Admin Panel</div>
        <Link to="/" className="admin-back">← Back to Site</Link>
      </nav>

      <div className="admin-body">
        {/* STATS */}
        {stats && (
          <div className="stats-grid">
            {[
              [stats.total, 'Total Enquiries'],
              [stats.new, 'New Leads'],
              [stats.siteVisit, 'Site Visits'],
              [stats.converted, 'Converted']
            ].map(([n, l]) => (
              <div key={l} className="stat-card">
                <div className="stat-card-num">{n}</div>
                <div className="stat-card-label">{l}</div>
              </div>
            ))}
          </div>
        )}

        {/* TABS */}
        <div className="admin-tabs">
          <button className={`admin-tab${tab === 'enquiries' ? ' active' : ''}`} onClick={() => setTab('enquiries')}>Enquiries</button>
          <button className={`admin-tab${tab === 'projects' ? ' active' : ''}`} onClick={() => setTab('projects')}>Projects</button>
        </div>

        {/* ENQUIRIES TAB */}
        {tab === 'enquiries' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
              <input
                className="search-bar"
                style={{ marginBottom: 0 }}
                placeholder="Search by name, email or phone..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
              />
              <select className="filter-select" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
                <option value="">All Status</option>
                {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            {loading ? (
              <div className="loading">Loading enquiries...</div>
            ) : enquiries.length === 0 ? (
              <div className="empty-state">No enquiries found</div>
            ) : (
              <>
                <div style={{ overflowX: 'auto' }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Contact</th>
                        <th>Project</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enquiries.map(e => (
                        <tr key={e._id}>
                          <td style={{ color: 'var(--ivory)' }}>{e.fullName}</td>
                          <td>
                            <div>{e.phone}</div>
                            <div style={{ fontSize: 9, color: 'rgba(247,243,238,.4)', marginTop: 3 }}>{e.email}</div>
                          </td>
                          <td style={{ maxWidth: 180, fontSize: 9, color: 'rgba(247,243,238,.5)' }}>{e.interestedProject}</td>
                          <td><span className={getStatusClass(e.status)}>{e.status}</span></td>
                          <td style={{ fontSize: 9 }}>{formatDate(e.createdAt)}</td>
                          <td>
                            <button className="action-btn" onClick={() => setEditEnquiry(e)}>Edit</button>
                            <button className="action-btn danger" onClick={() => handleDeleteEnquiry(e._id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {pagination && pagination.pages > 1 && (
                  <div style={{ display: 'flex', gap: 8, marginTop: 24, justifyContent: 'center' }}>
                    {Array.from({ length: pagination.pages }, (_, i) => (
                      <button
                        key={i}
                        className="action-btn"
                        style={page === i + 1 ? { borderColor: 'var(--gold)', color: 'var(--gold)' } : {}}
                        onClick={() => setPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* PROJECTS TAB */}
        {tab === 'projects' && (
          <>
            <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
              <button className="submit-btn" style={{ padding: '12px 28px', width: 'auto' }} onClick={() => setShowProjectModal(true)}>
                + Add New Project
              </button>
              {projects.length === 0 && (
                <button className="action-btn" onClick={handleSeedProjects}>Seed Default Projects</button>
              )}
            </div>

            {loading ? (
              <div className="loading">Loading projects...</div>
            ) : projects.length === 0 ? (
              <div className="empty-state">No projects found. Click "Seed Default Projects" to add defaults.</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Project Name</th>
                      <th>Type</th>
                      <th>Location</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Featured</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map(p => (
                      <tr key={p._id}>
                        <td style={{ color: 'var(--ivory)', fontFamily: 'Cormorant Garamond, serif', fontSize: 16 }}>{p.name}</td>
                        <td style={{ fontSize: 9 }}>{p.type}</td>
                        <td style={{ fontSize: 9, color: 'rgba(247,243,238,.5)' }}>{p.location}</td>
                        <td style={{ color: 'var(--gold)', fontSize: 10 }}>{p.price}</td>
                        <td><span className={`status-badge status-${p.status === 'Ongoing' ? 'New' : p.status === 'Completed' ? 'Converted' : 'Contacted'}`}>{p.status}</span></td>
                        <td style={{ color: p.featured ? 'var(--gold)' : 'rgba(247,243,238,.25)', fontSize: 12 }}>{p.featured ? '★' : '☆'}</td>
                        <td>
                          <button className="action-btn" onClick={() => setEditProject(p)}>Edit</button>
                          <button className="action-btn danger" onClick={() => handleDeleteProject(p._id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* MODALS */}
      {editEnquiry && (
        <EnquiryModal
          enquiry={editEnquiry}
          onClose={() => setEditEnquiry(null)}
          onSave={(updated) => {
            setEnquiries(prev => prev.map(e => e._id === updated._id ? updated : e));
            setEditEnquiry(null);
            showToast('Enquiry updated successfully');
            loadStats();
          }}
        />
      )}

      {(showProjectModal || editProject) && (
        <ProjectModal
          project={editProject}
          onClose={() => { setShowProjectModal(false); setEditProject(null); }}
          onSave={(saved, isNew) => {
            if (isNew) setProjects(prev => [saved, ...prev]);
            else setProjects(prev => prev.map(p => p._id === saved._id ? saved : p));
            setShowProjectModal(false);
            setEditProject(null);
            showToast(isNew ? 'Project created!' : 'Project updated!');
          }}
        />
      )}

      {toast && <div className={`toast${toast.type === 'error' ? ' error' : ''}`}>{toast.msg}</div>}
    </div>
  );
}
