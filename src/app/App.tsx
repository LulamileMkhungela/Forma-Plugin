import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowUpRight, Braces, ChevronDown, Command, Component as ComponentIcon, FileText,
  FlaskConical, Bug, Info, Menu, Moon, Search, Sun, X
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Avatar, Badge } from '../system';
import { isPageId, navigation, pageCatalog, pageIcons, pageTitles, type PageId } from '../data/navigation';
import { componentHandoff } from '../data/component-handoff';
import { allTokens, cssValue } from '../data/tokens';
import { requestTokenSelection } from '../data/searchBridge';
import { OverviewPage } from './OverviewPage';
import { WorkflowPage } from './WorkflowPage';
import {
  ColorsPage, IconographyPage, MotionPage, SpacingPage, TypographyPage
} from './FoundationPages';
import { ComponentIndexPage, ComponentPage, type ComponentPageId } from './ComponentPages';
import { ExplorerPage } from './ExplorerPage';
import { FigmaPage, FrameworksPage, PlaygroundPage, ResourcesPage, StorybookPage } from './IntegrationPages';
import {
  AccessibilityPage, ChangelogPage, DocumentationPage, ReviewLabPage, TokensPage
} from './ReferencePages';

const componentFamilyPages = pageCatalog.filter((item) => item.group === 'Components');

export default function App() {
  const [activePage, setActivePage] = useState<PageId>(() => {
    const hash = window.location.hash.slice(1);
    return isPageId(hash) ? hash : 'overview';
  });
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return window.localStorage.getItem('forma-theme') === 'dark' ? 'dark' : 'light';
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [expandedNav, setExpandedNav] = useState<Record<string, boolean>>({});
  const searchTriggerRef = useRef<HTMLButtonElement>(null);
  const wasSearchOpen = useRef(false);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (isPageId(hash)) setActivePage(hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    window.localStorage.setItem('forma-theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes((event.target as HTMLElement)?.tagName)) {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === 'Escape') {
        setSearchOpen(false);
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(''), 2800);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    if (wasSearchOpen.current && !searchOpen) searchTriggerRef.current?.focus();
    wasSearchOpen.current = searchOpen;
  });

  useEffect(() => {
    if (componentFamilyPages.some((item) => item.id === activePage)) {
      setExpandedNav((previous) => ({ ...previous, components: true }));
    }
  }, [activePage]);

  const navigate = (page: PageId) => {
    if (window.location.hash !== `#${page}`) window.history.pushState({ page }, '', `#${page}`);
    setActivePage(page);
    setSearchOpen(false);
    setIsSidebarOpen(false);
    document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const ActiveIcon = pageIcons[activePage];
  const activeGroup = pageCatalog.find((item) => item.id === activePage)?.group;

  const renderPage = () => {
    if (activePage === 'overview') return <OverviewPage onNavigate={navigate} onToast={setToast} />;
    if (activePage === 'workflow') return <WorkflowPage onNavigate={navigate} />;
    if (activePage === 'colors') return <ColorsPage onToast={setToast} onNavigate={navigate} />;
    if (activePage === 'typography') return <TypographyPage onToast={setToast} />;
    if (activePage === 'spacing') return <SpacingPage onNavigate={navigate} onToast={setToast} />;
    if (activePage === 'iconography') return <IconographyPage onToast={setToast} />;
    if (activePage === 'motion') return <MotionPage />;
    if (activePage === 'explorer') return <ExplorerPage onNavigate={navigate} onToast={setToast} />;
    if (activePage === 'components') return <ComponentIndexPage onNavigate={navigate} onToast={setToast} />;
    if (['buttons', 'fields', 'selects', 'selection', 'feedback'].includes(activePage)) {
      return <ComponentPage page={activePage as ComponentPageId} onToast={setToast} onNavigate={navigate} />;
    }
    if (activePage === 'figma') return <FigmaPage onToast={setToast} onNavigate={navigate} />;
    if (activePage === 'tokens') return <TokensPage onToast={setToast} />;
    if (activePage === 'review') return <ReviewLabPage onToast={setToast} />;
    if (activePage === 'frameworks') return <FrameworksPage onToast={setToast} />;
    if (activePage === 'storybook') return <StorybookPage onToast={setToast} onNavigate={navigate} />;
    if (activePage === 'playground') return <PlaygroundPage onToast={setToast} onNavigate={navigate} />;
    if (activePage === 'accessibility') return <AccessibilityPage onToast={setToast} />;
    if (activePage === 'documentation') return <DocumentationPage onNavigate={navigate} />;
    if (activePage === 'changelog') return <ChangelogPage />;
    return <ResourcesPage onToast={setToast} />;
  };

  return (
    <div className="app-shell" data-theme={theme}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      {isSidebarOpen && <button className="sidebar-backdrop" aria-label="Close navigation" onClick={() => setIsSidebarOpen(false)} />}
      <aside className={`app-sidebar${isSidebarOpen ? ' is-open' : ''}`}>
        <div className="sidebar-brand">
          <button className="brand-lockup" onClick={() => navigate('overview')} aria-label="Forma Design System home">
            <img className="brand-mark" src="/forma-icon-128.png" alt="" />
            <span className="brand-text"><strong>forma<span>.</span></strong><small>A LIVING DESIGN SYSTEM</small></span>
          </button>
          <button className="sidebar-collapse" aria-label="Close menu" onClick={() => setIsSidebarOpen(false)}><X size={15} /></button>
        </div>
        <button className="workspace-switcher" onClick={() => navigate('overview')}>
          <span className="workspace-avatar">F</span>
          <span><b>Forma workspace</b><small>Design system</small></span>
          <ArrowUpRight size={13} />
        </button>
        <nav className="side-navigation" aria-label="Design system navigation">
          {navigation.map((group) => <div className="nav-group" key={group.label}>
            <div className="nav-group__label">{group.label}</div>
            {group.items.map((item) => {
              const Icon = item.icon;
              const active = item.id === activePage;
              const children = item.id === 'components' ? componentFamilyPages : [];
              const isOpen = children.length > 0 && (expandedNav[item.id] ?? children.some((child) => child.id === activePage));
              return (
                <div key={item.id}>
                  <div className={children.length ? 'nav-parent' : undefined}>
                    <button className={`nav-item${active ? ' is-active' : ''}`} onClick={() => navigate(item.id)} aria-current={active ? 'page' : undefined}>
                      <Icon size={15} strokeWidth={active ? 2.1 : 1.8} />
                      <span>{item.label}</span>
                      {item.badge && <span className="nav-badge">{item.badge}</span>}
                    </button>
                    {children.length > 0 && <button className={`nav-expand${isOpen ? ' is-open' : ''}`} aria-expanded={isOpen} aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${item.label} families`} onClick={() => setExpandedNav((previous) => ({ ...previous, [item.id]: !isOpen }))}><ChevronDown size={14} /></button>}
                  </div>
                  {isOpen && <div className="nav-children">{children.map((child) => {
                    const ChildIcon = child.icon;
                    const childActive = child.id === activePage;
                    return <button key={child.id} className={`nav-child${childActive ? ' is-active' : ''}`} onClick={() => navigate(child.id)} aria-current={childActive ? 'page' : undefined}><ChildIcon size={13} /><span>{child.label}</span></button>;
                  })}</div>}
                </div>
              );
            })}
          </div>)}
        </nav>
        <div className="sidebar-lower">
          <div className="sidebar-nudge">
            <span className="nudge-icon"><FlaskConical size={13} /></span>
            <span className="sidebar-nudge__eyebrow">COMPONENT LAB</span>
            <b>Built to be explored.</b>
            <p>Try a pattern. Inspect the details.</p>
            <button onClick={() => navigate('playground')}>Open the lab <span>↗</span></button>
          </div>
          <div className="sidebar-creator">
            <Avatar name="Lulamile Mkhungela" size="md" />
            <span><b>Lulamile Mkhungela</b><small>System creator</small></span>
            <button className="creator-more" aria-label="About the creator" onClick={() => setToast('Forma Design System · created by Lulamile Mkhungela')}><Info size={14} /></button>
          </div>
        </div>
      </aside>

      <div className="app-main-shell">
        <header className="topbar">
          <div className="topbar-left">
            <button className="mobile-menu" aria-label="Open navigation" onClick={() => setIsSidebarOpen(true)}><Menu size={19} /></button>
            <div className="breadcrumb"><span>Design system</span><span className="breadcrumb-chevron">/</span>{activeGroup === 'Components' && <><span>Components</span><span className="breadcrumb-chevron">/</span></>}<span className="breadcrumb-icon"><ActiveIcon size={14} /></span><strong>{pageTitles[activePage]}</strong></div>
          </div>
          <div className="topbar-actions">
            <button ref={searchTriggerRef} className="search-trigger" onClick={() => setSearchOpen(true)}><Search size={14} /><span>Search tokens, components…</span><kbd><Command size={10} /> K</kbd></button>
            <span className="topbar-divider" />
            <button className="top-icon-button theme-switch" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}>{theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}</button>
            <Badge tone="neutral" size="sm" className="top-version"><i />v1.0</Badge>
            <button className="top-avatar-button" onClick={() => setToast('Forma Design System · created by Lulamile Mkhungela')} aria-label="Created by Lulamile Mkhungela"><Avatar name="Lulamile Mkhungela" size="sm" /></button>
          </div>
        </header>
        <main className="app-main" id="main-content" tabIndex={-1}>
          {renderPage()}
          <footer className="main-footer">
            <span>Designed with care <span className="footer-heart">✳</span></span>
            <span>Forma <span>·</span> 1.0.0 <span>·</span> by <strong>Lulamile Mkhungela</strong></span>
            <span className="main-footer__actions"><a href="https://github.com/LulamileMkhungela/Form-Plugin/issues" target="_blank" rel="noreferrer"><Bug size={13} /> Report an issue</a><button onClick={() => navigate('documentation')}><FileText size={13} /> Documentation</button></span>
          </footer>
        </main>
      </div>
      {searchOpen && <SearchDialog onNavigate={navigate} onClose={() => setSearchOpen(false)} />}
      <div className={`toast-message${toast ? ' is-visible' : ''}`} role="status" aria-live="polite"><span><CheckIcon /></span>{toast}</div>
    </div>
  );
}

interface SearchResult {
  key: string;
  label: string;
  context: string;
  icon: LucideIcon;
  run: () => void;
}

interface SearchSection {
  title: string;
  results: SearchResult[];
}

function SearchDialog({ onNavigate, onClose }: {
  onNavigate: (page: PageId) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  useEffect(() => { inputRef.current?.focus(); }, []);
  const sections: SearchSection[] = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) {
      const suggested: PageId[] = ['overview', 'workflow', 'components', 'tokens'];
      return [{
        title: 'Suggested',
        results: suggested.map((id) => {
          const page = pageCatalog.find((item) => item.id === id) ?? pageCatalog[0];
          return { key: page.id, label: page.label, context: page.group ?? 'Page', icon: page.icon, run: () => onNavigate(page.id) };
        })
      }];
    }
    const pageResults: SearchResult[] = pageCatalog
      .filter((page) => `${page.label} ${page.group ?? ''}`.toLowerCase().includes(term))
      .slice(0, 7)
      .map((page) => ({ key: `page-${page.id}`, label: page.label, context: page.group ?? 'Page', icon: page.icon, run: () => onNavigate(page.id) }));
    const componentResults: SearchResult[] = componentHandoff
      .filter((entry) => `${entry.name} ${entry.figmaSet} ${entry.reactExport}`.toLowerCase().includes(term))
      .slice(0, 5)
      .map((entry) => ({ key: `component-${entry.id}`, label: entry.name, context: `Component · Figma set “${entry.figmaSet}”`, icon: ComponentIcon, run: () => onNavigate(entry.family) }));
    const tokenResults: SearchResult[] = allTokens
      .filter((token) => `${token.name} ${token.type} ${cssValue(token.value)}`.toLowerCase().includes(term))
      .slice(0, 6)
      .map((token) => ({ key: `token-${token.name}`, label: token.name, context: `${token.type} · ${cssValue(token.value).slice(0, 30)}`, icon: Braces, run: () => { requestTokenSelection(token.name); onNavigate('tokens'); } }));
    return [
      { title: 'Pages', results: pageResults },
      { title: 'Components', results: componentResults },
      { title: 'Tokens', results: tokenResults }
    ].filter((section) => section.results.length > 0);
  }, [query, onNavigate]);
  const flat = useMemo(() => sections.flatMap((section) => section.results), [sections]);
  const offsets = useMemo(() => {
    const starts: number[] = [];
    let count = 0;
    for (const section of sections) {
      starts.push(count);
      count += section.results.length;
    }
    return starts;
  }, [sections]);
  useEffect(() => { setSelectedIndex(0); }, [query]);
  useEffect(() => { itemRefs.current[selectedIndex]?.scrollIntoView({ block: 'nearest' }); }, [selectedIndex]);
  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setSelectedIndex((index) => Math.min(index + 1, flat.length - 1));
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setSelectedIndex((index) => Math.max(index - 1, 0));
    }
    if (event.key === 'Enter' && flat[selectedIndex]) {
      event.preventDefault();
      flat[selectedIndex].run();
    }
  };
  return (
    <div className="search-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="search-dialog" role="dialog" aria-modal="true" aria-label="Search Forma documentation">
        <div className="search-dialog__input"><Search size={17} /><input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={handleSearchKeyDown} placeholder="Search pages, components and tokens…" /><kbd>ESC</kbd><button aria-label="Close search" onClick={onClose}><X size={15} /></button></div>
        <div className="search-dialog__results">
          {flat.length ? sections.map((section, sectionIndex) => <div key={section.title}>
            <div className="search-section-title">{section.title}</div>
            {section.results.map((result, resultIndex) => {
              const index = offsets[sectionIndex] + resultIndex;
              const Icon = result.icon;
              return <button key={result.key} ref={(element) => { itemRefs.current[index] = element; }} className={selectedIndex === index ? 'is-selected' : ''} onMouseEnter={() => setSelectedIndex(index)} onClick={result.run}><span className="search-result-icon"><Icon size={15} /></span><span><b>{result.label}</b><small>{result.context}</small></span><span className="search-result-enter">↵</span></button>;
            })}
          </div>) : <div className="search-empty"><Search size={18} /><span>No matches for “{query}”</span><small>Try a page, component or token name.</small></div>}
        </div>
        <div className="search-dialog__foot"><span><kbd>↑</kbd><kbd>↓</kbd> to navigate</span><span><kbd>↵</kbd> to open</span><span>Search Forma</span></div>
      </div>
    </div>
  );
}

function CheckIcon() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m3 8.2 3.1 3L13 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
