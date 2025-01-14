// src/dashboard/store/projectData.js
console.log('[ProjectData] Loading project data...');
window.DEFAULT_PROJECTS = [
    {
        name: 'Jestr',
        category: 'Jestr',
        color: '#0a0a0a',
        status: 'active',
        tasks: [
            {
                id: '1734548351278',
                task: 'Continue with Apple',
                improving: 'medium',
                status: 'testing',
                createdAt: '2024-12-18T18:59:11.278Z'
            },
            {
                id: '1734548360034',
                task: 'Center Memes Vertically',
                improving: 'medium',
                status: 'testing',
                createdAt: '2024-12-18T18:59:20.034Z'
            },
            {
                id: '1734548366114',
                task: '9+ Notifications',
                improving: 'medium',
                status: 'completed',
                createdAt: '2024-12-18T18:59:26.114Z'
            },
            {
                id: '1734548379971',
                task: 'Bottom Tab Bar',
                improving: 'high',
                status: 'completed',
                createdAt: '2024-12-18T18:59:39.971Z'
            },
            {
                id: '1734553108164',
                task: 'Manual Android EAS Build',
                improving: 'low',
                status: 'pending',
                createdAt: '2024-12-18T20:18:28.164Z'
            },
            {
                id: '1734586726212',
                task: 'Pinned Messages Hammer',
                improving: 'low',
                status: 'pending',
                createdAt: '2024-12-19T05:38:46.212Z'
            },
            {
                id: '1734745975808',
                task: 'EAS Insights',
                improving: 'low',
                status: 'pending',
                createdAt: '2024-12-21T01:52:55.808Z'
            },
            {
                id: '1735074485386',
                task: 'Implement Likes notifications',
                improving: 'low',
                status: 'pending',
                createdAt: '2024-12-24T21:08:05.386Z'
            },
            {
                id: '1735074497458',
                task: 'Implement Comment Notifications',
                improving: 'low',
                status: 'pending',
                createdAt: '2024-12-24T21:08:17.458Z'
            },
            {
                id: '17367996039768eoym2mgd',
                task: 'Decide on bottom bar',
                improving: 'medium',
                status: 'pending'
            }
        ]
    },
    {
        name: 'SafeOps',
        category: 'SafeOps',
        color: '#011d6f',
        status: 'active',
        tasks: [
            {
                id: '1734559130590',
                task: 'Make Dev Script',
                improving: 'medium',
                status: 'completed',
                createdAt: '2024-12-18T21:58:50.590Z'
            }
        ]
    },
    {
        name: 'DeeDaw.cc',
        category: 'DeeDaw.cc',
        color: '#4a1452',
        status: 'active',
        tasks: [
            {
                id: '1734629306867',
                task: 'Add 4th Page',
                improving: 'medium',
                status: 'pending',
                createdAt: '2024-12-19T17:28:26.867Z'
            },
            {
                id: '1734731868996',
                task: 'Fix middle buttons',
                improving: 'low',
                status: 'pending',
                createdAt: '2024-12-20T21:57:48.996Z'
            }
        ]
    },
    {
        name: 'AWSomeDash',
        category: 'AWSomeDash',
        color: '#ff0000',
        status: 'active',
        tasks: [
            {
                id: '1734555307294',
                task: 'Fix Total Memes',
                priority: 'medium',
                status: 'pending',
                createdAt: '2024-12-18T20:55:07.294Z'
            },
            {
                id: '1734713696999',
                task: 'Display Config Settings Table',
                improving: 'low',
                status: 'pending',
                createdAt: '2024-12-20T16:54:56.999Z'
            },
            {
                id: '1734971481195',
                task: 'Add S3 Billing Costs',
                improving: 'low',
                status: 'pending',
                createdAt: '2024-12-23T16:31:21.195Z'
            },
            {
                id: '1736791493671',
                task: 'PWA',
                improving: 'low',
                status: 'pending',
                createdAt: '2025-01-13T18:04:53.671Z'
            }
        ]
    },
    {
        name: 'Gmr',
        category: 'Gmr',
        color: '#00ff00',
        status: 'active',
        tasks: [
            {
                id: '1735074451634',
                task: 'Add task to project inside Project manager',
                improving: 'low',
                status: 'completed',
                createdAt: '2024-12-24T21:07:31.634Z'
            },
            {
                id: '1735074571050',
                task: 'Todo list Wider',
                improving: 'low',
                status: 'pending',
                createdAt: '2024-12-24T21:09:31.050Z'
            },
            {
                id: '1735074579626',
                task: 'Right sidebar all the same button',
                improving: 'low',
                status: 'pending',
                createdAt: '2024-12-24T21:09:39.626Z'
            },
            {
                id: '1736791484482',
                task: 'Remove Project Manager',
                improving: 'medium',
                status: 'completed',
                createdAt: '2025-01-13T18:04:44.482Z'
            }
        ]
    },
    {
        name: 'SPT',
        category: 'SPT',
        color: '#0000ff',
        status: 'active',
        tasks: [
            {
                id: '1736797416066',
                task: 'BUG',
                improving: 'low',
                status: 'pending',
                createdAt: '2025-01-13T19:43:36.066Z'
            }
        ]
    },
    {
        name: 'Frost',
        category: 'Frost',
        color: '#00ccff',
        status: 'active',
        tasks: [
            {
                id: '1736791464312',
                task: 'Setup Lenevo SSH',
                improving: 'high',
                status: 'pending',
                createdAt: '2025-01-13T18:04:24.312Z'
            },
            {
                id: '17367995913288q15eduyh',
                task: 'Improve Jotai screen styles',
                improving: 'medium',
                status: 'pending'
            }
        ]
    }
];

const existingProjects = localStorage.getItem('projects');
if (!existingProjects) {
    localStorage.setItem('projects', JSON.stringify(window.DEFAULT_PROJECTS));
}
console.log('[ProjectData] Loaded projects:', window.DEFAULT_PROJECTS);