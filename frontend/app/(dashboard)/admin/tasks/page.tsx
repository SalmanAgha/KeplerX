'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  AlertCircle, 
  Trash2, 
  Edit3, 
  User, 
  Tag, 
  X, 
  Clock,
  ListTodo,
  CheckSquare,
  AlertTriangle
} from 'lucide-react';
import { taskService, userService } from '@/services/api';
import toast from 'react-hot-toast';

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: string | null;
  tags: string[];
  order: number;
  createdAt: string;
  updatedAt: string;
  assignedToId: string | null;
  assignedTo: {
    id: string;
    name: string | null;
    email: string;
    avatar: string | null;
  } | null;
}

const COLUMNS = [
  { id: 'TODO', title: 'To Do', color: '#6b7280', bg: 'rgba(107, 114, 128, 0.05)', border: 'rgba(107, 114, 128, 0.2)' },
  { id: 'IN_PROGRESS', title: 'In Progress', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.05)', border: 'rgba(59, 130, 246, 0.2)' },
  { id: 'IN_REVIEW', title: 'In Review', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.05)', border: 'rgba(168, 85, 247, 0.2)' },
  { id: 'DONE', title: 'Done', color: '#10b981', bg: 'rgba(16, 185, 129, 0.05)', border: 'rgba(16, 185, 129, 0.2)' }
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [userFilter, setUserFilter] = useState('ALL');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('TODO');
  const [priority, setPriority] = useState('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [assignedToId, setAssignedToId] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [tasksRes, usersRes] = await Promise.all([
        taskService.getTasks(),
        userService.getAllUsers()
      ]);
      if (tasksRes && tasksRes.data) setTasks(tasksRes.data);
      if (usersRes && usersRes.data) setUsers(usersRes.data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load task board');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Reset form when modal closes or opens
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStatus('TODO');
    setPriority('MEDIUM');
    setDueDate('');
    setAssignedToId('');
    setTagsInput('');
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description || '');
    setStatus(task.status);
    setPriority(task.priority);
    setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
    setAssignedToId(task.assignedToId || '');
    setTagsInput(task.tags.join(', '));
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return toast.error('Task title is required');

    const parsedTags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    try {
      const res = await taskService.createTask({
        title,
        description,
        status,
        priority,
        dueDate: dueDate || null,
        tags: parsedTags,
        assignedToId: assignedToId || null
      });

      if (res.status === 'success') {
        toast.success('Task created successfully');
        setIsAddModalOpen(false);
        resetForm();
        loadData();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to create task');
    }
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;
    if (!title.trim()) return toast.error('Task title is required');

    const parsedTags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    try {
      const res = await taskService.updateTask(editingTask.id, {
        title,
        description,
        status,
        priority,
        dueDate: dueDate || null,
        tags: parsedTags,
        assignedToId: assignedToId || null
      });

      if (res.status === 'success') {
        toast.success('Task updated successfully');
        setEditingTask(null);
        resetForm();
        loadData();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await taskService.deleteTask(id);
      toast.success('Task deleted successfully');
      loadData();
      if (editingTask?.id === id) setEditingTask(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete task');
    }
  };

  // HTML5 Drag & Drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggingTaskId(id);
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    if (dragOverColumn !== columnId) {
      setDragOverColumn(columnId);
    }
  };

  const handleDrop = async (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggingTaskId;
    setDraggingTaskId(null);
    setDragOverColumn(null);

    if (!taskId) return;

    // Find local task
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.status === columnId) return;

    // Instantly update status locally for optimistic UI response
    setTasks(prev => 
      prev.map(t => t.id === taskId ? { ...t, status: columnId } : t)
    );

    try {
      await taskService.updateTask(taskId, { status: columnId });
      toast.success(`Moved to ${COLUMNS.find(c => c.id === columnId)?.title}`);
    } catch (err: any) {
      toast.error('Failed to move task');
      loadData(); // Revert back if it fails
    }
  };

  const handleDragEnd = () => {
    setDraggingTaskId(null);
    setDragOverColumn(null);
  };

  // Filter tasks based on selections
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPriority = priorityFilter === 'ALL' || task.priority === priorityFilter;
    const matchesUser = userFilter === 'ALL' || task.assignedToId === userFilter;

    return matchesSearch && matchesPriority && matchesUser;
  });

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', label: 'Urgent' };
      case 'HIGH':
        return { bg: 'rgba(249, 115, 22, 0.1)', text: '#f97316', label: 'High' };
      case 'MEDIUM':
        return { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6', label: 'Medium' };
      default:
        return { bg: 'rgba(107, 114, 128, 0.1)', text: '#6b7280', label: 'Low' };
    }
  };

  const getDueDateStatus = (dueDateStr: string | null) => {
    if (!dueDateStr) return null;
    const due = new Date(dueDateStr);
    const now = new Date();
    // Reset times
    due.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);

    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { label: `Overdue by ${Math.abs(diffDays)}d`, color: '#ef4444', bg: 'rgba(239,68,68,0.08)', icon: AlertCircle };
    } else if (diffDays === 0) {
      return { label: 'Due today', color: '#f97316', bg: 'rgba(249,115,22,0.08)', icon: Clock };
    } else if (diffDays <= 2) {
      return { label: `Due in ${diffDays}d`, color: '#d97706', bg: 'rgba(217,119,6,0.08)', icon: Clock };
    } else {
      return { label: due.toLocaleDateString(), color: 'var(--text-tertiary)', bg: 'rgba(0,0,0,0.03)', icon: Calendar };
    }
  };

  const getUserInitials = (name: string | null) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="animated-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ListTodo size={24} style={{ color: '#094f56' }} /> Task Board
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your CRM actions, customer setups, and VPS operations in a detailed Kanban pipeline.</p>
        </div>
        <button onClick={handleOpenAddModal} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px', height: '38px', borderRadius: '0' }}>
          <Plus size={16} /> Add Task
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-card" style={{ padding: '16px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', borderRadius: '0' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '8px 12px 8px 36px', fontSize: '13px', background: 'rgba(0,0,0,0.02)', border: '1px solid var(--border)', outline: 'none', borderRadius: '0' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {/* Priority Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}><Filter size={14} /> Priority:</span>
            <select
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value)}
              style={{ padding: '6px 12px', fontSize: '13px', border: '1px solid var(--border)', background: 'white', outline: 'none', borderRadius: '0' }}
            >
              <option value="ALL">All Priorities</option>
              <option value="URGENT">Urgent</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          {/* Assigned To Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}><User size={14} /> Assignee:</span>
            <select
              value={userFilter}
              onChange={e => setUserFilter(e.target.value)}
              style={{ padding: '6px 12px', fontSize: '13px', border: '1px solid var(--border)', background: 'white', outline: 'none', borderRadius: '0' }}
            >
              <option value="ALL">All Members</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name || u.email}</option>
              ))}
            </select>
          </div>

          {(searchQuery || priorityFilter !== 'ALL' || userFilter !== 'ALL') && (
            <button 
              onClick={() => { setSearchQuery(''); setPriorityFilter('ALL'); setUserFilter('ALL'); }}
              style={{ padding: '6px 12px', fontSize: '12px', color: '#094f56', background: 'rgba(9,79,86,0.06)', border: 'none', cursor: 'pointer', fontWeight: '500' }}
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Kanban Board Container */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px', 
          flex: '1', 
          overflowY: 'auto',
          minHeight: '500px',
          alignItems: 'stretch'
        }}
      >
        {COLUMNS.map(column => {
          const colTasks = filteredTasks.filter(t => t.status === column.id);
          const isOver = dragOverColumn === column.id;

          return (
            <div 
              key={column.id}
              onDragOver={e => handleDragOver(e, column.id)}
              onDrop={e => handleDrop(e, column.id)}
              style={{ 
                background: isOver ? 'rgba(9,79,86,0.03)' : column.bg, 
                border: isOver ? '2px dashed #094f56' : `1px solid ${column.border}`,
                display: 'flex',
                flexDirection: 'column',
                minHeight: '400px',
                borderRadius: '0',
                transition: 'all 0.2s ease',
                boxShadow: isOver ? '0 10px 20px rgba(9,79,86,0.05)' : 'none'
              }}
            >
              {/* Column Header */}
              <div 
                style={{ 
                  padding: '16px', 
                  borderBottom: `2px solid ${column.color}`, 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  background: 'white'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: column.color }} />
                  <span style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)' }}>{column.title}</span>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.05)', padding: '2px 8px', borderRadius: '10px', fontWeight: '600' }}>
                  {colTasks.length}
                </span>
              </div>

              {/* Column Body / Tasks list */}
              <div 
                style={{ 
                  padding: '16px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '12px', 
                  flex: '1',
                  overflowY: 'auto',
                  maxHeight: 'calc(100vh - 350px)'
                }}
              >
                {loading ? (
                  <div style={{ color: 'var(--text-tertiary)', fontSize: '13px', textAlign: 'center', padding: '24px' }}>Loading...</div>
                ) : colTasks.length === 0 ? (
                  <div style={{ color: 'var(--text-tertiary)', fontSize: '12px', textAlign: 'center', padding: '32px 0', border: '1px dashed var(--border)', background: 'rgba(255,255,255,0.3)' }}>
                    Drop tasks here
                  </div>
                ) : (
                  colTasks.map(task => {
                    const priorityDetails = getPriorityStyle(task.priority);
                    const dueDetails = getDueDateStatus(task.dueDate);

                    return (
                      <div 
                        key={task.id}
                        draggable
                        onDragStart={e => handleDragStart(e, task.id)}
                        onDragEnd={handleDragEnd}
                        onClick={() => handleOpenEditModal(task)}
                        style={{ 
                          background: 'white', 
                          border: '1px solid var(--border)',
                          padding: '16px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                          cursor: 'grab',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                          position: 'relative',
                          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                          borderRadius: '0'
                        }}
                        className="task-card-hover"
                      >
                        {/* Priority Badge */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ 
                            fontSize: '10px', 
                            fontWeight: '700', 
                            color: priorityDetails.text, 
                            background: priorityDetails.bg, 
                            padding: '2px 8px', 
                            borderRadius: '4px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>
                            {priorityDetails.label}
                          </span>
                          
                          {/* Hover Action Panel */}
                          <div style={{ display: 'flex', gap: '8px' }} onClick={e => e.stopPropagation()}>
                            <button 
                              onClick={() => handleOpenEditModal(task)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: 'var(--text-tertiary)' }}
                              title="Edit Task"
                            >
                              <Edit3 size={13} />
                            </button>
                            <button 
                              onClick={() => handleDeleteTask(task.id)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: '#ef4444' }}
                              title="Delete Task"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>

                        {/* Title & Description */}
                        <div>
                          <h4 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px', lineHeight: '1.4' }}>{task.title}</h4>
                          {task.description && (
                            <p style={{ 
                              fontSize: '11px', 
                              color: 'var(--text-secondary)', 
                              lineHeight: '1.5',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}>
                              {task.description}
                            </p>
                          )}
                        </div>

                        {/* Category Tags */}
                        {task.tags && task.tags.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {task.tags.map(tag => (
                              <span key={tag} style={{ fontSize: '10px', color: '#094f56', background: 'rgba(9,79,86,0.06)', padding: '2px 6px', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                                <Tag size={8} /> {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Footer (Due Date + Assignee) */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid rgba(0,0,0,0.03)' }}>
                          {/* Due Date Indicator */}
                          {dueDetails ? (
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '4px', 
                              fontSize: '10px', 
                              color: dueDetails.color,
                              background: dueDetails.bg,
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontWeight: '600'
                            }}>
                              <dueDetails.icon size={10} />
                              {dueDetails.label}
                            </div>
                          ) : (
                            <div />
                          )}

                          {/* Assignee Avatar */}
                          {task.assignedTo ? (
                            <div 
                              style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '6px',
                                background: 'rgba(0,0,0,0.03)',
                                padding: '2px 6px',
                                borderRadius: '12px'
                              }}
                              title={task.assignedTo.name || task.assignedTo.email}
                            >
                              <div style={{ 
                                width: '16px', 
                                height: '16px', 
                                borderRadius: '50%', 
                                background: '#094f56', 
                                color: 'white', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                fontSize: '8px',
                                fontWeight: '700'
                              }}>
                                {getUserInitials(task.assignedTo.name)}
                              </div>
                              <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: '500', maxWidth: '60px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {task.assignedTo.name?.split(' ')[0] || task.assignedTo.email.split('@')[0]}
                              </span>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-tertiary)', fontSize: '10px' }}>
                              <User size={10} /> Unassigned
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Task Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'white', padding: '24px', width: '500px', borderRadius: '0', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', position: 'relative' }}>
            <button onClick={() => setIsAddModalOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}><X size={20} /></button>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '20px', color: '#1a1a2e', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckSquare size={18} style={{ color: '#094f56' }} /> Create Task
            </h3>
            
            <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Task Title *</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  placeholder="What needs to be done?" 
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', fontSize: '13px', outline: 'none', borderRadius: '0' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Description</label>
                <textarea 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  placeholder="Provide detailed description..." 
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', fontSize: '13px', minHeight: '80px', outline: 'none', borderRadius: '0', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Status</label>
                  <select 
                    value={status} 
                    onChange={e => setStatus(e.target.value)} 
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', fontSize: '13px', outline: 'none', borderRadius: '0' }}
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="IN_REVIEW">In Review</option>
                    <option value="DONE">Done</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Priority</label>
                  <select 
                    value={priority} 
                    onChange={e => setPriority(e.target.value)} 
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', fontSize: '13px', outline: 'none', borderRadius: '0' }}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Due Date</label>
                  <input 
                    type="date" 
                    value={dueDate} 
                    onChange={e => setDueDate(e.target.value)} 
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', fontSize: '13px', outline: 'none', borderRadius: '0' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Assignee</label>
                  <select 
                    value={assignedToId} 
                    onChange={e => setAssignedToId(e.target.value)} 
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', fontSize: '13px', outline: 'none', borderRadius: '0' }}
                  >
                    <option value="">Unassigned</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.name || u.email}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Tags (comma-separated)</label>
                <input 
                  type="text" 
                  value={tagsInput} 
                  onChange={e => setTagsInput(e.target.value)} 
                  placeholder="e.g. bug, vps, feature" 
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', fontSize: '13px', outline: 'none', borderRadius: '0' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsAddModalOpen(false)} style={{ background: '#f3f4f6', border: 'none', padding: '8px 16px', fontSize: '13px', cursor: 'pointer', fontWeight: '500' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 20px', fontSize: '13px', borderRadius: '0' }}>Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editingTask !== null && (
        <div className="modal-overlay" onClick={() => setEditingTask(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'white', padding: '24px', width: '500px', borderRadius: '0', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', position: 'relative' }}>
            <button onClick={() => setEditingTask(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}><X size={20} /></button>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingRight: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#1a1a2e', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Edit3 size={18} style={{ color: '#094f56' }} /> Edit Task
              </h3>
              <button 
                type="button" 
                onClick={() => handleDeleteTask(editingTask.id)}
                style={{ background: 'rgba(239, 68, 68, 0.08)', color: '#ef4444', border: 'none', padding: '6px 12px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Trash2 size={13} /> Delete Task
              </button>
            </div>
            
            <form onSubmit={handleUpdateTask} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Task Title *</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', fontSize: '13px', outline: 'none', borderRadius: '0' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Description</label>
                <textarea 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', fontSize: '13px', minHeight: '80px', outline: 'none', borderRadius: '0', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Status</label>
                  <select 
                    value={status} 
                    onChange={e => setStatus(e.target.value)} 
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', fontSize: '13px', outline: 'none', borderRadius: '0' }}
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="IN_REVIEW">In Review</option>
                    <option value="DONE">Done</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Priority</label>
                  <select 
                    value={priority} 
                    onChange={e => setPriority(e.target.value)} 
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', fontSize: '13px', outline: 'none', borderRadius: '0' }}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Due Date</label>
                  <input 
                    type="date" 
                    value={dueDate} 
                    onChange={e => setDueDate(e.target.value)} 
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', fontSize: '13px', outline: 'none', borderRadius: '0' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Assignee</label>
                  <select 
                    value={assignedToId} 
                    onChange={e => setAssignedToId(e.target.value)} 
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', fontSize: '13px', outline: 'none', borderRadius: '0' }}
                  >
                    <option value="">Unassigned</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.name || u.email}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Tags (comma-separated)</label>
                <input 
                  type="text" 
                  value={tagsInput} 
                  onChange={e => setTagsInput(e.target.value)} 
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', fontSize: '13px', outline: 'none', borderRadius: '0' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setEditingTask(null)} style={{ background: '#f3f4f6', border: 'none', padding: '8px 16px', fontSize: '13px', cursor: 'pointer', fontWeight: '500' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 20px', fontSize: '13px', borderRadius: '0' }}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
