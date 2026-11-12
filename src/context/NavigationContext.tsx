import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type PageRoute =
  | { name: 'home' }
  | { name: 'departments'; deptId?: string }
  | { name: 'projects'; search?: string; deptId?: string }
  | { name: 'awards' }
  | { name: 'project-detail'; projectId: string }
  | { name: 'about' }
  | { name: 'admin' };

interface NavigationContextType {
  route: PageRoute;
  navigate: (newRoute: PageRoute) => void;
  goBack: () => void;
  navigateToProject: (projectId: string) => void;
  navigateToDepartment: (deptId?: string) => void;
  navigateToProjects: (search?: string, deptId?: string) => void;
  navigateToAwards: () => void;
  navigateToHome: () => void;
  navigateToAbout: () => void;
  navigateToAdmin: () => void;
}

const NavigationContext = createContext<NavigationContextType>({
  route: { name: 'home' },
  navigate: () => {},
  goBack: () => {},
  navigateToProject: () => {},
  navigateToDepartment: () => {},
  navigateToProjects: () => {},
  navigateToAwards: () => {},
  navigateToHome: () => {},
  navigateToAbout: () => {},
  navigateToAdmin: () => {},
});

function parseHashToRoute(): PageRoute {
  try {
    const hash = window.location.hash.replace(/^#\/?/, '');
    const searchParams = new URLSearchParams(window.location.search);

    // Deep link query param ?project=...
    const projectQuery = searchParams.get('project');
    if (projectQuery) {
      return { name: 'project-detail', projectId: projectQuery };
    }

    if (!hash || hash === 'home') {
      return { name: 'home' };
    }

    if (hash.startsWith('project/')) {
      const parts = hash.split('/');
      return { name: 'project-detail', projectId: parts[1] || '' };
    }

    if (hash.startsWith('departments/')) {
      const parts = hash.split('/');
      return { name: 'departments', deptId: parts[1] };
    }

    if (hash === 'departments') {
      return { name: 'departments' };
    }

    if (hash.startsWith('projects')) {
      const url = new URL(window.location.href);
      const search = url.searchParams.get('q') || undefined;
      const deptId = url.searchParams.get('dept') || undefined;
      return { name: 'projects', search, deptId };
    }

    if (hash === 'awards') {
      return { name: 'awards' };
    }

    if (hash === 'about') {
      return { name: 'about' };
    }

    if (hash === 'admin') {
      return { name: 'admin' };
    }

    return { name: 'home' };
  } catch {
    return { name: 'home' };
  }
}

function routeToHash(route: PageRoute): string {
  switch (route.name) {
    case 'home':
      return '#/home';
    case 'departments':
      return route.deptId ? `#/departments/${route.deptId}` : '#/departments';
    case 'projects': {
      const params = new URLSearchParams();
      if (route.search) params.set('q', route.search);
      if (route.deptId) params.set('dept', route.deptId);
      const query = params.toString();
      return query ? `#/projects?${query}` : '#/projects';
    }
    case 'awards':
      return '#/awards';
    case 'project-detail':
      return `#/project/${route.projectId}`;
    case 'about':
      return '#/about';
    case 'admin':
      return '#/admin';
    default:
      return '#/home';
  }
}

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [route, setRoute] = useState<PageRoute>(() => parseHashToRoute());

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(parseHashToRoute());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  const navigate = useCallback((newRoute: PageRoute) => {
    setRoute(newRoute);
    const newHash = routeToHash(newRoute);
    if (window.location.hash !== newHash) {
      window.location.hash = newHash;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goBack = useCallback(() => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate({ name: 'home' });
    }
  }, [navigate]);

  const navigateToProject = useCallback(
    (projectId: string) => navigate({ name: 'project-detail', projectId }),
    [navigate]
  );

  const navigateToDepartment = useCallback(
    (deptId?: string) => navigate({ name: 'departments', deptId }),
    [navigate]
  );

  const navigateToProjects = useCallback(
    (search?: string, deptId?: string) => navigate({ name: 'projects', search, deptId }),
    [navigate]
  );

  const navigateToAwards = useCallback(() => navigate({ name: 'awards' }), [navigate]);
  const navigateToHome = useCallback(() => navigate({ name: 'home' }), [navigate]);
  const navigateToAbout = useCallback(() => navigate({ name: 'about' }), [navigate]);
  const navigateToAdmin = useCallback(() => navigate({ name: 'admin' }), [navigate]);

  return (
    <NavigationContext.Provider
      value={{
        route,
        navigate,
        goBack,
        navigateToProject,
        navigateToDepartment,
        navigateToProjects,
        navigateToAwards,
        navigateToHome,
        navigateToAbout,
        navigateToAdmin,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);
