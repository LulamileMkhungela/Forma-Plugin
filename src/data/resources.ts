export interface Resource {
  title: string;
  description: string;
  url: string;
  category: string;
  label?: string;
}

export const resources: Resource[] = [
  { title: 'Design System Inventory', description: 'A practical map of the people, tools, processes and artifacts behind a design system.', url: 'https://thedesignsystem.guide/airbundle', category: 'Start here', label: 'Guide' },
  { title: 'Build a Design System', description: 'Start with foundations, establish a useful scope, then grow the system with the product.', url: 'https://thedesignsystem.guide/start-here', category: 'Start here', label: 'Guide' },
  { title: 'Design System Knowledge Base', description: 'A browsable reference for design system craft and operating practices.', url: 'https://thedesignsystem.guide/knowledge-base', category: 'Start here', label: 'Reference' },
  { title: 'Design System Metrics', description: 'Ways to measure system reach, contribution, satisfaction and product impact.', url: 'https://thedesignsystem.guide/design-system-metrics', category: 'Start here', label: 'Measurement' },
  { title: 'Research & Interview Questions', description: 'Prompts for learning how teams discover, consume and contribute to a system.', url: 'https://thedesignsystem.guide/design-system-research-interview-questions', category: 'Start here', label: 'Research' },

  { title: 'DTCG Format Module', description: 'Community format for interoperable design tokens, including motion token types.', url: 'https://design-tokens.github.io/community-group/format/', category: 'Tokens & code', label: 'Specification' },
  { title: 'Style Dictionary', description: 'Transform one token source into platform-specific code for CSS, Sass, JavaScript and more.', url: 'https://styledictionary.com/', category: 'Tokens & code', label: 'Build tool' },
  { title: 'Terrazzo', description: 'A DTCG-native token pipeline for generating code across design and engineering platforms.', url: 'https://terrazzo.app/', category: 'Tokens & code', label: 'Build tool' },
  { title: 'Tokens Studio', description: 'Manage token sets, themes and design-to-code sync from inside Figma.', url: 'https://tokens.studio/', category: 'Tokens & code', label: 'Figma plugin' },
  { title: 'TokensBrücke', description: 'Export Figma Variables into portable token data and sync them to Git providers.', url: 'https://lnkd.in/dFPk9q9A', category: 'Tokens & code', label: 'Figma plugin' },
  { title: 'Design Token Kit', description: 'Validate, convert, document and find duplicates in token collections.', url: 'https://lnkd.in/dAaf5mVs', category: 'Tokens & code', label: 'Open source' },
  { title: 'Open Props', description: 'A broad CSS token reference with color, easing, animation and layout primitives.', url: 'https://open-props.style/', category: 'Tokens & code', label: 'CSS reference' },
  { title: 'Leonardo', description: 'Build perceptually balanced color scales and accessible themes.', url: 'https://leonardocolor.io/', category: 'Tokens & code', label: 'Color' },
  { title: 'Farbvelo', description: 'Explore palette generation, editing and color inspiration.', url: 'https://farbvelo.elastiq.ch/', category: 'Tokens & code', label: 'Color' },
  { title: 'Supa Palette', description: 'Palette generator and editor for creating color systems in Figma.', url: 'https://www.supa-palette.com/', category: 'Tokens & code', label: 'Figma plugin' },
  { title: 'Cobalt', description: 'Turn design tokens into usable frontend code.', url: 'https://www.cobaltui.dev/', category: 'Tokens & code', label: 'Codegen' },
  { title: 'Adobe Spectrum Token Visualizer', description: 'Browse Spectrum token values by theme and platform.', url: 'https://opensource.adobe.com/spectrum-tokens/visualizer/?filter=spectrum%2Clight%2Cdesktop', category: 'Tokens & code', label: 'Reference' },

  { title: 'Automator', description: 'Compose repeatable actions that make Figma production tasks faster.', url: 'https://automator.design/', category: 'Figma & prototyping', label: 'Figma plugin' },
  { title: 'Magician', description: 'AI-assisted copy, icons and creative exploration inside Figma.', url: 'https://magician.design/', category: 'Figma & prototyping', label: 'AI tool' },
  { title: 'Patterns AI', description: 'An AI assistant for turning interface ideas into frontend patterns.', url: 'https://www.designpatterns.io/ai', category: 'Figma & prototyping', label: 'AI tool' },
  { title: 'Galileo UI', description: 'Explore AI-assisted interface concepts and visual directions.', url: 'https://www.usegalileo.ai/explore', category: 'Figma & prototyping', label: 'AI tool' },
  { title: 'Ando', description: 'AI copilot for designers in the Figma community.', url: 'https://www.figma.com/community/plugin/1145446664512862540/ando-ai-copilot-for-designers', category: 'Figma & prototyping', label: 'Figma plugin' },
  { title: 'Anima for Design Systems', description: 'Sync components from Storybook back into a Figma workflow.', url: 'https://www.animaapp.com/use-cases/design-systems', category: 'Figma & prototyping', label: 'Handoff' },
  { title: 'Gist', description: 'Attach component documentation and external references to Figma components.', url: 'https://www.figma.com/community/plugin/1073059820691713754/Gist', category: 'Figma & prototyping', label: 'Figma plugin' },
  { title: 'Contrast for Figma', description: 'Check selected layer contrast while designing.', url: 'https://www.figma.com/community/plugin/748533339900865323/Contrast', category: 'Figma & prototyping', label: 'Accessibility' },
  { title: 'Similayer', description: 'Select layers with similar styles, properties or component relationships.', url: 'https://www.figma.com/community/plugin/735733267883397781/Similayer', category: 'Figma & prototyping', label: 'Figma plugin' },
  { title: 'Adee', description: 'Accessibility checks, contrast review and color-blind simulation in Figma.', url: 'https://www.figma.com/community/plugin/931280467863251825/Adee-Comprehensive-Accessibility-Tool', category: 'Figma & prototyping', label: 'Accessibility' },
  { title: 'Figma Autoname', description: 'Rename layers in a Figma file to make handoff easier to understand.', url: 'https://designstrategy.guide/design-management/the-ultimate-design-systems-resources-list/', category: 'Figma & prototyping', label: 'Workflow' },
  { title: 'Instance Finder', description: 'Find component instances used throughout a Figma file.', url: 'https://www.figma.com/community/plugin/741895659787979282/Instance-Finder', category: 'Figma & prototyping', label: 'Figma plugin' },
  { title: 'Propstar', description: 'Generate a labelled inventory of component instances and properties.', url: 'https://www.figma.com/community/plugin/1116018586739867857/Propstar', category: 'Figma & prototyping', label: 'Figma plugin' },
  { title: 'EightShapes Specs', description: 'Automate production of design specifications for handoff.', url: 'https://eightshapes.com/', category: 'Figma & prototyping', label: 'Documentation' },
  { title: 'Design System Manager', description: 'Manage visual tokens and documentation alongside Figma and Adobe XD.', url: 'https://www.toolabs.com/', category: 'Figma & prototyping', label: 'Token manager' },

  { title: 'Supernova', description: 'Design system platform for tokens, documentation and multi-platform code delivery.', url: 'https://www.supernova.io/', category: 'Platforms', label: 'Platform' },
  { title: 'Knapsack', description: 'Connect dynamic documentation, tokens, live code and delivery workflows.', url: 'https://www.knapsack.cloud/', category: 'Platforms', label: 'Platform' },
  { title: 'Penpot', description: 'Open-source design and prototyping with design-token and theme support.', url: 'https://penpot.app/', category: 'Platforms', label: 'Open source' },
  { title: 'Storybook', description: 'Build, test and document UI components independently from product screens.', url: 'https://storybook.js.org/', category: 'Platforms', label: 'Component workbench' },
  { title: 'Zeroheight', description: 'Create a central design system documentation space for the whole team.', url: 'https://zeroheight.com/', category: 'Platforms', label: 'Documentation' },
  { title: 'Frontify', description: 'Manage brand assets, guidelines and digital experience foundations.', url: 'https://www.frontify.com/en/', category: 'Platforms', label: 'Brand platform' },
  { title: 'Backlight', description: 'Build and publish design systems with code, documentation and collaboration.', url: 'https://backlight.dev/', category: 'Platforms', label: 'Platform' },
  { title: 'Figmayo', description: 'Publish a design system directly from Figma.', url: 'https://www.figmayo.com/', category: 'Platforms', label: 'Figma' },

  { title: 'Stark', description: 'Accessibility tooling and workflows for design and engineering teams.', url: 'https://www.getstark.co/', category: 'Accessibility & metrics', label: 'Accessibility' },
  { title: 'Randoma11y', description: 'Discover and preview accessible foreground and background combinations.', url: 'https://randoma11y.com/', category: 'Accessibility & metrics', label: 'Contrast' },
  { title: 'Usecontrast', description: 'A focused contrast-checking tool for accessible color pairs.', url: 'https://usecontrast.com/', category: 'Accessibility & metrics', label: 'Contrast' },
  { title: 'Able', description: 'A friction-free accessibility plugin for checking color combinations.', url: 'https://www.figma.com/community/plugin/734693888346260052/able-friction-free-accessibility', category: 'Accessibility & metrics', label: 'Figma plugin' },
  { title: 'Omlet', description: 'Measure component usage across repositories to understand system adoption.', url: 'https://omlet.dev/?utm_campaign=partner_dsg_resources', category: 'Accessibility & metrics', label: 'Analytics' },

  { title: 'Component Gallery', description: 'Compare common interface components across mature design systems.', url: 'https://component.gallery/?ref=thedesignsystemguide', category: 'Patterns & libraries', label: 'Reference' },
  { title: 'Design Systems Directory', description: 'Search design system documentation and principles across the web.', url: 'https://www.designprinciplesftw.com/', category: 'Patterns & libraries', label: 'Directory' },
  { title: 'Design Principles Collection', description: 'A regularly updated collection of product and interface principles.', url: 'https://www.designprinciplesftw.com/', category: 'Patterns & libraries', label: 'Reference' },
  { title: 'Cabana for Figma', description: 'A broad Figma UI kit for building consistent product screens.', url: 'https://cabana-for-figma.lemonsqueezy.com/?aff=yOEjJ', category: 'Patterns & libraries', label: 'UI kit' },
  { title: 'Tailwind UI', description: 'Production-ready interface patterns and components for Tailwind CSS.', url: 'https://tailwindui.com/', category: 'Patterns & libraries', label: 'UI library' },
  { title: 'UIPrep', description: 'A comprehensive design-system UI kit for Figma.', url: 'https://www.uiprep.com/design-system-ui-kit-for-figma?ref=thedesignsystem.guide', category: 'Patterns & libraries', label: 'UI kit' },
  { title: 'Ant Design', description: 'A comprehensive enterprise UI system with token-driven theming.', url: 'https://ant.design/', category: 'Patterns & libraries', label: 'React' },
  { title: 'Practical UI', description: 'A practical starter kit for building polished interfaces and reusable patterns.', url: 'https://www.practical-ui.com/', category: 'Patterns & libraries', label: 'UI kit' },
  { title: 'KickstartDS', description: 'An open-source starter kit for building and operating design systems.', url: 'https://www.kickstartds.com/', category: 'Patterns & libraries', label: 'Open source' },
  { title: 'Wanda', description: 'An open-source design system for digital experiences.', url: 'https://design.wonderflow.ai/', category: 'Patterns & libraries', label: 'Open source' },
  { title: 'Flowbite Design System', description: 'A free and open-source Figma component library.', url: 'https://www.figma.com/community/file/1179442320711977498', category: 'Patterns & libraries', label: 'Figma library' },
  { title: 'Mantine', description: 'A React component library with accessible primitives and hooks.', url: 'https://mantine.dev/', category: 'Patterns & libraries', label: 'React' },
  { title: 'Grommet', description: 'A React-based component framework with accessible, responsive patterns.', url: 'https://v2.grommet.io/', category: 'Patterns & libraries', label: 'React' },
  { title: 'Quasar', description: 'A Vue-based framework for building responsive web and mobile interfaces.', url: 'https://quasar.dev/docs', category: 'Patterns & libraries', label: 'Vue' },
  { title: 'Smooth UI', description: 'A React UI library and component patterns.', url: 'https://github.com/smooth-code/smooth-ui', category: 'Patterns & libraries', label: 'React' },
  { title: 'Base Web', description: 'Explore a customizable component system and usage analytics.', url: 'https://baseweb.design/', category: 'Patterns & libraries', label: 'React' },
  { title: 'Reach UI', description: 'Accessible React components and interaction patterns.', url: 'https://github.com/reach/reach-ui', category: 'Patterns & libraries', label: 'Accessibility' },
  { title: 'Radix Primitives', description: 'Unstyled, accessible primitives for building custom design systems.', url: 'https://www.radix-ui.com/', category: 'Patterns & libraries', label: 'Primitives' },
  { title: 'Styled System', description: 'Constraint-based style props for rapidly composing custom UI.', url: 'https://styled-system.com/', category: 'Patterns & libraries', label: 'CSS-in-JS' },
  { title: 'Reshaped', description: 'A design system and React component library paired with Figma.', url: 'https://reshaped.so/', category: 'Patterns & libraries', label: 'React + Figma' },
  { title: 'Detachless UI Kit', description: 'A component kit designed for Figma workflows.', url: 'https://detachless.com/figma-ui-kit', category: 'Patterns & libraries', label: 'Figma library' },
  { title: 'Opior Design System', description: 'A Figma-based UI kit and reusable design system.', url: 'https://bit.ly/opior-design-system', category: 'Patterns & libraries', label: 'Figma library' },
  { title: 'Shaper', description: 'A playground for shaping interface styles and visual direction.', url: 'https://hihayk.github.io/shaper/', category: 'Patterns & libraries', label: 'Playground' },
  { title: 'React Scanner', description: 'Scan codebases to identify reusable React components.', url: 'https://github.com/moroshko/react-scanner', category: 'Patterns & libraries', label: 'Code analysis' },

  { title: 'Design That Scales', description: 'Dan Mall on creating a sustainable design-system practice.', url: 'https://designsystem.university/books/design-that-scales', category: 'Books & practice', label: 'Book' },
  { title: 'Laying the Foundations', description: 'A systematic guide to designing, documenting and maintaining websites.', url: 'https://layingthefoundationsbook.com/', category: 'Books & practice', label: 'Book' },
  { title: 'Atomic Design', description: 'Brad Frost’s methodology for building robust interface systems.', url: 'https://atomicdesign.bradfrost.com/', category: 'Books & practice', label: 'Book' },
  { title: 'A Practical Guide to Design System Components', description: 'A four-part guide to creating and maintaining reusable components.', url: 'https://redesigningdesign.systems/resources.html', category: 'Books & practice', label: 'Guide' },
  { title: 'Design Systems Handbook', description: 'Planning, designing, building and implementing design systems as a team.', url: 'https://www.designbetter.co/design-systems-handbook', category: 'Books & practice', label: 'Book' },
  { title: 'Continuous Discovery Habits', description: 'Teresa Torres on a structured, continuous product discovery practice.', url: 'https://www.producttalk.org/continuous-discovery-habits/', category: 'Books & practice', label: 'Book' },
  { title: 'Design System Report', description: 'A DesignOps perspective on design-system practice and investment.', url: 'https://www.uxpin.com/studio/ebooks/designops-design-system-report/', category: 'Books & practice', label: 'Report' }
];

export const resourceCategories = [...new Set(resources.map((resource) => resource.category))];
