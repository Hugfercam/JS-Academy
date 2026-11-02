import { enhanceEditor } from './editor.js';
import { runCode } from './runner.js';
import { renderFeedback } from './feedback.js';

export function renderGuidedPage({ id, stageIndex, guidedPractices, shell, heading, escape, progress, persist, isCurrent }) {
  progress.guided = progress.guided || {};

  // Vista 1: Selector de prácticas guiadas
  if (!id) {
    shell('guiada', heading('PRÁCTICA GUIADA', 'Aprende paso a paso.', 'Ejercicios completos divididos en pequeñas etapas. Avanza a tu ritmo con pistas pedagógicas.') + `
      <section class="topic-grid">
        ${guidedPractices.map((p, pIdx) => {
          const state = progress.guided[p.id] || { unlockedStage: 0, completed: false, stages: {} };
          const completedCount = p.stages.filter(s => state.stages[s.id]?.completed).length;
          const isDone = state.completed || completedCount === p.stages.length;
          const activeIndex = Math.min(state.unlockedStage || 0, p.stages.length - 1);
          return `
            <a class="panel topic guided-card" href="#/guiada/${p.id}/${activeIndex}">
              <div class="guided-card-header">
                <span class="pill">${isDone ? '✓ COMPLETADA' : completedCount > 0 ? `EN CURSO · ${completedCount}/${p.stages.length}` : 'NUEVA'}</span>
                <span class="topic-number">${String(pIdx + 1).padStart(2, '0')}</span>
              </div>
              <h2>${escape(p.title)}</h2>
              <p>${escape(p.description)}</p>
              ${p.recommendedBefore ? `<p class="subtle" style="color: var(--primary, #4f46e5); font-weight: 500;">💡 Recomendado: haber completado «${escape(p.recommendedBeforeTitle || 'la práctica previa')}»</p>` : ''}
              <div class="guided-parts-preview">
                ${p.parts.map(part => `<span class="part-tag">${escape(part.title)}</span>`).join('')}
              </div>
              <p class="subtle">${p.stages.length} etapas progresivas · Pistas en 3 niveles · Evaluación síncrona</p>
              <b>${isDone ? 'Repasar práctica →' : completedCount > 0 ? `Continuar en etapa ${activeIndex + 1} →` : 'Comenzar práctica →'}</b>
            </a>
          `;
        }).join('')}
      </section>
    `);
    return null;
  }

  const practice = guidedPractices.find(p => p.id === id);
  if (!practice) {
    location.hash = '#/guiada';
    return null;
  }

  // Inicializar estado de la práctica si no existe
  progress.guided[practice.id] = progress.guided[practice.id] || {
    currentStage: 0,
    unlockedStage: 0,
    completed: false,
    stages: {}
  };
  const practiceState = progress.guided[practice.id];
  practiceState.stages = practiceState.stages || {};

  // Vista 2: Pantalla de finalización / resumen de práctica
  if (stageIndex === 'resumen') {
    const totalAttempts = Object.values(practiceState.stages).reduce((sum, s) => sum + (s.attempts || 0), 0);
    const hintsCount = Object.values(practiceState.stages).reduce((sum, s) => sum + (s.hintsRevealed || 0), 0);
    const reviewRecommended = practice.stages.filter(s => {
      const st = practiceState.stages[s.id];
      return st && (st.hint3Consulted || (st.quizAttempts || 0) > 1);
    });

    shell('guiada', heading('¡PRÁCTICA COMPLETADA!', `Enhorabuena: ${escape(practice.title)}`, 'Has superado todas las etapas construyendo soluciones autónomas paso a paso.') + `
      <section class="panel guided-summary-panel">
        <div class="summary-hero">
          <span class="summary-badge">★</span>
          <h2>¡Objetivo conseguido!</h2>
          <p>${practice.summaryText || 'Has completado todas las etapas de la práctica y superado el desafío autónomo con éxito.'}</p>
        </div>
        <div class="stats">
          <div><span>✓</span><strong>${practice.stages.length}<small>etapas superadas</small></strong></div>
          <div><span>⌘</span><strong>${totalAttempts}<small>intentos de código</small></strong></div>
          <div><span>💡</span><strong>${hintsCount}<small>pistas consultadas</small></strong></div>
        </div>
        ${reviewRecommended.length > 0 ? `
          <div class="guided-review-box">
            <h3>💡 Recomendaciones de repaso formativo</h3>
            <p class="subtle">Has resuelto toda la práctica con tu propio código. Para afianzar la base en los conceptos donde consultaste ayudas interactivas, te sugerimos repasar:</p>
            <div class="guided-review-tags">
              ${reviewRecommended.map(s => {
                const st = practiceState.stages[s.id];
                const sIdx = practice.stages.indexOf(s);
                return `<a class="review-tag" href="#/guiada/${practice.id}/${sIdx}">
                  <strong>Etapa ${s.number}: ${escape(s.title)}</strong>
                  <span>${st.quizAttempts ? `${st.quizAttempts} intento(s) en test` : 'Pista interactiva consultada'}</span>
                </a>`;
              }).join('')}
            </div>
          </div>
        ` : ''}
        <div class="summary-actions">
          <a class="button dark" href="#/guiada/${practice.id}/0">Repasar desde el inicio →</a>
          <a class="button" href="#/guiada">Otras prácticas guiadas</a>
          <button id="reset-practice-btn" class="text-button" type="button">Reiniciar mi progreso en esta práctica</button>
        </div>
      </section>
    `);
    document.querySelector('#reset-practice-btn').onclick = () => {
      if (confirm('¿Seguro que deseas reiniciar tu progreso en esta práctica guiada? Se borrarán los borradores de las etapas.')) {
        progress.guided[practice.id] = { currentStage: 0, unlockedStage: 0, completed: false, stages: {} };
        persist();
        location.hash = `#/guiada/${practice.id}/0`;
      }
    };
    return null;
  }

  // Clampear índice de etapa a los límites y etapas desbloqueadas
  let idx = Number.isInteger(Number(stageIndex)) ? Number(stageIndex) : (practiceState.unlockedStage || 0);
  if (idx < 0) idx = 0;
  if (idx >= practice.stages.length) idx = practice.stages.length - 1;
  if (idx > practiceState.unlockedStage) {
    // Si intenta saltar a una etapa bloqueada, forzar a la máxima desbloqueada
    idx = practiceState.unlockedStage;
  }
  practiceState.currentStage = idx;

  const stage = practice.stages[idx];
  practiceState.stages[stage.id] = practiceState.stages[stage.id] || {
    draft: stage.starter,
    attempts: 0,
    passed: 0,
    total: stage.cases.length,
    hintsRevealed: 0,
    hint3Consulted: false,
    quizAttempts: 0,
    quizSelected: null,
    quizSolved: false,
    quizChecked: false,
    solutionRevealed: false,
    completed: false
  };
  const stageState = practiceState.stages[stage.id];

  // Renderizar la vista de la etapa
  const percent = Math.round(((idx + (stageState.completed ? 1 : 0)) / practice.stages.length) * 100);

  shell('guiada', `
    <div class="guided-header">
      <a class="text-link" href="#/guiada">← Todas las prácticas guiadas</a>
      <div class="heading">
        <p class="eyebrow">${escape(practice.title.toUpperCase())} · ${escape(stage.partTitle.toUpperCase())}</p>
        <h1>Etapa ${stage.number} de ${practice.stages.length}: ${escape(stage.title)}</h1>
        <p>Avanza resolviendo la etapa actual. El código se evalúa en tu navegador de forma segura.</p>
        ${practice.recommendedBefore && !progress.guided[practice.recommendedBefore]?.completed ? `
          <div class="learning-note" style="margin: 0.65rem 0 0.25rem 0;">
            <p>💡 <strong>Recomendación pedagógica:</strong> Te recomendamos haber completado antes la práctica <a href="#/guiada/${practice.recommendedBefore}/0">«${escape(practice.recommendedBeforeTitle || 'Práctica anterior')}»</a> para asentar bien los conceptos de constructores, <code>this</code> y <code>new</code>.</p>
          </div>
        ` : ''}
      </div>
      <div class="guided-stepper-wrap" aria-label="Progreso de las etapas">
        <div class="guided-progress-bar">
          <div class="guided-progress-fill" style="width: ${percent}%;"></div>
        </div>
        <div class="guided-stepper">
          ${practice.stages.map((s, i) => {
            const isUnlocked = i <= practiceState.unlockedStage;
            const isCurrentStage = i === idx;
            const isDone = practiceState.stages[s.id]?.completed;
            const pillClass = isCurrentStage ? 'step-pill active' : isDone ? 'step-pill done' : isUnlocked ? 'step-pill unlocked' : 'step-pill locked';
            const titleAttr = `${s.part}: Etapa ${s.number} · ${s.title}${!isUnlocked ? ' (Bloqueada)' : isDone ? ' (Superada)' : ''}`;
            if (isUnlocked) {
              return `<a href="#/guiada/${practice.id}/${i}" class="${pillClass}" title="${escape(titleAttr)}" aria-label="${escape(titleAttr)}"><span>${isDone ? '✓' : s.number}</span></a>`;
            }
            return `<span class="${pillClass}" title="${escape(titleAttr)}" aria-label="${escape(titleAttr)}" aria-disabled="true"><span>${s.number}</span></span>`;
          }).join('')}
        </div>
      </div>
    </div>

    <div class="coding-layout guided-layout">
      <!-- Columna Izquierda: Concepto, Enunciado y Ayudas -->
      <section class="panel guided-info-panel">
        <div class="guided-concept">
          <div class="concept-badge">💡 CONCEPTO CLAVE</div>
          <h3>Lo que necesitas saber</h3>
          <p>${escape(stage.concept)}</p>
        </div>

        <div class="guided-prompt-box">
          <h3>Tu tarea en esta etapa</h3>
          <p>${escape(stage.prompt).replaceAll('\n', '<br>')}</p>
        </div>

        <section class="coaching guided-coaching" id="stage-help" aria-label="Pistas progresivas y solución">
          <h3>Pistas progresivas</h3>
          <p class="subtle">Utiliza solo la ayuda que necesites. Cada pista profundiza un nivel más.</p>
          <ol class="hint-steps" id="hints-list"></ol>
          <button type="button" class="button" id="btn-next-hint">Ver pista 1 de 3</button>

          <div class="solution-request">
            <button type="button" class="text-button" id="btn-request-solution">Consultar solución comentada</button>
            <div id="solution-confirm-box" hidden>
              <p>Se mostrará una posible solución de esta etapa para que puedas estudiarla y comparar. Tu código actual no se sustituirá.</p>
              <button type="button" class="button" id="btn-confirm-solution">Mostrar solución</button>
              <button type="button" class="text-button" id="btn-cancel-solution">Seguir intentándolo</button>
            </div>
            <div id="solution-display"></div>
          </div>
        </section>

        <div class="guided-stage-footer">
          <p class="subtle">${stage.cases.length} pruebas de comportamiento preparadas.</p>
          <button id="btn-reset-stage" class="text-button" type="button">Restablecer plantilla de esta etapa</button>
        </div>
      </section>

      <!-- Columna Derecha: Editor y Feedback -->
      <section class="panel editor-panel guided-editor-panel">
        <div class="editor-header-bar">
          <label for="editor">Tu código JavaScript · Función <code>${escape(stage.entrypoint)}</code></label>
          <span class="stage-status-badge ${stageState.completed ? 'badge-completed' : ''}">${stageState.completed ? '✓ Etapa superada' : 'En progreso'}</span>
        </div>
        <textarea id="editor" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off">${escape(stageState.draft ?? stage.starter)}</textarea>
        <div class="editor-actions">
          <button id="run-stage" class="button dark">▷ Comprobar etapa</button>
          ${stageState.completed && idx < practice.stages.length - 1 ? `<a class="button" href="#/guiada/${practice.id}/${idx + 1}">Siguiente etapa →</a>` : ''}
          ${stageState.completed && idx === practice.stages.length - 1 ? `<a class="button dark" href="#/guiada/${practice.id}/resumen">Ver resumen final →</a>` : ''}
        </div>
        <p id="draft-state" class="subtle" role="status">El borrador se guarda automáticamente al escribir.</p>
        <div id="stage-results" role="status" aria-live="polite"></div>
      </section>
    </div>
  `);

  const editor = document.querySelector('#editor');
  const results = document.querySelector('#stage-results');
  const cleanup = enhanceEditor(editor);
  let running = false;

  // Manejo de autoguardado del borrador
  editor.oninput = () => {
    stageState.draft = editor.value;
    const saved = persist();
    document.querySelector('#draft-state').textContent = saved
      ? 'Borrador guardado.'
      : 'No se pudo guardar localmente. Exporta tu progreso.';
    results.innerHTML = '<p class="subtle">Código modificado. Pulsa "Comprobar etapa" para evaluarlo.</p>';
  };

  // Manejo de pistas progresivas
  const hintsList = document.querySelector('#hints-list');
  const btnNextHint = document.querySelector('#btn-next-hint');
  let revealed = stageState.hintsRevealed || 0;

  function renderHints() {
    hintsList.innerHTML = '';
    for (let i = 0; i < revealed; i++) {
      const li = document.createElement('li');

      // Pista 1 y 2 o Pista 3 sin MCQ (compatibilidad con etapas existentes)
      const hasMcq = i === 2 && stage.multipleChoiceCode && Array.isArray(stage.multipleChoiceCode.options) && stage.multipleChoiceCode.options.length === 3;

      if (!hasMcq) {
        const label = i === 0 ? 'Pista 1 (Conceptual): ' : i === 1 ? 'Pista 2 (Orientativa): ' : 'Pista 3 (Técnica): ';
        li.innerHTML = `<strong>${label}</strong>${escape(stage.hints[i])}`;
        hintsList.appendChild(li);
        continue;
      }

      // Pista 3 interactiva: «Elige la solución correcta»
      li.className = 'hint-step hint-multiple-choice';
      li.id = 'hint-3-interactive';

      const mcq = stage.multipleChoiceCode;
      const checked = Boolean(stageState.quizChecked);
      const selectedIdx = stageState.quizSelected;
      const solved = Boolean(stageState.quizSolved);

      let optionsHtml = mcq.options.map((opt, optIdx) => {
        const letter = String.fromCharCode(65 + optIdx);
        const isSelected = selectedIdx === optIdx;
        let cardState = '';
        if (checked && isSelected) {
          cardState = opt.isCorrect ? 'mcq-opt-correct' : 'mcq-opt-incorrect';
        } else if (checked && solved && opt.isCorrect) {
          cardState = 'mcq-opt-correct';
        } else if (isSelected) {
          cardState = 'mcq-opt-selected';
        }

        const statusLabel = checked && isSelected
          ? (opt.isCorrect ? '✓ Opción correcta' : '✕ Opción incorrecta')
          : (isSelected ? '● Seleccionada' : '○ Elegir esta');

        return `
          <button type="button"
                  class="mcq-option-card ${cardState}"
                  role="radio"
                  aria-checked="${isSelected}"
                  data-mcq-option="${optIdx}"
                  id="mcq-option-${optIdx}">
            <div class="mcq-option-topbar">
              <span class="mcq-option-letter">${letter}</span>
              <span class="mcq-option-indicator">${statusLabel}</span>
            </div>
            <pre class="mcq-option-code"><code>${escape(opt.code)}</code></pre>
          </button>
        `;
      }).join('');

      let feedbackHtml = '';
      if (checked && selectedIdx !== null && selectedIdx !== undefined) {
        const chosen = mcq.options[selectedIdx];
        if (chosen.isCorrect) {
          feedbackHtml = `
            <div class="mcq-feedback-panel mcq-feedback-success" role="status">
              <div class="mcq-feedback-title">✓ ¡Respuesta correcta!</div>
              <p>${escape(chosen.explanation)}</p>
              <div class="mcq-editor-notice">
                <strong>💡 Tu turno en el editor:</strong> El código no se inserta automáticamente ni completa la etapa. Escribe tu solución en el editor a la derecha y pulsa <strong>▷ Comprobar etapa</strong> para superarla con éxito.
              </div>
              <details class="mcq-alternatives-breakdown">
                <summary>Ver por qué fallan las otras dos alternativas</summary>
                <ul class="mcq-breakdown-list">
                  ${mcq.options.map((o, idxOpt) => {
                    if (idxOpt === selectedIdx) return '';
                    return `<li><strong>Opción ${String.fromCharCode(65 + idxOpt)}:</strong> ${escape(o.explanation)}</li>`;
                  }).join('')}
                </ul>
              </details>
            </div>
          `;
        } else {
          feedbackHtml = `
            <div class="mcq-feedback-panel mcq-feedback-error" role="status">
              <div class="mcq-feedback-title">✕ Esta alternativa contiene un error</div>
              <p>${escape(chosen.explanation)}</p>
              <p class="subtle">Revisa el concepto e inténtalo de nuevo seleccionando otra opción.</p>
            </div>
          `;
        }
      }

      li.innerHTML = `
        <div class="mcq-wrapper">
          <div class="mcq-header">
            <span class="mcq-badge">ACTIVIDAD INTERACTIVA</span>
            <h4>Pista 3 · Elige la solución correcta</h4>
            <p class="subtle">${escape(mcq.prompt || 'Identifica cuál de las tres alternativas resuelve el objetivo sin errores. Luego escribe tu código en el editor:')}</p>
          </div>
          <div class="mcq-options-grid" role="radiogroup" aria-label="Alternativas de código">
            ${optionsHtml}
          </div>
          <div class="mcq-controls">
            <button type="button" class="button dark" id="btn-check-mcq" ${selectedIdx === null || selectedIdx === undefined ? 'disabled' : ''}>
              ${checked && solved ? '✓ Comprobada' : 'Comprobar respuesta'}
            </button>
            ${checked && !solved ? `
              <button type="button" class="text-button" id="btn-retry-mcq">Probar otra opción</button>
            ` : ''}
          </div>
          <div id="mcq-feedback-container">${feedbackHtml}</div>
        </div>
      `;

      hintsList.appendChild(li);

      // Eventos de opciones de radio
      li.querySelectorAll('[data-mcq-option]').forEach(btn => {
        btn.onclick = () => {
          const optIdx = Number(btn.dataset.mcqOption);
          stageState.quizSelected = optIdx;
          stageState.quizChecked = false;
          persist();
          renderHints();
        };
      });

      // Evento de comprobar
      const btnCheck = li.querySelector('#btn-check-mcq');
      if (btnCheck) {
        btnCheck.onclick = () => {
          if (stageState.quizSelected === null || stageState.quizSelected === undefined) return;
          const chosen = mcq.options[stageState.quizSelected];
          stageState.quizAttempts = (stageState.quizAttempts || 0) + 1;
          stageState.quizChecked = true;
          stageState.quizSolved = Boolean(chosen?.isCorrect);
          stageState.hint3Consulted = true;
          persist();
          renderHints();
        };
      }

      // Evento de reintentar
      const btnRetry = li.querySelector('#btn-retry-mcq');
      if (btnRetry) {
        btnRetry.onclick = () => {
          stageState.quizChecked = false;
          stageState.quizSelected = null;
          persist();
          renderHints();
        };
      }
    }

    if (revealed >= stage.hints.length) {
      btnNextHint.disabled = true;
      btnNextHint.textContent = 'Has visto todas las pistas';
    } else {
      btnNextHint.disabled = false;
      btnNextHint.textContent = `Ver pista ${revealed + 1} de ${stage.hints.length}`;
    }
  }
  renderHints();

  btnNextHint.onclick = () => {
    if (revealed < stage.hints.length) {
      revealed++;
      stageState.hintsRevealed = revealed;
      if (revealed >= 3) {
        stageState.hint3Consulted = true;
      }
      persist();
      renderHints();
    }
  };

  // Manejo de solución comentada
  const btnReqSol = document.querySelector('#btn-request-solution');
  const confirmBox = document.querySelector('#solution-confirm-box');
  const btnConfirmSol = document.querySelector('#btn-confirm-solution');
  const btnCancelSol = document.querySelector('#btn-cancel-solution');
  const solutionDisplay = document.querySelector('#solution-display');

  function renderSolution() {
    if (stageState.solutionRevealed) {
      btnReqSol.hidden = true;
      confirmBox.hidden = true;
      solutionDisplay.innerHTML = `
        <h4>Solución comentada de la etapa</h4>
        <pre><code>${escape(stage.solution)}</code></pre>
        <p>${escape(stage.explanation)}</p>
        <p class="subtle">Recuerda: escribir tu propia solución es lo que consolida el aprendizaje. Prueba a entender cada línea y escribirla tú mismo.</p>
      `;
    }
  }
  renderSolution();

  btnReqSol.onclick = () => { confirmBox.hidden = false; };
  btnCancelSol.onclick = () => { confirmBox.hidden = true; };
  btnConfirmSol.onclick = () => {
    stageState.solutionRevealed = true;
    persist();
    renderSolution();
  };

  // Botón para restablecer plantilla de la etapa
  document.querySelector('#btn-reset-stage').onclick = () => {
    if (running) return;
    if (confirm('¿Restablecer el código de esta etapa a la plantilla inicial?')) {
      editor.value = stage.starter;
      editor.dispatchEvent(new Event('input', { bubbles: true }));
    }
  };

  // Botón para ejecutar comprobaciones
  document.querySelector('#run-stage').onclick = async () => {
    if (running) return;
    running = true;
    const button = document.querySelector('#run-stage');
    button.disabled = true;
    editor.readOnly = true;
    button.textContent = 'Evaluando…';

    stageState.draft = editor.value;
    stageState.attempts = (stageState.attempts || 0) + 1;
    persist();

    let result;
    try {
      result = await runCode(editor.value, stage);
    } catch (err) {
      result = { error: `Error al iniciar la prueba: ${err.message}` };
    }

    if (!isCurrent()) return;
    running = false;
    button.disabled = false;
    editor.readOnly = false;
    button.textContent = '▷ Comprobar etapa';

    const passed = result.results?.filter(r => r.passed).length || 0;
    const allPassed = passed === stage.cases.length;

    stageState.passed = passed;
    stageState.total = stage.cases.length;

    if (allPassed) {
      stageState.completed = true;
      if (idx + 1 > practiceState.unlockedStage) {
        practiceState.unlockedStage = Math.min(idx + 1, practice.stages.length - 1);
      }
      if (idx === practice.stages.length - 1) {
        practiceState.completed = true;
      }
      persist();

      // Renderizar feedback con botón directo de avance
      const isLastStage = idx === practice.stages.length - 1;
      const nextUrl = isLastStage ? `#/guiada/${practice.id}/resumen` : `#/guiada/${practice.id}/${idx + 1}`;
      const nextLabel = isLastStage ? 'Ver resumen de la práctica →' : 'Avanzar a la siguiente etapa →';

      results.innerHTML = `
        <div class="guided-success-card">
          <div class="success-icon">✓</div>
          <div class="success-text">
            <h3>¡Etapa ${stage.number} superada! (${passed} de ${stage.cases.length} pruebas)</h3>
            <p>${escape(stage.explanation)}</p>
          </div>
          <a class="button dark next-stage-btn" href="${nextUrl}">${nextLabel}</a>
        </div>
        ${renderFeedback(result, stage, { review: stage.review }, escape)}
      `;
    } else {
      results.innerHTML = renderFeedback(result, stage, { review: stage.review }, escape);
    }
  };

  return cleanup;
}
