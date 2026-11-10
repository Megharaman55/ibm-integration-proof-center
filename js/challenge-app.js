/**
 * IBM Integration Proof Center - Core Application Controller
 * Handles interactive prototype state, navigation, simulations, and Carbon UI components.
 */

(function () {
  'use strict';

  // Application State
  const state = {
    currentView: 'home', // 'home' | 'dev-proof' | 'modernization' | 'ai-governance' | 'leadership'
    previousScrollY: 0,
    devProof: {
      currentStep: 1,
      selectedScenarioId: 'erp-order-api-agent',
      selectedCriteria: ['functional-correctness', 'test-coverage', 'rework-rate', 'maintainability', 'dev-time'],
      customContextText: ''
    },
    modernization: {
      currentStep: 1,
      selectedProfileId: 'global-supply-chain',
      selectedCategory: 'all'
    },
    aiGov: {
      currentStep: 1,
      currentMode: 'permitted', // 'permitted' | 'approval' | 'blocked'
      policies: {
        'token-auth': true,
        'schema-validation': true,
        'pii-masking': true,
        'rbac-check': true,
        'approval-gate': true
      },
      simulationState: 'idle'
    },
    activeDeploymentTab: 'saas',
    connectorsFilter: 'all',
    connectorsSearch: ''
  };

  // Helper DOM Selectors
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);

  // Initialize Application
  document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initHeroCTAs();
    initDeploymentTabs();
    initConnectorsCatalog();
    initDevProofExperience();
    initModernizationExperience();
    initAiGovExperience();
    initLeadershipView();
    initModals();
  });

  // ----------------------------------------------------
  // Global Navigation & View Switcher
  // ----------------------------------------------------
  function switchView(viewName, targetAnchor) {
    const homeView = $('#view-home');
    const devProofView = $('#view-dev-proof');
    const modernizationView = $('#view-modernization');
    const aiGovView = $('#view-ai-gov');
    const leadershipView = $('#view-leadership');

    // Hide all views
    [homeView, devProofView, modernizationView, aiGovView, leadershipView].forEach(v => {
      if (v) v.style.display = 'none';
    });

    state.currentView = viewName;

    // Show target view
    if (viewName === 'home') {
      homeView.style.display = 'block';
      if (targetAnchor) {
        const el = $(targetAnchor);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: state.previousScrollY || 0, behavior: 'smooth' });
      }
    } else if (viewName === 'dev-proof') {
      state.previousScrollY = window.scrollY;
      devProofView.style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'instant' });
      renderDevProofStep(state.devProof.currentStep);
    } else if (viewName === 'modernization') {
      state.previousScrollY = window.scrollY;
      modernizationView.style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'instant' });
      renderModernizationStep(state.modernization.currentStep);
    } else if (viewName === 'ai-governance') {
      state.previousScrollY = window.scrollY;
      aiGovView.style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'instant' });
      renderAiGovSimulation();
    } else if (viewName === 'leadership') {
      state.previousScrollY = window.scrollY;
      leadershipView.style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }

  function initNavigation() {
    // Leadership View Banner & Masthead triggers
    $$('.js-open-leadership').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        switchView('leadership');
      });
    });

    $$('.js-back-to-home').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        switchView('home', '#proof-offers');
      });
    });

    // Masthead in-page anchor links
    $$('.ibm-masthead__nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          if (state.currentView !== 'home') {
            switchView('home', href);
          } else {
            const target = $(href);
            if (target) target.scrollIntoView({ behavior: 'smooth' });
          }
          $$('.ibm-masthead__nav-link').forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      });
    });
  }

  // ----------------------------------------------------
  // Hero CTAs & Proof Offers Section
  // ----------------------------------------------------
  function initHeroCTAs() {
    const primaryHeroBtn = $('#hero-primary-cta');
    const secondaryHeroBtn = $('#hero-secondary-cta');

    if (primaryHeroBtn) {
      primaryHeroBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const proofSection = $('#proof-offers');
        if (proofSection) proofSection.scrollIntoView({ behavior: 'smooth' });
      });
    }

    if (secondaryHeroBtn) {
      secondaryHeroBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal('#modal-demo');
      });
    }

    // Connect Proof Card buttons
    const btnDevProof = $('#btn-explore-dev-proof');
    const btnModProof = $('#btn-explore-mod-proof');
    const btnAiProof = $('#btn-explore-ai-proof');

    if (btnDevProof) {
      btnDevProof.addEventListener('click', () => switchView('dev-proof'));
    }
    if (btnModProof) {
      btnModProof.addEventListener('click', () => switchView('modernization'));
    }
    if (btnAiProof) {
      btnAiProof.addEventListener('click', () => switchView('ai-governance'));
    }
  }

  // ----------------------------------------------------
  // SaaS vs Self-Managed Software Deployment Switcher
  // ----------------------------------------------------
  function initDeploymentTabs() {
    const tabBtns = $$('.js-deployment-tab');
    const saasContent = $('#deployment-saas-content');
    const softwareContent = $('#deployment-software-content');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const mode = btn.dataset.deployment;
        state.activeDeploymentTab = mode;

        if (mode === 'saas') {
          if (saasContent) saasContent.style.display = 'block';
          if (softwareContent) softwareContent.style.display = 'none';
        } else {
          if (saasContent) saasContent.style.display = 'none';
          if (softwareContent) softwareContent.style.display = 'block';
        }
      });
    });
  }

  // ----------------------------------------------------
  // Ecosystem & Connectors Catalog
  // ----------------------------------------------------
  function initConnectorsCatalog() {
    const container = $('#connectors-grid');
    const categoryBtns = $$('.js-connector-filter');
    const searchInput = $('#connector-search-input');

    function renderConnectors() {
      if (!container) return;
      const data = window.IBM_PROOF_DATA.connectors;
      const query = (state.connectorsSearch || '').toLowerCase();
      const cat = state.connectorsFilter;

      const filtered = data.filter(c => {
        const matchesCat = (cat === 'all') || (c.category.toLowerCase().includes(cat.toLowerCase()));
        const matchesQuery = !query || (c.name.toLowerCase().includes(query) || c.desc.toLowerCase().includes(query) || c.category.toLowerCase().includes(query));
        return matchesCat && matchesQuery;
      });

      if (filtered.length === 0) {
        container.innerHTML = `
          <div style="grid-column: 1 / -1; padding: 2rem; background: #ffffff; border: 1px dashed #8d8d8d; text-align: center;">
            <p style="color: #525252; margin-bottom: 0.5rem;">No matching pre-built smart connectors found for "<strong>${escapeHtml(query)}</strong>".</p>
            <p style="font-size: 0.8125rem; color: #8d8d8d;">IBM Bob can also help generate custom OpenAPI 3.0 and REST adapters on demand.</p>
          </div>
        `;
        return;
      }

      container.innerHTML = filtered.map(c => `
        <div class="cds-card">
          <div class="cds-card__header">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
              <span class="cds-tag ${c.badge === 'Certified' ? 'cds-tag--green' : c.badge === 'Core IBM' ? 'cds-tag--blue' : 'cds-tag--purple'}">${c.badge}</span>
              <span style="font-size: 0.75rem; color: #8d8d8d;">${c.category}</span>
            </div>
            <h4 class="cds-card__title" style="font-size: 1.125rem;">${c.name}</h4>
          </div>
          <p class="cds-card__body">${c.desc}</p>
          <div class="cds-card__footer">
            <span style="font-size: 0.75rem; color: #0f62fe; font-weight: 500;">Ready for agent-ready integration</span>
            <svg style="width: 14px; height: 14px; fill: #0f62fe;" viewBox="0 0 16 16"><path d="M9.3 3.3L8.6 4 12.1 7.5H2v1h10.1L8.6 12l.7.7 4.7-4.7z"/></svg>
          </div>
        </div>
      `).join('');
    }

    categoryBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        categoryBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        state.connectorsFilter = btn.dataset.category;
        renderConnectors();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.connectorsSearch = e.target.value.trim();
        renderConnectors();
      });
    }

    renderConnectors();
  }

  // ----------------------------------------------------
  // Offer 1: Integration Development Proof Experience
  // ----------------------------------------------------
  function initDevProofExperience() {
    const scenarios = window.IBM_PROOF_DATA.devProof.scenarios;
    const allCriteria = window.IBM_PROOF_DATA.devProof.allCriteria;

    // Render Scenario Selector Cards
    const scenarioCardsContainer = $('#dev-scenarios-container');
    if (scenarioCardsContainer) {
      scenarioCardsContainer.innerHTML = scenarios.map(sc => `
        <div class="selector-card ${sc.id === state.devProof.selectedScenarioId ? 'is-selected' : ''}" data-scenario-id="${sc.id}">
          <div class="selector-card__check">
            <svg style="width: 12px; height: 12px; fill: currentColor;" viewBox="0 0 16 16"><path d="M6.5 12.5L2 8l1.4-1.4 3.1 3.1 6.5-6.5L14.4 4.6z"/></svg>
          </div>
          <span class="cds-tag cds-tag--blue" style="margin-bottom: 0.5rem;">${sc.product}</span>
          <h4 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem;">${sc.name}</h4>
          <p style="font-size: 0.8125rem; color: #525252; margin-bottom: 0.75rem;">${sc.summary}</p>
          <div style="font-size: 0.75rem; color: #8d8d8d; border-top: 1px solid #e0e0e0; padding-top: 0.5rem;">
            <strong>Context:</strong> ${sc.sourceSystem} &rarr; ${sc.targetSystem}
          </div>
        </div>
      `).join('');

      scenarioCardsContainer.querySelectorAll('.selector-card').forEach(card => {
        card.addEventListener('click', () => {
          scenarioCardsContainer.querySelectorAll('.selector-card').forEach(c => c.classList.remove('is-selected'));
          card.classList.add('is-selected');
          const scId = card.dataset.scenarioId;
          state.devProof.selectedScenarioId = scId;
          updateDevProofScenarioDetails(scId);
        });
      });
    }

    // Render Criteria Checkbox Options
    const criteriaContainer = $('#dev-criteria-container');
    if (criteriaContainer) {
      criteriaContainer.innerHTML = allCriteria.map(crit => {
        const isChecked = state.devProof.selectedCriteria.includes(crit.id);
        return `
          <label style="display: flex; align-items: flex-start; gap: 0.75rem; padding: 1rem; border: 1px solid #e0e0e0; background: #ffffff; cursor: pointer; transition: border-color 0.15s ease;">
            <input type="checkbox" class="js-criteria-checkbox" value="${crit.id}" ${isChecked ? 'checked' : ''} style="margin-top: 3px; accent-color: #0f62fe;">
            <div>
              <div style="font-weight: 600; font-size: 0.875rem; color: #161616; margin-bottom: 0.25rem;">${crit.name}</div>
              <div style="font-size: 0.8125rem; color: #525252;">${crit.desc}</div>
            </div>
          </label>
        `;
      }).join('');

      criteriaContainer.querySelectorAll('.js-criteria-checkbox').forEach(cb => {
        cb.addEventListener('change', () => {
          const selected = [];
          criteriaContainer.querySelectorAll('.js-criteria-checkbox:checked').forEach(c => selected.push(c.value));
          state.devProof.selectedCriteria = selected;
          renderDevProofScorecard();
        });
      });
    }

    // Step Navigation
    $$('.js-dev-step-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const step = parseInt(btn.dataset.step, 10);
        goToDevProofStep(step);
      });
    });

    $$('.js-dev-next').forEach(btn => {
      btn.addEventListener('click', () => {
        if (state.devProof.currentStep < 5) {
          goToDevProofStep(state.devProof.currentStep + 1);
        }
      });
    });

    $$('.js-dev-prev').forEach(btn => {
      btn.addEventListener('click', () => {
        if (state.devProof.currentStep > 1) {
          goToDevProofStep(state.devProof.currentStep - 1);
        }
      });
    });

    // Simulated Submission Button
    const btnSubmitDevProof = $('#btn-submit-dev-proof');
    if (btnSubmitDevProof) {
      btnSubmitDevProof.addEventListener('click', () => {
        openModal('#modal-proof-submitted', {
          title: 'Agent-Ready Estate Proof Plan Recorded',
          offer: 'Use Case 1: Make Your Integration Estate Agent-Ready',
          summary: `Selected Capability: "${getCurrentDevScenario().name}" with ${state.devProof.selectedCriteria.length} success criteria.`
        });
      });
    }

    updateDevProofScenarioDetails(state.devProof.selectedScenarioId);
  }

  function getCurrentDevScenario() {
    return window.IBM_PROOF_DATA.devProof.scenarios.find(s => s.id === state.devProof.selectedScenarioId) || window.IBM_PROOF_DATA.devProof.scenarios[0];
  }

  function updateDevProofScenarioDetails(scId) {
    const sc = getCurrentDevScenario();
    const promptPreview = $('#dev-prompt-preview');
    const payloadPreview = $('#dev-payload-preview');
    const sourceTargetBadge = $('#dev-source-target-badge');

    if (promptPreview) promptPreview.textContent = sc.sampleInputPrompt;
    if (payloadPreview) payloadPreview.textContent = sc.samplePayload;
    if (sourceTargetBadge) sourceTargetBadge.textContent = `${sc.sourceSystem} ➔ ${sc.targetSystem}`;

    renderDevProofScorecard();
  }

  function goToDevProofStep(stepNum) {
    state.devProof.currentStep = stepNum;
    renderDevProofStep(stepNum);
  }

  function renderDevProofStep(stepNum) {
    // Update step indicator items
    $$('#dev-step-indicators .step-indicator-item').forEach(item => {
      const step = parseInt(item.dataset.step, 10);
      item.classList.remove('is-active', 'is-completed');
      if (step === stepNum) {
        item.classList.add('is-active');
      } else if (step < stepNum) {
        item.classList.add('is-completed');
      }
    });

    // Show active panel
    $$('#dev-proof-panels .step-panel').forEach(panel => {
      panel.classList.remove('is-active');
    });
    const targetPanel = $(`#dev-panel-step-${stepNum}`);
    if (targetPanel) targetPanel.classList.add('is-active');

    if (stepNum === 5) {
      renderDevProofScorecard();
    }
  }

  function renderDevProofScorecard() {
    const sc = getCurrentDevScenario();
    const container = $('#dev-scorecard-table-body');
    if (!container) return;

    const allCrit = window.IBM_PROOF_DATA.devProof.allCriteria;
    const selectedIds = state.devProof.selectedCriteria;

    if (selectedIds.length === 0) {
      container.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #8d8d8d; padding: 2rem;">Please select at least one success criterion in Step 3.</td></tr>`;
      return;
    }

    container.innerHTML = selectedIds.map(critId => {
      const critObj = allCrit.find(c => c.id === critId);
      const metric = sc.metrics[critId] || { label: critObj.name, value: 'Validation to be conducted', baseline: 'Manual baseline', status: 'pass' };

      return `
        <tr>
          <td>
            <div style="font-weight: 600; color: #161616;">${critObj.name}</div>
            <div style="font-size: 0.75rem; color: #8d8d8d; margin-top: 2px;">${critObj.desc}</div>
          </td>
          <td>
            <div style="font-weight: 600; color: #0043ce; font-family: var(--font-mono);">${metric.value}</div>
            <span class="cds-tag cds-tag--green" style="margin-top: 4px; font-size: 0.6875rem;">Illustrative Benchmark</span>
          </td>
          <td style="color: #525252; font-size: 0.8125rem;">
            ${metric.baseline}
          </td>
          <td>
            <span class="cds-tag cds-tag--blue">Target: Verified</span>
          </td>
        </tr>
      `;
    }).join('');
  }

  // ----------------------------------------------------
  // Offer 2: Consolidation & Modernization Assessment
  // ----------------------------------------------------
  function initModernizationExperience() {
    const profiles = window.IBM_PROOF_DATA.modernizationAssessment.profiles;

    // Render Profiles
    const profileContainer = $('#mod-profiles-container');
    if (profileContainer) {
      profileContainer.innerHTML = profiles.map(p => `
        <div class="selector-card ${p.id === state.modernization.selectedProfileId ? 'is-selected' : ''}" data-profile-id="${p.id}">
          <div class="selector-card__check">
            <svg style="width: 12px; height: 12px; fill: currentColor;" viewBox="0 0 16 16"><path d="M6.5 12.5L2 8l1.4-1.4 3.1 3.1 6.5-6.5L14.4 4.6z"/></svg>
          </div>
          <span class="cds-tag cds-tag--purple" style="margin-bottom: 0.5rem;">Sample Estate Profile</span>
          <h4 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem;">${p.name}</h4>
          <p style="font-size: 0.8125rem; color: #525252; margin-bottom: 0.75rem;">${p.estateSummary}</p>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; font-size: 0.75rem;">
            <span class="cds-tag cds-tag--gray">Total: ${p.totalIntegrations} Assets</span>
            <span class="cds-tag cds-tag--blue">APIs: ${p.categories.appApi}</span>
            <span class="cds-tag cds-tag--yellow">B2B: ${p.categories.b2bEdi}</span>
            <span class="cds-tag cds-tag--green">MFT: ${p.categories.mft}</span>
          </div>
        </div>
      `).join('');

      profileContainer.querySelectorAll('.selector-card').forEach(card => {
        card.addEventListener('click', () => {
          profileContainer.querySelectorAll('.selector-card').forEach(c => c.classList.remove('is-selected'));
          card.classList.add('is-selected');
          const pId = card.dataset.profileId;
          state.modernization.selectedProfileId = pId;
          updateModernizationProfile(pId);
        });
      });
    }

    // Step Navigation
    $$('.js-mod-step-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const step = parseInt(btn.dataset.step, 10);
        goToModStep(step);
      });
    });

    $$('.js-mod-next').forEach(btn => {
      btn.addEventListener('click', () => {
        if (state.modernization.currentStep < 5) {
          goToModStep(state.modernization.currentStep + 1);
        }
      });
    });

    $$('.js-mod-prev').forEach(btn => {
      btn.addEventListener('click', () => {
        if (state.modernization.currentStep > 1) {
          goToModStep(state.modernization.currentStep - 1);
        }
      });
    });

    // Inventory category filters
    $$('.js-mod-cat-filter').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('.js-mod-cat-filter').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        state.modernization.selectedCategory = btn.dataset.category;
        renderModInventoryTable();
      });
    });

    // Simulated Submission Button
    const btnSubmitMod = $('#btn-submit-mod-proof');
    if (btnSubmitMod) {
      btnSubmitMod.addEventListener('click', () => {
        openModal('#modal-proof-submitted', {
          title: 'Unified Foundation Blueprint Recorded',
          offer: 'Use Case 2: Unify Your Integration Foundation for AI',
          summary: `Selected Estate Profile: "${getCurrentModProfile().name}". Unified foundation blueprint generated.`
        });
      });
    }

    updateModernizationProfile(state.modernization.selectedProfileId);
  }

  function getCurrentModProfile() {
    return window.IBM_PROOF_DATA.modernizationAssessment.profiles.find(p => p.id === state.modernization.selectedProfileId) || window.IBM_PROOF_DATA.modernizationAssessment.profiles[0];
  }

  function updateModernizationProfile(pId) {
    const prof = getCurrentModProfile();

    // Update Step 4 findings
    const findingsContainer = $('#mod-findings-cards');
    if (findingsContainer) {
      findingsContainer.innerHTML = `
        <div class="cds-card">
          <div class="cds-card__header">
            <span class="cds-tag cds-tag--green" style="margin-bottom: 0.25rem;">Modernization Opportunity</span>
            <h4 class="cds-card__title">Potential Reuse & Consolidation</h4>
          </div>
          <p class="cds-card__body">${prof.findings.reuseOpportunities}</p>
        </div>
        <div class="cds-card">
          <div class="cds-card__header">
            <span class="cds-tag cds-tag--yellow" style="margin-bottom: 0.25rem;">Critical Dependency</span>
            <h4 class="cds-card__title">Core System Hybrid Bridges</h4>
          </div>
          <p class="cds-card__body">${prof.findings.dependencies}</p>
        </div>
        <div class="cds-card">
          <div class="cds-card__header">
            <span class="cds-tag cds-tag--blue" style="margin-bottom: 0.25rem;">Candidate Workloads</span>
            <h4 class="cds-card__title">Cloud Migration Priority</h4>
          </div>
          <p class="cds-card__body">${prof.findings.modernizationCandidates}</p>
        </div>
        <div class="cds-card">
          <div class="cds-card__header">
            <span class="cds-tag cds-tag--purple" style="margin-bottom: 0.25rem;">Governance & Resilience</span>
            <h4 class="cds-card__title">Zero-Downtime & DR Plan</h4>
          </div>
          <p class="cds-card__body">${prof.findings.resilienceScore}</p>
        </div>
      `;
    }

    // Update Step 5 Roadmap
    const roadmapContainer = $('#mod-roadmap-container');
    if (roadmapContainer) {
      roadmapContainer.innerHTML = prof.roadmap.map((r, i) => `
        <div style="display: flex; gap: 1.5rem; margin-bottom: 1.5rem; position: relative;">
          <div style="display: flex; flex-direction: column; align-items: center;">
            <div style="width: 32px; height: 32px; background: #0f62fe; color: #fff; font-weight: 600; display: flex; align-items: center; justify-content: center; font-size: 0.875rem;">${i + 1}</div>
            ${i < prof.roadmap.length - 1 ? '<div style="width: 2px; flex: 1; background: #e0e0e0; margin-top: 4px;"></div>' : ''}
          </div>
          <div style="flex: 1; background: #f4f4f4; border: 1px solid #e0e0e0; padding: 1.25rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
              <h4 style="font-size: 1.125rem; font-weight: 600; color: #161616;">${r.phase}</h4>
              <span class="cds-tag cds-tag--blue">${r.timeline}</span>
            </div>
            <p style="font-size: 0.875rem; color: #525252; margin: 0;">${r.scope}</p>
          </div>
        </div>
      `).join('');
    }

    renderModInventoryTable();
  }

  function goToModStep(stepNum) {
    state.modernization.currentStep = stepNum;
    renderModernizationStep(stepNum);
  }

  function renderModernizationStep(stepNum) {
    $$('#mod-step-indicators .step-indicator-item').forEach(item => {
      const step = parseInt(item.dataset.step, 10);
      item.classList.remove('is-active', 'is-completed');
      if (step === stepNum) {
        item.classList.add('is-active');
      } else if (step < stepNum) {
        item.classList.add('is-completed');
      }
    });

    $$('#mod-proof-panels .step-panel').forEach(panel => {
      panel.classList.remove('is-active');
    });
    const targetPanel = $(`#mod-panel-step-${stepNum}`);
    if (targetPanel) targetPanel.classList.add('is-active');

    if (stepNum === 3) {
      renderModInventoryTable();
    }
  }

  function renderModInventoryTable() {
    const prof = getCurrentModProfile();
    const container = $('#mod-inventory-table-body');
    if (!container) return;

    const cat = state.modernization.selectedCategory;
    const items = prof.inventory.filter(item => {
      if (cat === 'all') return true;
      if (cat === 'api') return item.category.includes('Application');
      if (cat === 'b2b') return item.category.includes('B2B');
      if (cat === 'mft') return item.category.includes('Managed');
      if (cat === 'events') return item.category.includes('Events');
      return true;
    });

    container.innerHTML = items.map(it => `
      <tr>
        <td>
          <div style="font-weight: 600; color: #161616;">${it.name}</div>
          <div style="font-size: 0.75rem; color: #8d8d8d;">${it.category}</div>
        </td>
        <td style="font-family: var(--font-mono); font-size: 0.8125rem;">${it.protocol}</td>
        <td>${it.volume}</td>
        <td>
          <span class="cds-tag ${it.complexity === 'Critical' ? 'cds-tag--red' : it.complexity === 'High' ? 'cds-tag--yellow' : 'cds-tag--green'}">${it.complexity}</span>
        </td>
        <td>
          <span style="font-size: 0.8125rem; color: #161616;">${it.reuse}</span>
        </td>
        <td>
          <span class="cds-tag cds-tag--blue">${it.modernizationPriority}</span>
        </td>
      </tr>
    `).join('');
  }

  // ----------------------------------------------------
  // Offer 3: Governed AI Integration Proof Experience
  // ----------------------------------------------------
  function initAiGovExperience() {
    const modeButtons = $$('.js-ai-mode-btn');
    modeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        modeButtons.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        state.aiGov.currentMode = btn.dataset.mode;
        renderAiGovSimulation();
      });
    });

    // Guardrail Checkboxes
    $$('.js-ai-policy-toggle').forEach(chk => {
      chk.addEventListener('change', () => {
        const policyId = chk.value;
        state.aiGov.policies[policyId] = chk.checked;
        renderAiGovSimulation();
      });
    });

    // Trigger run simulation button
    const btnRunSim = $('#btn-run-ai-simulation');
    if (btnRunSim) {
      btnRunSim.addEventListener('click', () => {
        renderAiGovSimulation(true);
      });
    }

    // Step Navigation
    $$('.js-aigov-step-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const step = parseInt(btn.dataset.step, 10);
        goToAiGovStep(step);
      });
    });

    $$('.js-aigov-next').forEach(btn => {
      btn.addEventListener('click', () => {
        if (state.aiGov.currentStep < 5) {
          goToAiGovStep(state.aiGov.currentStep + 1);
        }
      });
    });

    $$('.js-aigov-prev').forEach(btn => {
      btn.addEventListener('click', () => {
        if (state.aiGov.currentStep > 1) {
          goToAiGovStep(state.aiGov.currentStep - 1);
        }
      });
    });

    // Simulated Submission Button
    const btnSubmitAi = $('#btn-submit-ai-proof');
    if (btnSubmitAi) {
      btnSubmitAi.addEventListener('click', () => {
        openModal('#modal-proof-submitted', {
          title: 'Secure & Governed AI Interactions Plan Recorded',
          offer: 'Use Case 3: Secure and Govern Enterprise AI Interactions',
          summary: 'Simulated runtime policy evaluation completed across DataPower Interact Gateway, IBM Integration and API Connect.'
        });
      });
    }

    renderAiGovSimulation();
  }

  function goToAiGovStep(stepNum) {
    state.aiGov.currentStep = stepNum;
    renderAiGovStep(stepNum);
  }

  function renderAiGovStep(stepNum) {
    $$('#aigov-step-indicators .step-indicator-item').forEach(item => {
      const step = parseInt(item.dataset.step, 10);
      item.classList.remove('is-active', 'is-completed');
      if (step === stepNum) {
        item.classList.add('is-active');
      } else if (step < stepNum) {
        item.classList.add('is-completed');
      }
    });

    $$('#aigov-proof-panels .step-panel').forEach(panel => {
      panel.classList.remove('is-active');
    });
    const targetPanel = $(`#aigov-panel-step-${stepNum}`);
    if (targetPanel) targetPanel.classList.add('is-active');

    if (stepNum === 3 || stepNum === 4) {
      renderAiGovSimulation();
    }
  }

  function renderAiGovSimulation(animate = false) {
    const modeKey = state.aiGov.currentMode;
    const modeData = window.IBM_PROOF_DATA.aiGovProof.actionModes[modeKey];
    if (!modeData) return;

    // Update Status Badge
    const badgeEl = $('#sim-status-badge');
    if (badgeEl) {
      badgeEl.className = `cds-tag ${modeData.badgeType === 'green' ? 'cds-tag--green' : modeData.badgeType === 'yellow' ? 'cds-tag--yellow' : 'cds-tag--red'}`;
      badgeEl.textContent = modeData.badge;
    }

    const titleEl = $('#sim-mode-title');
    if (titleEl) titleEl.textContent = modeData.title;

    const descEl = $('#sim-mode-desc');
    if (descEl) descEl.textContent = modeData.description;

    // Render Event Timeline
    const timelineContainer = $('#sim-timeline-container');
    if (timelineContainer) {
      timelineContainer.innerHTML = modeData.steps.map((st, idx) => `
        <div class="timeline-event event--${st.status}">
          <div class="timeline-event__time">${st.time}</div>
          <div class="timeline-event__actor">
            <span>${st.actor}</span>
            <div style="font-size: 0.6875rem; color: #525252; font-weight: normal;">${st.action}</div>
          </div>
          <div class="timeline-event__detail">
            ${st.detail}
            ${st.status === 'warn' && modeKey === 'approval' && idx === 3 ? `
              <div style="margin-top: 0.5rem; display: flex; gap: 0.5rem; align-items: center;">
                <button class="cds-btn cds-btn--sm cds-btn--primary" onclick="alert('Synthetic Action Approved: Simulated workflow task #APRV-8812 marked AUTHORIZED. No live ERP mutation executed.');">
                  Authorize Re-Route ($4,200)
                </button>
                <button class="cds-btn cds-btn--sm cds-btn--secondary" onclick="alert('Synthetic Action Rejected: Request aborted.');">
                  Decline &amp; Hold
                </button>
              </div>
            ` : ''}
          </div>
        </div>
      `).join('');
    }

    // Render Audit Payload Box
    const auditBox = $('#sim-audit-payload-json');
    if (auditBox) {
      auditBox.textContent = JSON.stringify(modeData.auditPayload, null, 2);
    }
  }

  // ----------------------------------------------------
  // Leadership View Interactivity
  // ----------------------------------------------------
  function initLeadershipView() {
    const funnelSliders = $$('.js-funnel-slider');
    funnelSliders.forEach(slider => {
      slider.addEventListener('input', () => {
        updateFunnelSimulation();
      });
    });

    updateFunnelSimulation();
  }

  function updateFunnelSimulation() {
    const trafficInput = $('#slider-traffic');
    const optInInput = $('#slider-optin');
    const qualInput = $('#slider-qual');

    if (!trafficInput || !optInInput || !qualInput) return;

    const traffic = parseInt(trafficInput.value, 10);
    const optInRate = parseFloat(optInInput.value) / 100;
    const qualRate = parseFloat(qualInput.value) / 100;

    $('#val-traffic').textContent = traffic.toLocaleString();
    $('#val-optin').textContent = (optInRate * 100).toFixed(0) + '%';
    $('#val-qual').textContent = (qualRate * 100).toFixed(0) + '%';

    const proofStarts = Math.round(traffic * optInRate);
    const completedProofs = Math.round(proofStarts * 0.52);
    const qualifiedOpps = Math.round(completedProofs * qualRate);
    const scopedEngagements = Math.round(qualifiedOpps * 0.28);

    $('#sim-proof-starts').textContent = proofStarts.toLocaleString();
    $('#sim-completed-proofs').textContent = completedProofs.toLocaleString();
    $('#sim-qualified-opps').textContent = qualifiedOpps.toLocaleString();
    $('#sim-scoped-engagements').textContent = scopedEngagements.toLocaleString();
  }

  // ----------------------------------------------------
  // Modals & Dialogs
  // ----------------------------------------------------
  function initModals() {
    // Close button triggers
    $$('.js-modal-close').forEach(btn => {
      btn.addEventListener('click', () => {
        closeAllModals();
      });
    });

    // Close on backdrop click
    $$('.cds-modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          closeAllModals();
        }
      });
    });

    // Demo Form Simulated Submit
    const demoForm = $('#form-book-demo');
    if (demoForm) {
      demoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        closeAllModals();
        openModal('#modal-proof-submitted', {
          title: 'Live Demo Request Simulation',
          offer: 'IBM Integration Live Demonstration',
          summary: 'Your demonstration request has been simulated for this prototype. In a live environment, an IBM Integration technical specialist would coordinate a customized session.'
        });
      });
    }
  }

  function openModal(modalSelector, customData = {}) {
    const modal = $(modalSelector);
    if (!modal) return;

    if (customData.title) {
      const t = modal.querySelector('.js-modal-dynamic-title');
      if (t) t.textContent = customData.title;
    }
    if (customData.offer) {
      const o = modal.querySelector('.js-modal-dynamic-offer');
      if (o) o.textContent = customData.offer;
    }
    if (customData.summary) {
      const s = modal.querySelector('.js-modal-dynamic-summary');
      if (s) s.textContent = customData.summary;
    }

    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeAllModals() {
    $$('.cds-modal-overlay').forEach(m => m.classList.remove('is-open'));
    document.body.style.overflow = '';
  }

  // Utility
  function escapeHtml(text) {
    if (!text) return '';
    return text.replace(/&/g, "&amp;")
               .replace(/</g, "&lt;")
               .replace(/>/g, "&gt;")
               .replace(/"/g, "&quot;")
               .replace(/'/g, "&#039;");
  }

  // Expose global methods for inline HTML event bindings if needed
  window.switchView = switchView;
  window.openModal = openModal;
  window.closeAllModals = closeAllModals;

})();
