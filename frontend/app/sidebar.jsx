'use client'

import {useState, useEffect} from 'react'
import Link from "next/link"
import {usePathname, useRouter} from 'next/navigation'
import Cookies from 'js-cookie'
import {FaCopy, FaDownload} from "react-icons/fa";

export default function Sidebar() {
    const router = useRouter();
    const pathname = usePathname()
    const isActive = (path) => pathname === path
    const [isProjectListOpen, setIsProjectListOpen] = useState(false)
    const [projects, setProjects] = useState([])
    const [currentProjectId, setCurrentProjectId] = useState(null)
    const [newProjectName, setNewProjectName] = useState('')
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
    const [projectToUpdate, setProjectToUpdate] = useState(null)

    const API_URL = 'http://localhost:3000/projects';

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            router.push('/');
            return;
        }

        try {
            const response = await fetch(API_URL, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });

            if (response.ok) {
                const data = await response.json();
                setProjects(data);

                const storedProjectId = Cookies.get('currentProjectId');
                if (storedProjectId) {
                    setCurrentProjectId(storedProjectId);
                } else if (data.length > 0) {
                    setCurrentProject(data[0].project_id);
                }
            } else {
                console.error("Failed to fetch projects");
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const setCurrentProject = (projectId) => {
        setCurrentProjectId(projectId);
        Cookies.set('currentProjectId', projectId, {expires: 7});
    };

    const handleAddProject = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const token = localStorage.getItem('token');
        if (!token || !newProjectName.trim()) return;

        try {
            const response = await fetch(`${API_URL}/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({project_name: newProjectName}),
            });

            if (response.ok) {
                const newProject = await response.json();
                setProjects([...projects, newProject]);
                setNewProjectName('');
                window.location.reload();
            } else {
                console.error("Failed to add project");
            }
        } catch (error) {
            console.error('Error adding project:', error);
        }
    };

    const handleUpdateProject = async () => {
        if (!projectToUpdate) return;

        const token = localStorage.getItem('token');
        if (!token) return;

        const project_name = projectToUpdate.project_name.trim();

        try {
            const response = await fetch(`${API_URL}/${projectToUpdate.project_id}/update`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({project_name}),
            });

            if (response.ok) {
                const updatedProject = await response.json();
                setProjects(projects.map(p => p.project_id === updatedProject.project_id ? updatedProject : p));
                setIsUpdateModalOpen(false);
                setProjectToUpdate(null);
                window.location.reload();
            } else {
                console.error("Failed to update project");
            }
        } catch (error) {
            console.error('Error updating project:', error);
        }
    };

    const handleDeleteProject = async (projectId) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch(`${API_URL}/${projectId}/delete`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setProjects(projects.filter(p => p.project_id !== projectId));
                if (currentProjectId === projectId) {
                    const newCurrentProject = projects.find(p => p.project_id !== projectId);
                    if (newCurrentProject) {
                        setCurrentProject(newCurrentProject.project_id);
                    } else {
                        Cookies.remove('currentProjectId');
                    }
                }
                window.location.reload();
            } else {
                console.error("Failed to delete project");
            }
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    };

    const handleLogout = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            router.push('/');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/auth/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });

            if (response.ok) {
                localStorage.removeItem('token');
                Cookies.remove('currentProjectId');
                router.push('/');
            } else {
                console.error("Logout failed:", await response.text());
                localStorage.removeItem('token');
                Cookies.remove('currentProjectId');
                router.push('/');
            }
        } catch (error) {
            console.error('Logout error:', error);
            localStorage.removeItem('token');
            Cookies.remove('currentProjectId');
            router.push('/');
        }
    };

    const toggleProjectList = (e) => {
        e.preventDefault();
        setIsProjectListOpen(!isProjectListOpen);
    }

    return (
        <>
            <div className="drawer-side">
                <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
                <ul className="menu p-4 w-80 h-full bg-base-200 text-base-content flex flex-col">
                    {/* Logo and Account Info */}
                    <li className="mt-4 mb-4">
                        <div className="flex items-center">
                            <svg width="48" height="48" viewBox="0 0 400 400" fill="none"
                                 xmlns="http://www.w3.org/2000/svg"
                                 className="mr-3">
                                <rect width="400" height="400" rx="40" fill="#090E10"/>
                                <path d="M287.867 295H174.344L77 207.218V207.183H190.492L287.867 295Z" fill="white"/>
                                <path d="M276.638 156.087C276.638 184.307 253.802 207.178 225.625 207.183L190.492 207.183L77.1802 105H225.95C253.977 105.176 276.638 127.981 276.638 156.087Z" fill="#F6635A"/>
                                <path d="M323 295H305.434L208.059 207.183L225.625 207.183L323 295Z" fill="white"/>

                            </svg>
                            <div>
                                <h2 className="font-bold">Refract Developer Platform</h2>
                                <p className="text-sm">Account Information</p>
                            </div>
                        </div>
                    </li>

                    {/* Projects Dropdown */}
                    <li>
                        <details open={isProjectListOpen} onClick={toggleProjectList}>
                            <summary className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth={1.5}
                                     stroke="currentColor" className="w-6 h-6 mr-2">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/>
                                </svg>
                                My Projects
                            </summary>
                            <ul className="mt-2 space-y-2">
                                {projects.map(project => (
                                    <li key={project.project_id}
                                        className="flex items-center justify-between py-1 px-2 rounded-lg bg-base-100
                                    hover:bg-base-200"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                    <span
                                        className={`cursor-pointer truncate ${
                                            currentProjectId === project.project_id ? 'font-bold text-primary' : ''
                                        }`}
                                        onClick={() => {
                                            setCurrentProject(project.project_id);
                                            window.location.reload();
                                        }}
                                        style={{
                                            maxWidth: 'calc(100% - 60px)',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}
                                    >
                                        {project.project_name}
                                    </span>

                                        <div className="flex flex-row items-center space-x-1 flex-shrink-0">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setProjectToUpdate(project);
                                                    setIsUpdateModalOpen(true);
                                                }}
                                                className="p-1"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                     strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/>
                                                </svg>
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteProject(project.project_id);
                                                }}
                                                className="p-1 text-error"
                                                disabled={currentProjectId === project.project_id}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                     strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </li>
                                ))}
                                <li onClick={(e) => e.stopPropagation()}>
                                    <form onSubmit={handleAddProject} className="flex items-center mt-2">
                                        <input
                                            type="text"
                                            placeholder="New project name"
                                            value={newProjectName}
                                            onChange={(e) => setNewProjectName(e.target.value)}
                                            className="input input-bordered input-sm w-full"
                                        />
                                        <button type="submit" className="btn btn-sm btn-primary ml-2">Add</button>
                                    </form>
                                </li>
                            </ul>
                        </details>
                    </li>

                    {/* Navigation Links */}
                    <li className={isActive('/dashboard') ? 'bordered' : ''}>
                        <Link href="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                 stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                            </svg>
                            Project Dashboard
                        </Link>
                    </li>
                    <li className={isActive('/browse-actions') ? 'bordered' : ''}>
                        <Link href="/browse-actions" className={isActive('/browse-actions') ? 'active' : ''}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                 stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
                            </svg>
                            Browse Actions
                        </Link>
                    </li>
                    <li className={isActive('/workflows') ? 'bordered' : ''}>
                        <Link href="/workflows" className={isActive('/workflows') ? 'active' : ''}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                 stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"/>
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                            Workflows
                        </Link>
                    </li>

                    {/* Spacer */}
                    <div className="flex-grow"></div>

                    {/* Profile and Logout */}
                    <li className={isActive('/profile-settings') ? 'bordered' : ''}>
                        <Link href="/profile-settings" className={isActive('/profile-settings') ? 'active' : ''}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                 stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                            Profile & Settings
                        </Link>
                    </li>
                    <li>
                        <a onClick={handleLogout}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                 stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"/>
                            </svg>
                            Logout
                        </a>
                    </li>
                </ul>

                {/* Update Project Modal */}
                {isUpdateModalOpen && (
                    <div className="modal modal-open">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg">Update Project Name</h3>
                            <input
                                type="text"
                                placeholder="New project name"
                                value={projectToUpdate?.project_name || ''}
                                onChange={(e) => setProjectToUpdate({...projectToUpdate, project_name: e.target.value})}
                                className="input input-bordered w-full mt-4"
                            />
                            <div className="modal-action">
                                <button onClick={handleUpdateProject} className="btn btn-primary">Update</button>
                                <button onClick={() => setIsUpdateModalOpen(false)} className="btn">Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

