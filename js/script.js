// Creado por: Brandon Henríquez.

// Variables globales para almacenar los datos del usuario y el objetivo seleccionado
let userData = {};
let selectedGoalId = null;
let dynamicAnswers = {};
let currentRecommendations = {}; 
let currentIMCResult = {};     

// Elementos del DOM - Consulta
const initialDataFormSection = document.getElementById('initial-data-form');
const goalSelectionSection = document.getElementById('goal-selection');
const dynamicQuestionsSection = document.getElementById('dynamic-questions');
const resultsDisplaySection = document.getElementById('results-display');

const userDataForm = document.getElementById('userDataForm');
const fullNameInput = document.getElementById('fullName');
const ageInput = document.getElementById('age');
const weightInput = document.getElementById('weight');
const weightUnitSelect = document.getElementById('weightUnit');
const convertWeightBtn = document.getElementById('convertWeightBtn');
const heightInput = document.getElementById('height');
const genderSelect = document.getElementById('gender');
const ailmentsSelect = document.getElementById('ailments'); 
const duiInput = document.getElementById('dui');
const duiFeedback = document.getElementById('dui-feedback');

const goalOptionsContainer = document.getElementById('goalOptions');
const dynamicQuestionsForm = document.getElementById('dynamicQuestionsForm');

const resFullName = document.getElementById('resFullName');
const resAge = document.getElementById('resAge');
const resWeight = document.getElementById('resWeight');
const resHeight = document.getElementById('resHeight');
const resGender = document.getElementById('resGender');
const resDUI = document.getElementById('resDUI');
const resAilments = document.getElementById('resAilments');
const resIMC = document.getElementById('resIMC');
const resIMCStatus = document.getElementById('resIMCStatus');
const resHabitsRoutines = document.getElementById('resHabitsRoutines');
const resDietPlan = document.getElementById('resDietPlan');
const savePdfBtn = document.getElementById('savePdfBtn');
const reviewOptionsBtn = document.getElementById('reviewOptionsBtn');

// Elementos del DOM - Administración
const adminSection = document.getElementById('admin-section');
const adminIconLink = document.getElementById('admin-icon-link');
const adminLoginForm = document.getElementById('admin-login-form');
const adminEmailInput = document.getElementById('adminEmail');
const adminPasswordInput = document.getElementById('adminPassword');
const adminLoginBtn = document.getElementById('adminLoginBtn');
const adminLoginMessage = document.getElementById('adminLoginMessage');
const adminContent = document.getElementById('admin-content');
const adminLogoutBtn = document.getElementById('adminLogoutBtn');
const usersTableBody = document.getElementById('usersTableBody');

let editUserModalInstance = null;
let viewRecommendationsModalInstance = null;

let editUserForm = document.getElementById('editUserForm'); 
const editUserIdInput = document.getElementById('editUserId');
const editFullNameInput = document.getElementById('editFullName');
const editAgeInput = document.getElementById('editAge'); 
const editWeightInput = document.getElementById('editWeight');
const editHeightInput = document.getElementById('editHeight');
let editGenderSelect = document.getElementById('editGender'); 
const editDuiContainer = document.getElementById('editDuiContainer');
const editDUIInput = document.getElementById('editDUI');
const editDuiFeedback = document.getElementById('editDui-feedback');
let editAilmentsSelect = document.getElementById('editAilments'); 
let editGoalSelect = document.getElementById('editGoal'); 
const editDynamicQuestionsContainer = document.getElementById('editDynamicQuestionsContainer');

// Elementos del DOM para el modal de ver recomendaciones
const viewRecsHabitsRoutines = document.getElementById('viewRecsHabitsRoutines');
const viewRecsDietPlan = document.getElementById('viewRecsDietPlan');


const homeLink = document.getElementById('home-link');
const usersTabBtn = document.getElementById('users-tab');


// --- Funciones de Utilidad ---

function showSection(sectionToShow) {
    const sections = [initialDataFormSection, goalSelectionSection, dynamicQuestionsSection, resultsDisplaySection, adminSection];
    sections.forEach(section => {
        section.classList.remove('animate__fadeIn', 'animate__fadeOut');
        section.style.display = 'none';
    });

    sectionToShow.style.display = 'block';
    sectionToShow.classList.add('animate__fadeIn');
}

// Función para poblar las opciones de objetivos
function populateGoalOptions() {
    goalOptionsContainer.innerHTML = ''; 
    if (!window.knowledgeBase || !window.knowledgeBase.goals || window.knowledgeBase.goals.length === 0) {
        console.error("No se encontraron objetivos en la base de conocimientos. La knowledgeBase puede no haberse cargado correctamente o Firestore no la devolvió.");
        return;
    }
    window.knowledgeBase.goals.forEach(goal => {
        const colDiv = document.createElement('div');
        colDiv.className = 'col';
        colDiv.innerHTML = `
            <div class="card h-100 text-center goal-card" data-goal-id="${goal.id}">
                <img src="${goal.image || 'assets/default.png'}" class="card-img-top mx-auto mt-3" alt="${goal.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 50%;">
                <div class="card-body">
                    <h5 class="card-title">${goal.name}</h5>
                    <p class="card-text">${goal.description}</p>
                </div>
            </div>
        `;
        goalOptionsContainer.appendChild(colDiv);
    });

    // Añadir manejadores de eventos a las nuevas tarjetas de objetivo
    document.querySelectorAll('.goal-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.goal-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedGoalId = card.dataset.goalId; 
            populateDynamicQuestions(selectedGoalId, dynamicQuestionsForm);
            showSection(dynamicQuestionsSection);
        });
    });
}

// Función para poblar preguntas dinámicas basadas en el objetivo
function populateDynamicQuestions(goalId, formContainer, currentAnswers = {}) {
    formContainer.innerHTML = '';
    if (!window.knowledgeBase || !window.knowledgeBase.questions) {
        console.error("window.knowledgeBase.questions no está disponible. No se pueden cargar las preguntas dinámicas.");
        return;
    }

    const goalQuestions = window.knowledgeBase.questions[goalId];

    if (!goalQuestions || goalQuestions.length === 0) {
        if (formContainer === dynamicQuestionsForm) {
            const submitBtn = document.createElement('button');
            submitBtn.type = 'submit';
            submitBtn.className = 'btn btn-primary w-100 mt-4';
            submitBtn.textContent = 'Obtener Recomendaciones';
            formContainer.appendChild(submitBtn);
        }
        return;
    }

    goalQuestions.forEach(q => {
        const div = document.createElement('div');
        div.className = 'mb-3';
        div.innerHTML = `<label for="${q.id}" class="form-label">${q.question}</label>`;

        if (q.type === 'select') {
            const select = document.createElement('select');
            select.className = 'form-select';
            select.id = q.id;
            select.required = true;

            const defaultOpt = document.createElement('option');
            defaultOpt.value = "";
            defaultOpt.textContent = "Selecciona...";
            defaultOpt.disabled = true;
            defaultOpt.selected = true; 

            select.appendChild(defaultOpt);

            q.options.forEach(option => {
                const opt = document.createElement('option');
                opt.value = option.value;
                opt.textContent = option.text;
                select.appendChild(opt);
            });
            
            if (currentAnswers[q.id]) {
                select.value = currentAnswers[q.id];
                defaultOpt.selected = false; 
            }
            div.appendChild(select);
        } else if (q.type === 'radio') {
            q.options.forEach(option => {
                const radioDiv = document.createElement('div');
                radioDiv.className = 'form-check';
                const input = document.createElement('input');
                input.className = 'form-check-input';
                input.type = 'radio';
                input.name = q.id;
                
                input.id = `${q.id}-${option.value.replace(/\s/g, '_')}-${formContainer.id || 'form'}`;
                input.value = option.value;
                input.required = true;
                if (currentAnswers[q.id] === option.value) {
                    input.checked = true; 
                }
                radioDiv.appendChild(input);
                const label = document.createElement('label');
                label.className = 'form-check-label';
                label.htmlFor = input.id;
                label.textContent = option.text;
                radioDiv.appendChild(label);
                div.appendChild(radioDiv);
            });
        } else if (q.type === 'number') {
            const input = document.createElement('input');
            input.type = 'number';
            input.className = 'form-control';
            input.id = q.id;
            input.required = true;
            input.min = q.min || '';
            input.max = q.max || '';
            input.value = currentAnswers[q.id] || ''; 
            div.appendChild(input);
        }

        formContainer.appendChild(div); 
    });

    if (formContainer === dynamicQuestionsForm) {
        const submitBtn = document.createElement('button');
        submitBtn.type = 'submit';
        submitBtn.className = 'btn btn-primary w-100 mt-4';
        submitBtn.textContent = 'Obtener Recomendaciones';
        formContainer.appendChild(submitBtn);
    }
}


// --- Lógica de Inferencia ---
const inferenceEngine = {
    calculateIMC: function(weightKg, heightCm) {
        const heightM = heightCm / 100; // Convertir cm a metros
        const imc = weightKg / (heightM * heightM);
        let status = '';

        if (imc < 18.5) {
            status = 'underweight';
        } else if (imc >= 18.5 && imc < 24.9) {
            status = 'normal';
        } else if (imc >= 25 && imc < 29.9) {
            status = 'overweight';
        } else {
            status = 'obese';
        }
        return { imc: imc, status: status };
    },

    generateRecommendations: function(user, kb) {
        let habitsRoutines = [];
        let dietPlan = [];
        let dietRestrictions = [];

        // 1. Recomendación basada en el IMC
        const imcResult = this.calculateIMC(user.weightKg, user.heightCm);
        const imcRecommendation = kb.recommendations[imcResult.status];
        if (imcRecommendation) {
            habitsRoutines.push(imcRecommendation.habits);
        }

        // 2. Recomendación de dieta basada en padecimientos (prioridad alta)
        if (user.ailments && user.ailments.length > 0) {
            
            const sortedAilments = [...user.ailments].sort();
            const combinationKey = sortedAilments.join('_');

            let foundAilmentDiet = false;

            
            if (kb.recommendations.alternativeDietPlans && kb.recommendations.alternativeDietPlans.combinations) {
                const combinedDiet = kb.recommendations.alternativeDietPlans.combinations[combinationKey];
                if (combinedDiet) {
                    dietPlan.push(combinedDiet);
                    const ailmentNames = sortedAilments.map(a => {
                        const ailment = window.knowledgeBase.recommendations.ailments[a];
                        return ailment ? (ailment.name || a) : a;
                    }).filter(Boolean).join(', ');
                    habitsRoutines.push(`**Consideraciones por Padecimientos (${ailmentNames}):** ${combinedDiet.restriction_summary}`);
                    foundAilmentDiet = true;
                }
            }

            if (!foundAilmentDiet) {
                user.ailments.forEach(ailmentId => {
                    const ailmentRec = kb.recommendations.ailments[ailmentId];
                    if (ailmentRec && ailmentRec.diet_restriction) {
                        dietRestrictions.push(ailmentRec.diet_restriction);
                    }
                });
            }
        }

        // 3. Recomendación detallada basada en el objetivo principal
        if (user.selectedGoalId) {
            const goalRec = kb.recommendations.detailed[user.selectedGoalId];
            if (goalRec) {
               
                const userDynamicAnswers = user.dynamicAnswers || {};
                Object.keys(userDynamicAnswers).forEach(questionId => {
                    const answerKey = `${questionId}_${userDynamicAnswers[questionId]}`;
                    const specificRec = goalRec[answerKey];
                    if (specificRec) {
                        if (specificRec.habits) {
                            habitsRoutines.push(specificRec.habits);
                        }
                        if (specificRec.diet_addition && dietPlan.length === 0) {
                             habitsRoutines.push(`**Consejo adicional para la dieta (${window.knowledgeBase.goals.find(g => g.id === user.selectedGoalId)?.name || user.selectedGoalId}):** ${specificRec.diet_addition}`);
                        }
                    }
                });

                const specificGoalDiet = kb.recommendations.alternativeDietPlans?.individual?.[user.selectedGoalId];
                if (specificGoalDiet && dietPlan.length === 0 && (!user.ailments || user.ailments.length === 0)) {
                    dietPlan.push(specificGoalDiet);
                }
            }
        }

       
        if (dietPlan.length === 0) {
            if (imcRecommendation && imcRecommendation.diet) {
                dietPlan.push(imcRecommendation.diet);
            }
        }

       
        if (dietRestrictions.length > 0) {
            habitsRoutines.push(`**Consideraciones Dietéticas Adicionales por Padecimientos:** ${dietRestrictions.join(' ')}`);
        }

        habitsRoutines = [...new Set(habitsRoutines.filter(h => h && h.trim() !== ''))];

        return {
            imcResult: imcResult, 
            habitsRoutines: habitsRoutines,
            dietPlan: dietPlan
        };
    }
};


// --- Funciones de Firebase ---

/**
 * Función para subir la base de conocimientos a Firestore.
 */
async function uploadKnowledgeBaseToFirestore() {
    try {
        if (typeof window.knowledgeBase === 'undefined' || Object.keys(window.knowledgeBase).length === 0 || !window.knowledgeBase.goals) {
            console.warn("La variable 'knowledgeBase' no está definida o está vacía. Asegúrate de que knowledgeBase.js se cargue ANTES de esta función para la subida inicial.");
            return false;
        }

        await db.collection('knowledgeBase').doc('current').set(window.knowledgeBase);
        console.log("Base de conocimientos subida a Firestore exitosamente.");
      
        return true;
    } catch (error) {
        console.error("Error al subir la base de conocimientos a Firestore: ", error);
       
        showCustomAlert("Error al subir la base de conocimientos. Revisa la consola y tus reglas de seguridad de Firestore. El error es: " + error.message);
        return false;
    }
}

/**
 * Función para cargar la base de conocimientos desde Firestore.
 */
async function loadKnowledgeBaseFromFirestore() {
    try {
        const doc = await db.collection('knowledgeBase').doc('current').get();
        if (doc.exists) {
            window.knowledgeBase = doc.data(); 
            console.log("Base de conocimientos cargada desde Firestore.");
            return true;
        } else {
            console.warn("No se encontró el documento 'current' en la colección 'knowledgeBase' en Firestore.");
            return false; 
        }
    } catch (error) {
        console.error("Error al cargar la base de conocimientos desde Firestore: ", error);
        showCustomAlert("Error crítico al cargar la base de conocimientos. Revisa tu conexión a Firebase, tus credenciales o si la base de datos existe. El error es: " + error.message);
        return false; 
    }
}

/**
 * Función principal para inicializar la aplicación, gestionando la carga/subida de la KB.
 */
async function initApp() {
    console.log("Iniciando la aplicación y verificando la base de conocimientos...");
    const loaded = await loadKnowledgeBaseFromFirestore();

    if (document.getElementById('editUserModal')) {
        editUserModalInstance = new bootstrap.Modal(document.getElementById('editUserModal'));
    }
    if (document.getElementById('viewRecommendationsModal')) {
        viewRecommendationsModalInstance = new bootstrap.Modal(document.getElementById('viewRecommendationsModal'));
    }


    if (!loaded) {
        console.log("KB no encontrada en Firestore, intentando subirla desde knowledgeBase.js...");

        if (typeof window.knowledgeBase !== 'undefined' && Object.keys(window.knowledgeBase).length > 0) {
            const uploaded = await uploadKnowledgeBaseToFirestore();
            if (uploaded) {
                console.log("KB subida exitosamente. La aplicación continuará.");
                populateGoalOptions();
                showSection(initialDataFormSection);
            } else {
                console.error("Fallo crítico: No se pudo cargar ni subir la base de conocimientos. La aplicación no puede iniciar correctamente.");
                showCustomAlert("¡Error grave! No se pudo cargar ni inicializar la base de conocimientos. Por favor, revisa la consola para más detalles y asegúrate de que tus credenciales y reglas de Firebase sean correctas.");
            }
        } else {
            console.error("Fallo crítico: knowledgeBase.js no está cargado/definido y la KB no está en Firestore. No se puede inicializar la aplicación.");
            showCustomAlert("¡Error grave! La base de conocimientos no se cargó. Asegúrate de que 'knowledgeBase.js' esté cargado y definido ANTES de que intente buscar en Firebase la primera vez.");
        }
    } else {
        console.log("KB cargada desde Firestore. La aplicación puede iniciar.");
        populateGoalOptions();
        showSection(initialDataFormSection);
    }
}


// --- Escuchadores de Eventos ---

document.addEventListener('DOMContentLoaded', initApp);

duiInput.addEventListener('input', function(event) {
    let value = event.target.value.replace(/[^0-9]/g, ''); 
    if (value.length > 8) {
        value = value.substring(0, 8) + '-' + value.substring(8, 9);
    }
    event.target.value = value;
    validateDUI(event.target); 
});

duiInput.addEventListener('blur', function(event) {
    validateDUI(event.target);
});

// Función de validación de formato del DUI
function validateDUI(inputElement) {
    const duiRegex = /^[0-9]{8}-[0-9]{1}$/;
    if (inputElement.value.match(duiRegex)) {
        inputElement.classList.remove('is-invalid');
        inputElement.classList.add('is-valid');
        duiFeedback.textContent = '';
        return true;
    } else {
        inputElement.classList.add('is-invalid');
        inputElement.classList.remove('is-valid');
        duiFeedback.textContent = 'Por favor, ingrese un DUI válido (XXXXXXXX-X).';
        return false;
    }
}

function validateEditDUI(inputElement, containerElement) {

    if (containerElement.style.display !== 'none') {
        const duiRegex = /^[0-9]{8}-[0-9]{1}$/;
        if (inputElement.value.match(duiRegex)) {
            inputElement.classList.remove('is-invalid');
            inputElement.classList.add('is-valid');
            editDuiFeedback.textContent = '';
            return true;
        } else {
            inputElement.classList.add('is-invalid');
            inputElement.classList.remove('is-valid');
            editDuiFeedback.textContent = 'Por favor, ingrese un DUI válido (XXXXXXXX-X).';
            return false;
        }
    }
    return true; 
}


// Listener para el botón/enlace Home
homeLink.addEventListener('click', (e) => {
    e.preventDefault();
    reviewOptionsBtn.click(); 
});

// Convertir peso
convertWeightBtn.addEventListener('click', () => {
    let weight = parseFloat(weightInput.value);
    const unit = weightUnitSelect.value;

    if (isNaN(weight) || weight <= 0) {
        weightInput.classList.add('is-invalid');
        return;
    } else {
        weightInput.classList.remove('is-invalid');
    }

    if (unit === 'lbs') {
        weight = weight * 0.453592; 
        showCustomAlert(`El peso en Kg es: ${weight.toFixed(2)} kg`);
    } else {
        weight = weight / 0.453592; 
        showCustomAlert(`El peso en Lbs es: ${weight.toFixed(2)} lbs`);
    }
});


// Manejador del formulario de datos iniciales
userDataForm.addEventListener('submit', async (e) => {
    e.preventDefault(); 

    let formIsValid = userDataForm.checkValidity();
    const duiIsValid = validateDUI(duiInput); 
    if (!formIsValid || !duiIsValid) {
        e.stopPropagation();
        userDataForm.classList.add('was-validated');
        return;
    }

    const newDUI = duiInput.value;
    const newAge = parseInt(ageInput.value);

    let querySnapshot = null;

    // Verificar si el DUI ya existe
    try {
        const usersRef = db.collection('users');
        querySnapshot = await usersRef.where('dui', '==', newDUI).get(); // Asigna el valor aquí

        if (!querySnapshot.empty) {
            if (newAge >= 18) {
                duiInput.classList.add('is-invalid');
                duiFeedback.textContent = 'Este DUI ya está registrado para un usuario mayor de edad.';
                e.stopPropagation();
                userDataForm.classList.add('was-validated');
                return;
            } else {
                console.log(`DUI ${newDUI} ya existe, pero se permite porque el usuario es menor de edad.`);
            }
        }
    } catch (error) {
        console.error("Error al verificar unicidad del DUI:", error);
        showCustomAlert("Error al verificar la unicidad del DUI. Por favor, inténtelo de nuevo.");
        e.stopPropagation();
        userDataForm.classList.add('was-validated');
        return;
    }

    const selectedAilments = Array.from(ailmentsSelect.selectedOptions).map(option => option.value);
    const actualAilments = selectedAilments.includes('none') && selectedAilments.length > 1
        ? selectedAilments.filter(a => a !== 'none')
        : (selectedAilments.includes('none') && selectedAilments.length === 1 ? [] : selectedAilments);


    userData = {
        fullName: fullNameInput.value.trim(),
        age: parseInt(ageInput.value),
        weightKg: parseFloat(weightInput.value), // Supuestamente siempre se guarda en Kg (Ojalá xd)
        heightCm: parseFloat(heightInput.value),
        gender: genderSelect.value,
        dui: duiInput.value,
        isResponsibleDUI: (newAge < 18 && querySnapshot && !querySnapshot.empty), 
        ailments: actualAilments
    };

    populateGoalOptions(); 
    showSection(goalSelectionSection);

    userDataForm.classList.remove('was-validated');
});


// Manejador del formulario de preguntas dinámicas
dynamicQuestionsForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!dynamicQuestionsForm.checkValidity()) {
        e.stopPropagation();
        dynamicQuestionsForm.classList.add('was-validated');
        return;
    }

    // Recolectar respuestas dinámicas
    dynamicAnswers = {};
    const goalQuestions = window.knowledgeBase.questions[selectedGoalId];

    if (goalQuestions) {
        goalQuestions.forEach(q => {
            if (q.type === 'select' || q.type === 'number') {
                dynamicAnswers[q.id] = document.getElementById(q.id).value;
                if (q.type === 'number') {
                    dynamicAnswers[q.id] = parseFloat(dynamicAnswers[q.id]);
                }
            } else if (q.type === 'radio') {
                const selectedRadio = document.querySelector(`input[name="${q.id}"]:checked`);
                if (selectedRadio) {
                    dynamicAnswers[q.id] = selectedRadio.value;
                }
            }
        });
    }

    // Combinar todos los datos del usuario para la inferencia
    const fullUserData = {
        ...userData,
        selectedGoalId: selectedGoalId,
        dynamicAnswers: dynamicAnswers
    };

    // Generar recomendaciones usando la lógica de inferencia
    const result = inferenceEngine.generateRecommendations(fullUserData, window.knowledgeBase);
    currentIMCResult = result.imcResult;
    currentRecommendations = {
        habitsRoutines: result.habitsRoutines,
        dietPlan: result.dietPlan
    };

    // Almacenar datos de usuario (incluyendo IMC y recomendaciones) en Firestore
    try {
        const usersCollection = db.collection('users');
        const docRef = await usersCollection.add({
            ...userData, 
            selectedGoalId: selectedGoalId,
            dynamicAnswers: dynamicAnswers,
            imcResult: currentIMCResult,
            recommendations: currentRecommendations,
            timestamp: firebase.firestore.FieldValue.serverTimestamp() 
        });
        console.log("Datos completos del usuario guardados en Firestore con ID: ", docRef.id);
        userData.firestoreId = docRef.id; 

    } catch (error) {
        console.error("Error al guardar los datos completos del usuario en Firestore: ", error);
        showCustomAlert("Hubo un error al guardar tus datos. Por favor, inténtalo de nuevo. El error es: " + error.message);
        dynamicQuestionsForm.classList.add('was-validated'); 
        return; 
    }

    // Mostrar resultados
    displayResults(fullUserData, currentRecommendations, currentIMCResult);
    showSection(resultsDisplaySection);

    dynamicQuestionsForm.classList.remove('was-validated');
});


// Función para mostrar los resultados en la UI
function displayResults(user, recommendations, imcResult, containerElements = {}) {

    const targetResFullName = containerElements.resFullName || resFullName;
    const targetResAge = containerElements.resAge || resAge;
    const targetResWeight = containerElements.resWeight || resWeight;
    const targetResHeight = containerElements.resHeight || resHeight;
    const targetResGender = containerElements.resGender || resGender;
    const targetResDUI = containerElements.resDUI || resDUI; 
    const targetResAilments = containerElements.resAilments || resAilments;
    const targetResIMC = containerElements.resIMC || resIMC;
    const targetResIMCStatus = containerElements.resIMCStatus || resIMCStatus;
    const targetResHabitsRoutines = containerElements.resHabitsRoutines || resHabitsRoutines;
    const targetResDietPlan = containerElements.resDietPlan || resDietPlan;

    if (targetResFullName) targetResFullName.textContent = user.fullName;
    if (targetResAge) targetResAge.textContent = user.age;
    if (targetResWeight) targetResWeight.textContent = user.weightKg.toFixed(2);
    if (targetResHeight) targetResHeight.textContent = user.heightCm;
    if (targetResGender) targetResGender.textContent = user.gender === 'male' ? 'Hombre' : 'Mujer';

    // Mostrar el DUI y el indicador "(Responsable)" si aplica
    if (targetResDUI) {
        targetResDUI.textContent = user.dui || 'N/A';
        if (user.isResponsibleDUI) {
            targetResDUI.textContent += ' (Responsable)';
        }
    }

    if (targetResAilments) {
        targetResAilments.textContent = user.ailments && user.ailments.length > 0
            ? user.ailments.map(a => window.knowledgeBase.recommendations.ailments[a]?.name || a).join(', ')
            : 'Ninguno';
    }

    // Muestra del IMC
    if (targetResIMC) targetResIMC.textContent = imcResult.imc.toFixed(2);
    if (targetResIMCStatus) targetResIMCStatus.textContent = imcResult.status;

    // Mostrar hábitos y rutinas
    if (targetResHabitsRoutines) {
        targetResHabitsRoutines.innerHTML = recommendations.habitsRoutines.map(rec => `<li>${rec}</li>`).join('');
    }

    if (targetResDietPlan) {
        targetResDietPlan.innerHTML = ''; 
        if (recommendations.dietPlan && recommendations.dietPlan.length > 0) {
            recommendations.dietPlan.forEach(plan => {
                const planDiv = document.createElement('div');
                planDiv.className = 'card mb-3';
                let mealsHtml = '';

                let actualMealPlanStrings = [];
                let planTitle = 'Plan de Dieta'; 

                // Mapeo de nombres de comida en inglés a español
                const mealNameMap = {
                    'breakfast': 'Desayuno',
                    'midMorning': 'Media Mañana',
                    'lunch': 'Almuerzo',
                    'afternoon': 'Merienda',
                    'dinner': 'Cena'
                };

                // Orden de comidas.
                const mealOrder = ['breakfast', 'midMorning', 'lunch', 'afternoon', 'dinner'];

                if (typeof plan === 'object' && plan !== null) {
                    if (plan.title) {
                        planTitle = plan.title;
                    }

                    if (plan.plan && Array.isArray(plan.plan)) {
                        actualMealPlanStrings = plan.plan;
                    } else if (typeof plan.diet_restriction === 'string') {
                        actualMealPlanStrings = [plan.diet_restriction];
                        planTitle = plan.title || 'Consideración Dietética';
                    } else {
                        
                        let mealsAsObject = {};
                        let isDetailedMealPlan = false;

                        mealOrder.forEach(key => {
                            if (plan[key]) {
                                mealsAsObject[key] = plan[key];
                                isDetailedMealPlan = true;
                            }
                        });

                        if (isDetailedMealPlan) {
                    
                            mealOrder.forEach(key => {
                                if (mealsAsObject[key]) {
                                    
                                    const label = mealNameMap[key] || (key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'));
                                    actualMealPlanStrings.push(`${label}: ${mealsAsObject[key]}`);
                                }
                            });
                        } else if (Array.isArray(plan)) {                           
                             actualMealPlanStrings = plan;
                        } else {
                            actualMealPlanStrings = [`No se pudo generar un plan de dieta específico o el formato del objeto es incorrecto: ${JSON.stringify(plan)}`];
                            planTitle = 'Error en Plan de Dieta';
                        }
                    }
                } else if (typeof plan === 'string') {
                    actualMealPlanStrings = [plan];
                    planTitle = 'Consideración Dietética';
                } else {
                    actualMealPlanStrings = ["No se pudo generar un plan de dieta específico o el formato es incorrecto."];
                    planTitle = 'Error en Plan de Dieta';
                }

                if (actualMealPlanStrings.length > 0) {
                    actualMealPlanStrings.forEach(mealString => {
                        const parts = mealString.split(':');
                        const mealLabel = parts[0] ? parts[0].trim() : 'Detalle'; 
                        const mealValue = parts.slice(1).join(':').trim() || mealString; 
                        mealsHtml += `<p><strong>${mealLabel}:</strong> ${mealValue}</p>`;
                    });
                } else {
                    mealsHtml += `<p>No se encontraron detalles para este plan de dieta.</p>`;
                }

                planDiv.innerHTML = `
                    <div class="card-header bg-info text-white">
                        ${planTitle}
                    </div>
                    <div class="card-body">
                        ${mealsHtml}
                    </div>
                `;
                targetResDietPlan.appendChild(planDiv);
            });
        } else {
            targetResDietPlan.innerHTML = '<p>No se encontraron planes de dieta específicos. Intenta ajustar tus selecciones.</p>';
        }
    }
}

// Generar PDF para un usuario dado sus datos
function generatePdfForUser(user, recommendations, imcResult) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Estilos generales
    doc.setFont('helvetica');
    doc.setTextColor(33, 37, 41); 

    let yPos = 20;
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();

    // Título Principal
    doc.setFontSize(24); 
    doc.setTextColor(0, 123, 255);
    doc.text("Recomendaciones Nutricionales NutriCoach", pageWidth / 2, yPos, { align: 'center' });
    yPos += 12; 

    // Línea separadora
    doc.setDrawColor(0, 123, 255);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 12; 
    doc.setTextColor(33, 37, 41); 

    // Función auxiliar para añadir texto con manejo de línea
    const addText = (label, value) => {
        if (yPos > 270) { // Si casi no queda espacio, se agrega una nueva página
            doc.addPage();
            yPos = 20;
        }
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`${label}:`, margin, yPos);
        doc.setFont('helvetica', 'normal');
        const valueText = doc.splitTextToSize(value, pageWidth - 2 * margin - doc.getTextWidth(`${label}: `) - 5); 
        doc.text(valueText, margin + doc.getTextWidth(`${label}: `) + 2, yPos); 
        yPos += (valueText.length * 7) + 4; 
    };

    // Sección de Datos del Usuario
    doc.setFontSize(18); 
    doc.setTextColor(40, 167, 69); 
    doc.text("Datos del Usuario:", margin, yPos);
    yPos += 8; 
    doc.setTextColor(33, 37, 41); 

    addText("Nombre", user.fullName || 'N/A');
    addText("Edad", (user.age || 'N/A') + " años");
    addText("Peso", (user.weightKg ? user.weightKg.toFixed(2) : 'N/A') + " kg");
    addText("Estatura", (user.heightCm || 'N/A') + " cm");
    addText("Género", user.gender === 'male' ? 'Hombre' : (user.gender === 'female' ? 'Mujer' : 'N/A'));
    addText("DUI", (user.dui || 'N/A') + (user.isResponsibleDUI ? ' (Responsable)' : ''));
    const ailmentsText = user.ailments && user.ailments.length > 0
        ? user.ailments.map(a => window.knowledgeBase.recommendations.ailments[a]?.name || a).join(', ')
        : 'Ninguno';
    addText("Padecimientos", ailmentsText);
    addText("IMC", (imcResult.imc ? imcResult.imc.toFixed(2) : 'N/A') + " (" + (imcResult.status || 'N/A') + ")");

    yPos += 15; 

    // Sección de Indicaciones de Hábitos y Rutinas
    doc.setFontSize(18); 
    doc.setTextColor(255, 193, 7); 
    doc.text("Indicaciones de Hábitos y Rutinas:", margin, yPos);
    yPos += 8; // Aumentado el espacio
    doc.setTextColor(33, 37, 41);

    doc.setFontSize(11); 
    const habitsRoutinesText = recommendations.habitsRoutines.map(rec => `- ${rec}`).join('\n');
    const splitHabits = doc.splitTextToSize(habitsRoutinesText, pageWidth - 2 * margin);
    doc.text(splitHabits, margin, yPos);
    yPos += (splitHabits.length * 6) + 15; 

    // Sección de Sugerencias de Dietas Semanales
    doc.setFontSize(18); 
    doc.setTextColor(23, 162, 184); 
    doc.text("Sugerencias de Dietas Semanales:", margin, yPos);
    yPos += 8; 
    doc.setTextColor(33, 37, 41);

    if (recommendations.dietPlan && recommendations.dietPlan.length > 0) {
        recommendations.dietPlan.forEach((plan, index) => {
            if (yPos > 250) { // Nueva página si no hay espacio suficiente para la siguiente tarjeta
                doc.addPage();
                yPos = 20;
            }

            let actualMealPlanStrings = [];
            let planTitle = `Plan de Dieta ${index + 1}`; 

            // Mapeo de nombres de comida en inglés a español para PDF
            const mealNameMap = {
                'breakfast': 'Desayuno',
                'midMorning': 'Media Mañana',
                'lunch': 'Almuerzo',
                'afternoon': 'Merienda',
                'dinner': 'Cena'
            };
            
            const mealOrder = ['breakfast', 'midMorning', 'lunch', 'afternoon', 'dinner'];

            if (typeof plan === 'object' && plan !== null) {
                if (plan.title) {
                    planTitle = plan.title;
                }

                let mealsAsObject = {};

                if (plan.plan && Array.isArray(plan.plan)) {
                    actualMealPlanStrings = plan.plan;
                } else if (typeof plan.diet_restriction === 'string') {
                    actualMealPlanStrings = [plan.diet_restriction];
                    planTitle = plan.title || 'Consideración Dietética';
                } else {
                    let isDetailedMealPlan = false;
                    mealOrder.forEach(key => {
                        if (plan[key]) {
                            mealsAsObject[key] = plan[key];
                            isDetailedMealPlan = true;
                        }
                    });

                    if (isDetailedMealPlan) {
                        mealOrder.forEach(key => {
                            if (mealsAsObject[key]) {
                                const label = mealNameMap[key] || (key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'));
                                actualMealPlanStrings.push(`${label}: ${mealsAsObject[key]}`);
                            }
                        });
                    } else if (Array.isArray(plan)) {
                        actualMealPlanStrings = plan;
                    } else {
                        actualMealPlanStrings = [`No se pudo generar un plan de dieta específico o el formato del objeto es incorrecto: ${JSON.stringify(plan)}`];
                        planTitle = 'Error en Plan de Dieta';
                    }
                }
            } else if (typeof plan === 'string') {
                actualMealPlanStrings = [plan];
                planTitle = 'Consideración Dietética';
            } else {
                actualMealPlanStrings = ["No se pudo generar un plan de dieta específico o el formato es incorrecto."];
                planTitle = 'Error en Plan de Dieta';
            }

            doc.setFontSize(14); 
            doc.setFont('helvetica', 'bold');
            doc.text(planTitle, margin, yPos);
            yPos += 8; 
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(11); 

            if (actualMealPlanStrings.length > 0) {
                actualMealPlanStrings.forEach(mealString => {
                    const parts = mealString.split(':');
                    const mealLabel = parts[0] ? parts[0].trim() : 'Detalle';
                    const mealValue = parts.slice(1).join(':').trim() || mealString;
                    addText(mealLabel, mealValue);
                });
            } else {
                addText("Detalle del plan", "No se encontraron detalles para este plan de dieta.");
            }

            yPos += 10; 
        });
    } else {
        doc.setFontSize(11);
        doc.text("No se encontraron planes de dieta específicos. Intenta ajustar tus selecciones.", margin, yPos);
        yPos += 10;
    }

    // Pie de página 
    doc.setFontSize(9); 
    doc.setTextColor(108, 117, 125);
    doc.text(`Generado por NutriCoach - ${new Date().toLocaleDateString()}`, margin, doc.internal.pageSize.getHeight() - 10);

    // En lugar de doc.save(), devuelve el Blob URL
    return doc.output('bloburl');
}


// Función para guardar PDF con estilos 
savePdfBtn.addEventListener('click', () => {
    if (Object.keys(userData).length === 0 || Object.keys(currentRecommendations).length === 0 || Object.keys(currentIMCResult).length === 0) {
        showCustomAlert("No hay datos de usuario o recomendaciones para generar el PDF. Por favor, completa el proceso de consulta.");
        return;
    }
    const pdfUrl = generatePdfForUser(userData, currentRecommendations, currentIMCResult);
    window.open(pdfUrl, '_blank'); 
});

reviewOptionsBtn.addEventListener('click', () => {

    userDataForm.reset();
    dynamicQuestionsForm.reset();
    document.querySelectorAll('.goal-card').forEach(c => c.classList.remove('selected'));
    selectedGoalId = null;
    dynamicAnswers = {};
    userData = {};
    currentRecommendations = {};
    currentIMCResult = {};

    Array.from(ailmentsSelect.options).forEach(option => {
        option.selected = false;
    });
   
    const noneOption = Array.from(ailmentsSelect.options).find(opt => opt.value === 'none');
    if (noneOption) {
        noneOption.selected = true;
    }

    // Limpiar clases de validación del DUI
    duiInput.classList.remove('is-invalid', 'is-valid');
    duiFeedback.textContent = '';

    showSection(initialDataFormSection); 
});


// --- Lógica de Administración ---

// Listener para el icono de Admin
adminIconLink.addEventListener('click', (e) => {
    e.preventDefault();
    if (auth.currentUser && auth.currentUser.email === 'admin@nutricoach.com') {
        showAdminSection(); 
    } else {
        showAdminSection(true); 
    }
});

// Listener para el botón de Login de Admin
adminLoginBtn.addEventListener('click', async () => {
    const email = adminEmailInput.value;
    const password = adminPasswordInput.value;
    adminLoginMessage.textContent = ''; 

    if (!email || !password) {
        adminLoginMessage.textContent = 'Por favor, ingresa email y contraseña.';
        return;
    }

    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        if (userCredential.user && userCredential.user.email === 'admin@nutricoach.com') {
            console.log('Admin logueado correctamente.');
            adminLoginForm.style.display = 'none';
            adminContent.style.display = 'block';
            loadUsersTable();
            const firstTab = new bootstrap.Tab(usersTabBtn);
            firstTab.show();
        } else {
            adminLoginMessage.textContent = 'Credenciales de administrador inválidas.';
            auth.signOut(); 
        }
    } catch (error) {
        console.error('Error al iniciar sesión como admin:', error);
        adminLoginMessage.textContent = 'Error de autenticación. Verifica las credenciales.';
    }
});

// Listener para el botón de Logout de Admin
adminLogoutBtn.addEventListener('click', async () => {
    try {
        await auth.signOut();
        console.log('Admin deslogueado.');
        adminLoginForm.style.display = 'block';
        adminContent.style.display = 'none';
        adminEmailInput.value = 'admin@nutricoach.com'; 
        adminPasswordInput.value = 'Admin2025'; 
        adminLoginMessage.textContent = '';
        showSection(initialDataFormSection); 
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        showCustomAlert('Hubo un error al cerrar sesión. Por favor, inténtalo de nuevo.');
    }
});


// Función para mostrar la sección de admin
function showAdminSection(showLogin = false) {
    showSection(adminSection);
    if (showLogin) {
        adminLoginForm.style.display = 'block';
        adminContent.style.display = 'none';
    } else {
        adminLoginForm.style.display = 'none';
        adminContent.style.display = 'block';
        loadUsersTable();
    }
}

usersTabBtn.addEventListener('shown.bs.tab', function (e) {
    if (auth.currentUser && auth.currentUser.email === 'admin@nutricoach.com') {
        loadUsersTable();
    }
});


// Función para cargar la tabla de usuarios
async function loadUsersTable() {
    usersTableBody.innerHTML = '<tr><td colspan="9" class="text-center">Cargando usuarios...</td></tr>'; 
    try {
        const querySnapshot = await db.collection('users').orderBy('timestamp', 'desc').get();
        usersTableBody.innerHTML = ''; 

        if (querySnapshot.empty) {
            usersTableBody.innerHTML = '<tr><td colspan="9" class="text-center">No hay usuarios registrados.</td></tr>'; 
            return;
        }

        querySnapshot.forEach(doc => {
            const user = doc.data();
            const userId = doc.id;
            const row = usersTableBody.insertRow();

            const ailmentsText = user.ailments && user.ailments.length > 0
                ? user.ailments.map(a => window.knowledgeBase.recommendations.ailments[a]?.name || a).join(', ')
                : 'Ninguno';

            const goalName = window.knowledgeBase.goals.find(g => g.id === user.selectedGoalId)?.name || user.selectedGoalId || 'N/A';

            row.innerHTML = `
                <td>${user.fullName || 'N/A'}</td>
                <td>${user.dui || 'N/A'} ${user.isResponsibleDUI ? ' (Responsable)' : ''}</td> <!-- Mostrar DUI -->
                <td>${user.age || 'N/A'}</td>
                <td>${user.weightKg ? user.weightKg.toFixed(1) + ' kg' : 'N/A'}</td>
                <td>${user.heightCm ? user.heightCm.toFixed(1) + ' cm' : 'N/A'}</td>
                <td>${user.imcResult ? user.imcResult.imc.toFixed(1) + ' (' + user.imcResult.status + ')' : 'N/A'}</td>
                <td>${ailmentsText}</td>
                <td>
                    <a href="#" class="view-recommendations-link" data-id="${userId}">
                        ${goalName}
                    </a>
                </td>
                <td>
                    <button class="btn btn-sm btn-info edit-user-btn" data-id="${userId}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger delete-user-btn" data-id="${userId}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            `;
        });

        document.querySelectorAll('.edit-user-btn').forEach(button => {
            button.addEventListener('click', (e) => editUser(e.currentTarget.dataset.id));
        });
        document.querySelectorAll('.delete-user-btn').forEach(button => {
            button.addEventListener('click', (e) => deleteUser(e.currentTarget.dataset.id));
        });
        // Listener para los enlaces de ver recomendaciones
        document.querySelectorAll('.view-recommendations-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault(); 
                viewUserRecommendations(e.currentTarget.dataset.id, true); 
            });
        });

    } catch (error) {
        console.error("Error al cargar usuarios:", error);
        usersTableBody.innerHTML = '<tr><td colspan="9" class="text-center text-danger">Error al cargar usuarios.</td></tr>'; 
    }
}

// Función para abrir el modal de edición de usuario
async function editUser(userId) {
    try {
        const doc = await db.collection('users').doc(userId).get();
        if (!doc.exists) {
            showCustomAlert('Usuario no encontrado.');
            return;
        }
        const user = doc.data();

        editUserIdInput.value = userId;
        editFullNameInput.value = user.fullName || '';
        editAgeInput.value = user.age || ''; 
        editWeightInput.value = user.weightKg || '';
        editHeightInput.value = user.heightCm || '';
        editGenderSelect.value = user.gender || 'male';

        editDUIInput.value = user.dui || '';
        editDUIInput.classList.remove('is-invalid', 'is-valid'); 
        editDuiFeedback.textContent = '';

        // Ocultar/mostrar el campo DUI según la edad
        if (user.age >= 18) {
            editDuiContainer.style.display = 'none'; // Ocultar el campo DUI
            editDUIInput.removeAttribute('required'); // No requerido si está oculto
        } else {
            editDuiContainer.style.display = 'block'; // Mostrar el campo DUI
            editDUIInput.setAttribute('required', 'true'); // Requerido si está visible
        }

        // Padecimientos: deseleccionar todos y luego seleccionar los correctos
        Array.from(editAilmentsSelect.options).forEach(option => {
            option.selected = false;
        });
        if (user.ailments && user.ailments.length > 0) {
            user.ailments.forEach(ailment => {
                const option = Array.from(editAilmentsSelect.options).find(opt => opt.value === ailment);
                if (option) option.selected = true;
            });
        }
       
        if (!user.ailments || user.ailments.length === 0 || (user.ailments.length === 1 && user.ailments[0] === 'none')) {
            const noneOption = Array.from(editAilmentsSelect.options).find(opt => opt.value === 'none');
            if (noneOption) noneOption.selected = true; 
        }


        // Poblar opciones de objetivo en el modal
        editGoalSelect.innerHTML = '';
        window.knowledgeBase.goals.forEach(goal => {
            const opt = document.createElement('option');
            opt.value = goal.id;
            opt.textContent = goal.name;
            editGoalSelect.appendChild(opt);
        });

        editGoalSelect.value = user.selectedGoalId || '';
     
        populateDynamicQuestions(user.selectedGoalId, editDynamicQuestionsContainer, user.dynamicAnswers || {});

        const oldEditGoalSelect = editGoalSelect;
        const newEditGoalSelect = oldEditGoalSelect.cloneNode(true);
        oldEditGoalSelect.parentNode.replaceChild(newEditGoalSelect, oldEditGoalSelect);
      
        editGoalSelect = newEditGoalSelect;

        editGoalSelect.addEventListener('change', () => {
            populateDynamicQuestions(editGoalSelect.value, editDynamicQuestionsContainer, {});
        });
        editUserModalInstance.show();

    } catch (error) {
        console.error("Error al cargar datos del usuario para edición:", error);
        showCustomAlert("Error al cargar los datos del usuario. " + error.message);
    }
}

// Manejador del formulario de edición de usuario
editUserForm.addEventListener('submit', async (e) => {
    e.preventDefault(); 

    let formIsValid = editUserForm.checkValidity();
    let duiToSave = editDUIInput.value;
    let originalUserDUI = null; 
    let isResponsibleDUI = false; 

    try {
        // Obtener el usuario original para comparar el DUI
        const originalDoc = await db.collection('users').doc(editUserIdInput.value).get();
        if (!originalDoc.exists) {
            showCustomAlert('Usuario original no encontrado para edición.');
            formIsValid = false;
            return; // Salir si no se encuentra el usuario original
        }
        originalUserDUI = originalDoc.data().dui;

        const newAge = parseInt(editAgeInput.value); 

        // Validar el formato del DUI si el campo está visible
        if (editDuiContainer.style.display !== 'none') {
            const duiIsValid = validateEditDUI(editDUIInput, editDuiContainer);
            if (!duiIsValid) {
                formIsValid = false;
            }
        } else {
            // Si el campo DUI está oculto (usuario >= 18), se usa el DUI original del usuario
            duiToSave = originalUserDUI;
        }

        if (newAge >= 18) {
            const usersRef = db.collection('users');
            const querySnapshot = await usersRef
                .where('dui', '==', duiToSave)
                .get();

            if (!querySnapshot.empty) {
                const otherUsersWithSameDUI = querySnapshot.docs.filter(doc => doc.id !== editUserIdInput.value);
                if (otherUsersWithSameDUI.length > 0) {
                    editDUIInput.classList.add('is-invalid');
                    editDuiFeedback.textContent = 'Este DUI ya está registrado para otro usuario mayor de edad y este usuario ahora es mayor de edad. Por favor, cambia el DUI.';
                    formIsValid = false;
                }
            }
            isResponsibleDUI = false; 
        } else { 
            const usersRef = db.collection('users');
            const querySnapshot = await usersRef.where('dui', '==', duiToSave).get();

            if (!querySnapshot.empty) {
                const isMyDUI = querySnapshot.docs.some(doc => doc.id === editUserIdInput.value);
                if (!isMyDUI) {
                    isResponsibleDUI = true; 
                } else {
                    isResponsibleDUI = false; 
                }
            } else {
                isResponsibleDUI = false; 
            }
        }

    } catch (error) {
        console.error("Error al verificar unicidad del DUI durante la edición:", error);
        showCustomAlert("Error al verificar la unicidad del DUI. Por favor, inténtelo de nuevo.");
        formIsValid = false;
    }

    if (!formIsValid) {
        e.stopPropagation(); 
        editUserForm.classList.add('was-validated'); 
        return; 
    }

    const userId = editUserIdInput.value;
    const updatedUserData = {
        fullName: editFullNameInput.value.trim(),
        age: parseInt(editAgeInput.value),
        weightKg: parseFloat(editWeightInput.value),
        heightCm: parseFloat(editHeightInput.value),
        gender: editGenderSelect.value,
        dui: duiToSave, 
        isResponsibleDUI: isResponsibleDUI, 

        ailments: Array.from(editAilmentsSelect.selectedOptions)
                    .map(option => option.value)
                    .filter(a => a !== 'none' || Array.from(editAilmentsSelect.selectedOptions).length === 1 && a === 'none'), 
        selectedGoalId: editGoalSelect.value,
        dynamicAnswers: {}
    };

    const goalQuestions = window.knowledgeBase.questions[updatedUserData.selectedGoalId];
    if (goalQuestions) {
        goalQuestions.forEach(q => {
            if (q.type === 'select' || q.type === 'number') {
                const inputElement = editDynamicQuestionsContainer.querySelector(`#${q.id}`);
                if (inputElement) {
                    updatedUserData.dynamicAnswers[q.id] = inputElement.value;
                    if (q.type === 'number') {
                        updatedUserData.dynamicAnswers[q.id] = parseFloat(updatedUserData.dynamicAnswers[q.id]);
                    }
                }
            } else if (q.type === 'radio') {
                const selectedRadio = editDynamicQuestionsContainer.querySelector(`input[name="${q.id}"]:checked`);
                if (selectedRadio) {
                    updatedUserData.dynamicAnswers[q.id] = selectedRadio.value;
                }
            }
        });
    }

    // Recalcular IMC y recomendaciones con los datos actualizados
    const result = inferenceEngine.generateRecommendations(updatedUserData, window.knowledgeBase);
    updatedUserData.imcResult = result.imcResult;
    updatedUserData.recommendations = {
        habitsRoutines: result.habitsRoutines,
        dietPlan: result.dietPlan
    };
    updatedUserData.timestamp = firebase.firestore.FieldValue.serverTimestamp();

    try {
        await db.collection('users').doc(userId).update(updatedUserData);
        console.log('Usuario actualizado exitosamente:', userId);
        showCustomAlert('Usuario y recomendaciones actualizadas.');
        editUserModalInstance.hide();
        loadUsersTable(); 
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        showCustomAlert('Error al guardar los cambios del usuario. ' + error.message);
    }
    editUserForm.classList.remove('was-validated');
});


// Función para mostrar el plan nutricional de un usuario en un modal O descargar PDF
async function viewUserRecommendations(userId, downloadPdf = false) {
    try {
        const doc = await db.collection('users').doc(userId).get();
        if (!doc.exists) {
            showCustomAlert('Usuario no encontrado.');
            return;
        }
        const user = doc.data();

        if (!user.recommendations || !user.imcResult) {
            showCustomAlert('Este usuario aún no tiene recomendaciones generadas.');
            return;
        }

        if (downloadPdf) {
            const pdfUrl = generatePdfForUser(user, user.recommendations, user.imcResult);
            window.open(pdfUrl, '_blank');
        } else {
            const recsContainerElements = {
                resHabitsRoutines: viewRecsHabitsRoutines,
                resDietPlan: viewRecsDietPlan
            };

            displayResults(user, user.recommendations, user.imcResult, recsContainerElements);
            viewRecommendationsModalInstance.show();
        }
    } catch (error) {
        console.error("Error al cargar las recomendaciones del usuario:", error);
        showCustomAlert("Error al cargar el plan nutricional. " + error.message);
    }
}


// Función para eliminar un usuario
async function deleteUser(userId) {
    showCustomConfirm('¿Estás seguro de que quieres eliminar a este usuario? Esta acción es irreversible.', async () => {
        try {
            await db.collection('users').doc(userId).delete();
            console.log('Usuario eliminado:', userId);
            showCustomAlert('Usuario eliminado exitosamente.');
            loadUsersTable(); 
        }
        catch (error) {
            console.error('Error al eliminar usuario:', error);
            showCustomAlert('Error al eliminar el usuario. ' + error.message);
        }
    });
}

// FUNCIONES PARA MENSAJES PERSONALIZADOS 

// Mini-modal de alerta para reemplazo de alert()
function showCustomAlert(message) {

    console.warn("Custom Alert (replace with Bootstrap Modal):", message);
    alert(message); 
}

// Mini-modal de confirmación para reemplazo de confirm()
function showCustomConfirm(message, onConfirm) {
    console.warn("Custom Confirm (replace with Bootstrap Modal):", message);
    if (confirm(message)) { 
        onConfirm();
    }
}