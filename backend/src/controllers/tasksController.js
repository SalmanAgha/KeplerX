const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all tasks
exports.getTasks = async (req, res) => {
    try {
        const tasks = await prisma.task.findMany({
            include: {
                assignedTo: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true
                    }
                }
            },
            orderBy: [
                { status: 'asc' },
                { order: 'asc' }
            ]
        });
        res.status(200).json({ status: 'success', data: tasks });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch tasks' });
    }
};

// Create a task
exports.createTask = async (req, res) => {
    try {
        const { title, description, status, priority, dueDate, tags, assignedToId } = req.body;
        
        if (!title) {
            return res.status(400).json({ status: 'error', message: 'Title is required' });
        }

        // Get max order in the target status to append
        const maxOrderTask = await prisma.task.findFirst({
            where: { status: status || 'TODO' },
            orderBy: { order: 'desc' },
            select: { order: true }
        });
        const order = maxOrderTask ? maxOrderTask.order + 1 : 0;

        const data = {
            title,
            description: description || null,
            status: status || 'TODO',
            priority: priority || 'MEDIUM',
            dueDate: dueDate ? new Date(dueDate) : null,
            tags: tags || [],
            order,
            assignedToId: assignedToId || null
        };

        const task = await prisma.task.create({
            data,
            include: {
                assignedTo: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true
                    }
                }
            }
        });

        res.status(201).json({ status: 'success', data: task });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ status: 'error', message: 'Failed to create task' });
    }
};

// Update a task
exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status, priority, dueDate, tags, assignedToId, order } = req.body;

        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (status !== undefined) updateData.status = status;
        if (priority !== undefined) updateData.priority = priority;
        if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;
        if (tags !== undefined) updateData.tags = tags;
        if (assignedToId !== undefined) updateData.assignedToId = assignedToId || null;
        if (order !== undefined) updateData.order = parseInt(order);

        const task = await prisma.task.update({
            where: { id },
            data: updateData,
            include: {
                assignedTo: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true
                    }
                }
            }
        });

        res.status(200).json({ status: 'success', data: task });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ status: 'error', message: 'Failed to update task' });
    }
};

// Delete a task
exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.task.delete({ where: { id } });
        res.status(200).json({ status: 'success', message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ status: 'error', message: 'Failed to delete task' });
    }
};
