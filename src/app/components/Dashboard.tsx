"use client";
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  github: string;
  live: string;
}

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const { register, handleSubmit, reset, setValue } = useForm();
  const [message, setMessage] = useState('');
  const apiUrl = process.env.NEXT_PUBLIC_API_URL 
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/projects`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      setMessage('Failed to fetch projects.');
    }
  };

  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();
      if (editingProject) {
        formData.append('id', editingProject.id.toString());
      }
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('github', data.github);
      formData.append('live', data.live);
      if (data.image && data.image[0]) {
        formData.append('image', data.image[0]);
      }

      const response = await fetch(`${apiUrl}/api/projects`, {
        method: editingProject ? 'PUT' : 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa('admin:password')
        },
        body: formData,
      });

      if (response.ok) {
        setMessage(editingProject ? 'Project updated successfully!' : 'Project added successfully!');
        reset();
        setEditingProject(null);
        fetchProjects();
      } else {
        throw new Error('Failed to add/update project');
      }
    } catch (error) {
      setMessage('Error adding/updating project. Please try again.');
    }
  };

  const deleteProject = async (id: number) => {
    try {
      const response = await fetch(`${apiUrl}/api/projects?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Basic ' + btoa('admin:password')
        },
      });

      if (response.ok) {
        setMessage('Project deleted successfully!');
        fetchProjects();
      } else {
        throw new Error('Failed to delete project');
      }
    } catch (error) {
      setMessage('Error deleting project. Please try again.');
    }
  };

  const startEditing = (project: Project) => {
    setEditingProject(project);
    setValue('title', project.title);
    setValue('description', project.description);
    setValue('github', project.github);
    setValue('live', project.live);
  };

  return (
    <div className="max-w-7xl mx-auto mt-12 p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-extrabold mb-8 text-gray-900">Project Dashboard</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mb-8">
        <div>
          <label htmlFor="title" className="block text-lg font-medium text-gray-700">Title</label>
          <input type="text" id="title" {...register('title')} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
        </div>
        <div>
          <label htmlFor="description" className="block text-lg font-medium text-gray-700">Description</label>
          <textarea id="description" {...register('description')} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea>
        </div>
        <div>
          <label htmlFor="image" className="block text-lg font-medium text-gray-700">Project Image</label>
          <input type="file" id="image" {...register('image')} accept="image/*" className="mt-1 block w-full" />
        </div>
        <div>
          <label htmlFor="github" className="block text-lg font-medium text-gray-700">GitHub URL</label>
          <input type="url" id="github" {...register('github')} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
        </div>
        <div>
          <label htmlFor="live" className="block text-lg font-medium text-gray-700">Live Demo URL</label>
          <input type="url" id="live" {...register('live')} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
        </div>
        <button type="submit" className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          {editingProject ? 'Update Project' : 'Add Project'}
        </button>
      </form>
      {message && <p className="text-center text-lg font-medium text-green-600">{message}</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projects.map((project) => (
              <tr key={project.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{project.title}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{project.description.substring(0, 100)}...</td>
                <td className="px-6 py-4">
                  <img src={project.imageUrl} alt={project.title} className="h-12 w-12 object-cover rounded-md" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => startEditing(project)} className="text-indigo-600 hover:text-indigo-800 mr-4">Edit</button>
                  <button onClick={() => deleteProject(project.id)} className="text-red-600 hover:text-red-800">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;