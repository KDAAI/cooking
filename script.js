document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. THEME SWITCHER LOGIC
    // ----------------------------------------------------
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
    
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }

    // ----------------------------------------------------
    // 2. INGREDIENTS PROPORTIONAL CALCULATOR
    // ----------------------------------------------------
    const ingredientInputs = document.querySelectorAll('.ingredient-input');
    
    ingredientInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const currentInput = e.target;
            const baseVal = parseFloat(currentInput.dataset.baseVal);
            const newVal = parseFloat(currentInput.value);
            
            // If the input is empty or invalid, do not perform recalculation yet
            if (isNaN(newVal) || newVal <= 0 || isNaN(baseVal) || baseVal <= 0) {
                return;
            }
            
            const ratio = newVal / baseVal;
            
            ingredientInputs.forEach(otherInput => {
                if (otherInput === currentInput) return;
                
                const otherBaseVal = parseFloat(otherInput.dataset.baseVal);
                if (isNaN(otherBaseVal)) return;
                
                let scaledVal = otherBaseVal * ratio;
                
                // Format the value nicely:
                // If it's an integer or very close, round it.
                // Otherwise, keep up to 1 decimal place.
                if (scaledVal % 1 === 0) {
                    otherInput.value = scaledVal;
                } else if (scaledVal < 10) {
                    otherInput.value = Math.round(scaledVal * 10) / 10;
                } else {
                    otherInput.value = Math.round(scaledVal);
                }
            });
        });

        // Prevent typing non-numeric characters (except decimals)
        input.addEventListener('keypress', (e) => {
            if (e.key !== '.' && e.key !== ',' && isNaN(parseInt(e.key))) {
                e.preventDefault();
            }
        });
    });

    // ----------------------------------------------------
    // 3. RECIPE STEPS PROGRESS (CHECKBOXES & LOCAL STORAGE)
    // ----------------------------------------------------
    const stepCheckboxes = document.querySelectorAll('.step-checkbox');
    const pageKey = 'recipe_steps_' + window.location.pathname;

    // Load saved steps progress from localStorage
    const savedProgress = JSON.parse(localStorage.getItem(pageKey)) || {};
    
    stepCheckboxes.forEach((checkbox, index) => {
        const stepItem = checkbox.closest('.step-item');
        
        // Restore state
        if (savedProgress[index]) {
            checkbox.checked = true;
            stepItem.classList.add('completed');
        }
        
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                stepItem.classList.add('completed');
                savedProgress[index] = true;
            } else {
                stepItem.classList.remove('completed');
                delete savedProgress[index];
            }
            localStorage.setItem(pageKey, JSON.stringify(savedProgress));
        });
    });

    // ----------------------------------------------------
    // 4. INLINE Q&A ACCORDION
    // ----------------------------------------------------
    const qaButtons = document.querySelectorAll('.qa-toggle-btn');
    
    qaButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const panel = btn.nextElementSibling;
            
            // Toggle active state
            btn.classList.toggle('active');
            panel.classList.toggle('expanded');
        });
    });

    // ----------------------------------------------------
    // 5. SEARCH & FILTER LOGIC (For index.html)
    // ----------------------------------------------------
    const searchInput = document.getElementById('recipeSearch');
    const recipeCards = document.querySelectorAll('.recipe-card');
    
    if (searchInput && recipeCards.length > 0) {
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase().trim();
            
            recipeCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const description = card.querySelector('p').textContent.toLowerCase();
                
                // Also search in tags if present
                const tags = Array.from(card.querySelectorAll('.meta-tag'))
                                  .map(tag => tag.textContent.toLowerCase())
                                  .join(' ');
                
                const searchContent = `${title} ${description} ${tags}`;
                
                if (searchContent.includes(query)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
});
