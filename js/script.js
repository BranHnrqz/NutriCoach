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
const duiInput = document.getElementById('duiInput'); 
const ageInput = document.getElementById('age');
const weightInput = document.getElementById('weight');
const weightUnitSelect = document.getElementById('weightUnit');
const convertWeightBtn = document.getElementById('convertWeightBtn');
const heightInput = document.getElementById('height');
const genderSelect = document.getElementById('gender');
const ailmentsSelect = document.getElementById('ailments'); 

const goalOptionsContainer = document.getElementById('goalOptions');
const dynamicQuestionsForm = document.getElementById('dynamicQuestionsForm');

const resFullName = document.getElementById('resFullName');
const resDUI = document.getElementById('resDUI');
const resAge = document.getElementById('resAge');
const resWeight = document.getElementById('resWeight');
const resHeight = document.getElementById('resHeight');
const resGender = document.getElementById('resGender');
const resAilments = document.getElementById('resAilments');
const resIMC = document.getElementById('resIMC');
const resIMCStatus = document.getElementById('resIMCStatus');
const resGoal = document.getElementById('resGoal');
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
const editDUIInput = document.getElementById('editDUI'); 
const editAgeInput = document.getElementById('editAge');
const editWeightInput = document.getElementById('editWeight');
const editHeightInput = document.getElementById('editHeight');
let editGenderSelect = document.getElementById('editGender'); 
let editAilmentsSelect = document.getElementById('editAilments'); 
let editGoalSelect = document.getElementById('editGoal');
const editDynamicQuestionsContainer = document.getElementById('editDynamicQuestionsContainer');

//Elementos del DOM para el modal de ver recomendaciones
const viewRecsHabitsRoutines = document.getElementById('viewRecsHabitsRoutines');
const viewRecsDietPlan = document.getElementById('viewRecsDietPlan');


//Elemento para el enlace Home
const homeLink = document.getElementById('home-link');
//Elemento para la pestaña de usuarios en el admin
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

    // Verificación para asegurarse de que knowledgeBase.goals esté disponible
    // Usamos 'window.knowledgeBase' para asegurar que accedemos a la variable global
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
            defaultOpt.selected = true; // Por defecto seleccionada

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

                // ID único para cada radio button para evitar conflictos en el DOM
                
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

        formContainer.appendChild(div); // Añadir al formulario
    });

    // Solo si es el formulario de consulta inicial, añadir el botón de submit
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
            // Ordenar padecimientos para generar una clave consistente
            const sortedAilments = [...user.ailments].sort();
            const combinationKey = sortedAilments.join('_');

            let foundAilmentDiet = false;

            // Intentar encontrar una dieta combinada específica
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

            // Si no hay combinación específica, añadir restricciones individuales
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

                // Si no hay dietas por padecimientos y el objetivo es, por ejemplo, pérdida de peso,
                // entonces la dieta principal es la del IMC + ajustes del objetivo.
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

        // Combinar todas las restricciones de dieta en una sola recomendación de hábitos
        if (dietRestrictions.length > 0) {
            habitsRoutines.push(`**Consideraciones Dietéticas Adicionales por Padecimientos:** ${dietRestrictions.join(' ')}`);
        }

        // Filtrar hábitos duplicados o vacíos
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
 * Se llama si no se encuentra la KB en Firestore.
 * Retorna true si la subida fue exitosa, false de lo contrario.
 */

async function uploadKnowledgeBaseToFirestore() {
    try {

        if (typeof window.knowledgeBase === 'undefined' || Object.keys(window.knowledgeBase).length === 0 || !window.knowledgeBase.goals) {
            console.warn("La variable 'knowledgeBase' no está definida o está vacía. Asegúrate de que knowledgeBase.js se cargue ANTES de esta función para la subida inicial.");
            return false;
        }

        await db.collection('knowledgeBase').doc('current').set(window.knowledgeBase);
        console.log("Base de conocimientos subida a Firestore exitosamente.");
        alert("Base de conocimientos subida a Firestore. Ahora puedes comentar la línea de carga de knowledgeBase.js en app.html para futuras ejecuciones.");
        return true;
    } catch (error) {
        console.error("Error al subir la base de conocimientos a Firestore: ", error);
        alert("Error al subir la base de conocimientos. Revisa la consola y tus reglas de seguridad de Firestore. El error es: " + error.message);
        return false;
    }
}

/**
 * Función para cargar la base de conocimientos desde Firestore.
 * Retorna true si la carga fue exitosa, false si el documento no existe (pero sin error de conexión).
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
        alert("Error crítico al cargar la base de conocimientos. Revisa tu conexión a Firebase, tus credenciales o si la base de datos existe. El error es: " + error.message);
        return false; // Error real de conexión o permisos
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
                alert("¡Error grave! No se pudo cargar ni inicializar la base de conocimientos. Por favor, revisa la consola para más detalles y asegúrate de que tus credenciales y reglas de Firebase sean correctas.");
            }
        } else {
            console.error("Fallo crítico: knowledgeBase.js no está cargado/definido y la KB no está en Firestore. No se puede inicializar la aplicación.");
            alert("¡Error grave! La base de conocimientos no se cargó. Asegúrate de que 'knowledgeBase.js' esté cargado y definido ANTES de que intente buscar en Firebase la primera vez.");
        }
    } else {
        console.log("KB cargada desde Firestore. La aplicación puede iniciar.");
        populateGoalOptions();
        showSection(initialDataFormSection);
    }
}

// Listeners

document.addEventListener('DOMContentLoaded', initApp);

//Listener para el botón/enlace Home
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
        weight = weight * 0.453592; // Convertir lbs a kg
        alert(`El peso en Kg es: ${weight.toFixed(2)} kg`);
    } else {
        weight = weight / 0.453592; // Convertir kg a lbs
        alert(`El peso en Lbs es: ${weight.toFixed(2)} lbs`);
    }
});


// Manejador del formulario de datos iniciales
userDataForm.addEventListener('submit', async (e) => {
    e.preventDefault(); 

    if (!userDataForm.checkValidity()) {
        e.stopPropagation();
        userDataForm.classList.add('was-validated');
        return;
    }

// Validación del formato del DUI
    const duiValue = duiInput.value.trim();
    const ageValue = parseInt(ageInput.value); // Obtener la edad
    const duiRegex = /^\d{8}-\d{1}$/; // Formato esperado: 8 dígitos, guion, 1 dígito

    if (!duiRegex.test(duiValue)) {
        duiInput.classList.add('is-invalid');
        duiInput.nextElementSibling.textContent = 'El formato del DUI debe ser 01234567-8';
        return;
    } else {
        duiInput.classList.remove('is-invalid');
        duiInput.nextElementSibling.textContent = 'Por favor, ingresa un DUI válido (9 dígitos y guion).';
    }

    // Validación de DUIs (Usuarios mayores de edad, no pueden repetirlo; menores, si)
    try {
        const usersRef = db.collection('users');
        const querySnapshot = await usersRef.where('dui', '==', duiValue).get();

        if (!querySnapshot.empty) {
            // Si el DUI ya existe, verificamos si es una excepción válida
            let isDuplicateButAllowed = false;

            querySnapshot.forEach(doc => {
                const existingUser = doc.data();
                const existingUserAge = parseInt(existingUser.age);

                // Esto permite al menor usar el DUI del responsable.
                if (existingUserAge >= 18 && ageValue < 18) {
                    isDuplicateButAllowed = true;
                }
               
                // Esto permite al responsable registrarse si ya tiene un menor a su cargo con ese DUI.
                else if (existingUserAge < 18 && ageValue >= 18) {
                    isDuplicateButAllowed = true;
                }
                // Si el DUI existe y NO es ninguna de las excepciones anteriores (ambos son adultos o ambos son menores con el mismo DUI),
                // entonces es una duplicación no permitida.
                else if (existingUserAge >= 18 && ageValue >= 18) {
                    isDuplicateButAllowed = false;
                }
        
                else if (existingUserAge < 18 && ageValue < 18) {
                    isDuplicateButAllowed = false;
                }
            });

            if (!isDuplicateButAllowed) {
                alert('ERROR: El Usuario que intentas ingresar YA HA SIDO REGISTRADO con este DUI y no cumple las condiciones para ser un registro de responsable/menor.');
                return; 
            }
        }
    } catch (error) {
        console.error("Error al verificar DUI duplicado:", error);
        alert("Ocurrió un error al verificar el DUI. Por favor, intenta de nuevo.");
        return;
    }

    // Recolectar datos del usuario
    const selectedAilments = Array.from(ailmentsSelect.selectedOptions).map(option => option.value);
   
    const actualAilments = selectedAilments.includes('none') && selectedAilments.length > 1
        ? selectedAilments.filter(a => a !== 'none')
        : (selectedAilments.includes('none') && selectedAilments.length === 1 ? [] : selectedAilments);


    userData = {
        fullName: fullNameInput.value.trim(),
        dui: duiInput.value.trim(),
        age: parseInt(ageInput.value),
        weightKg: parseFloat(weightInput.value), // Supuestamente siempre se guarda en KG xd. (ojalá)
        heightCm: parseFloat(heightInput.value),
        gender: genderSelect.value,
        ailments: actualAilments
    };


    // Si se guarda exitosamente, proceder a la siguiente sección
    populateGoalOptions(); 
    showSection(goalSelectionSection);

    userDataForm.classList.remove('was-validated');
});


// Manejador del formulario de preguntas dinámicas
dynamicQuestionsForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validar el formulario de preguntas dinámicas
    if (!dynamicQuestionsForm.checkValidity()) {
        e.stopPropagation();
        dynamicQuestionsForm.classList.add('was-validated');
        return;
    }

    // Respuestas dinámicas
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
            timestamp: firebase.firestore.FieldValue.serverTimestamp() // Agrega la marca de tiempo del servidor
        });
        console.log("Datos completos del usuario guardados en Firestore con ID: ", docRef.id);
        userData.firestoreId = docRef.id; // Guarda el ID de Firestore en el objeto userData

    } catch (error) {
        console.error("Error al guardar los datos completos del usuario en Firestore: ", error);
        alert("Hubo un error al guardar tus datos. Por favor, inténtalo de nuevo. El error es: " + error.message);
        dynamicQuestionsForm.classList.add('was-validated'); 
        return; 
    }


    // Mostrar resultados
    displayResults(fullUserData, currentRecommendations, currentIMCResult);
    showSection(resultsDisplaySection);

    dynamicQuestionsForm.classList.remove('was-validated');
});

function displayResults(user, recommendations, imcResult, incomingElements) {

    // --- DIAGNÓSTICO GENERAL ---
    console.log(">>> displayResults INICIO <<<");
    console.log("User object recibido en displayResults:", user);
    console.log("Recommendations object recibido en displayResults:", recommendations);
    console.log("IMC Result recibido en displayResults:", imcResult);
    console.log("incomingElements recibido en displayResults:", incomingElements);
   
    const elements = incomingElements || {};

    // Obtener referencias a los elementos DOM, usando los elementos pasados en 'elements' si existen,

    const _resFullName = elements.resFullName || resFullName;
    const _resDUI = elements.resDUI || resDUI;
    const _resAge = elements.resAge || resAge;
    const _resWeight = elements.resWeight || resWeight;
    const _resHeight = elements.resHeight || resHeight;
    const _resGender = elements.resGender || resGender;
    const _resAilments = elements.resAilments || resAilments;
    const _resIMC = elements.resIMC || resIMC;
    const _resIMCStatus = elements.resIMCStatus || resIMCStatus;
    const _resGoal = elements.resGoal || resGoal;
    const _resHabitsRoutines = elements.resHabitsRoutines || resHabitsRoutines;
    const _resDietPlan = elements.resDietPlan || resDietPlan;

    console.log("DEBUG_DOM: Elemento _resFullName:", _resFullName);
    console.log("DEBUG_DOM: Elemento _resDUI:", _resDUI);
    console.log("DEBUG_DOM: Elemento _resAge:", _resAge);
    console.log("DEBUG_DOM: Elemento _resWeight:", _resWeight);
    console.log("DEBUG_DOM: Elemento _resHeight:", _resHeight);
    console.log("DEBUG_DOM: Elemento _resGender:", _resGender);
    console.log("DEBUG_DOM: Elemento _resAilments:", _resAilments);
    console.log("DEBUG_DOM: Elemento _resIMC:", _resIMC);
    console.log("DEBUG_DOM: Elemento _resIMCStatus:", _resIMCStatus);
    console.log("DEBUG_DOM: Elemento _resGoal:", _resGoal);
    console.log("DEBUG_DOM: Elemento _resHabitsRoutines:", _resHabitsRoutines);
    console.log("DEBUG_DOM: Elemento _resDietPlan:", _resDietPlan);


    // Poblar los datos del usuario
    if (_resFullName && user.fullName) {
        _resFullName.textContent = user.fullName;
    }

    // Lógica para mostrar DUI y añadir la etiqueta "Responsable" si es menor de edad
    if (_resDUI && user.dui) {
        let duiText = user.dui;
        if (user.age < 18) {
            duiText += " (Responsable)";
        }
        _resDUI.textContent = duiText;
    } else if (_resDUI) {
        _resDUI.textContent = 'No registrado';
    }

    // Mostrar Edad, Peso y Estatura 
    if (_resAge && user.age) {
        _resAge.textContent = user.age;
    }
    if (_resWeight && user.weightKg) {
        _resWeight.textContent = user.weightKg;
    } else if (_resWeight) {
        _resWeight.textContent = 'N/A';
    }
    if (_resHeight && user.heightCm) {
        _resHeight.textContent = user.heightCm;
    } else if (_resHeight) {
        _resHeight.textContent = 'N/A';
    }

    // Traducción del Género 
    if (_resGender && user.gender) {
        let translatedGender = user.gender;
        switch (user.gender.toLowerCase()) {
            case 'male':
                translatedGender = 'Masculino';
                break;
            case 'female':
                translatedGender = 'Femenino';
                break;
            case 'other':
                translatedGender = 'Otro';
                break;
            default:
                translatedGender = user.gender;
                break;
        }
        _resGender.textContent = translatedGender;
    } else if (_resGender) {
        _resGender.textContent = 'N/A';
    }


    // Mostrar Padecimientos 
    if (_resAilments) {
        console.log("DEBUG_PADECIMIENTOS: user.ailments recibido:", user.ailments);
        if (Array.isArray(user.ailments) && user.ailments.length > 0 && !user.ailments.includes('none')) {
            const translatedAilments = user.ailments.map(ailmentKey => {
              
                if (window.knowledgeBase && window.knowledgeBase.recommendations &&
                    window.knowledgeBase.recommendations.ailments &&
                    window.knowledgeBase.recommendations.ailments[ailmentKey]) { 
                    console.log(`DEBUG_PADECIMIENTOS: Traduciendo "${ailmentKey}" a "${window.knowledgeBase.recommendations.ailments[ailmentKey].name}"`);
                    return window.knowledgeBase.recommendations.ailments[ailmentKey].name;
                }
                console.warn(`DEBUG_PADECIMIENTOS: No se encontró traducción en knowledgeBase para la clave "${ailmentKey}". Usando original.`);
                return ailmentKey;
            });
            _resAilments.textContent = translatedAilments.join(', ');
        } else {
            _resAilments.textContent = 'Ninguno';
            console.log("DEBUG_PADECIMIENTOS: No hay padecimientos seleccionados o el array está vacío/incluye 'none'.");
        }
    } else {
        console.error("DEBUG_PADECIMIENTOS: Elemento DOM _resAilments no encontrado. Asegúrate de que el ID 'resAilments' exista en tu HTML.");
    }


    // Poblar los resultados de IMC
    if (_resIMC && imcResult && imcResult.imc) {
        _resIMC.textContent = imcResult.imc;
    }
    if (_resIMCStatus && imcResult && imcResult.status) {
        _resIMCStatus.textContent = imcResult.status;
    }

    // Mostrar el objetivo
    if (_resGoal && user.selectedGoalId && window.knowledgeBase.goals[user.selectedGoalId]) {
        _resGoal.textContent = window.knowledgeBase.goals[user.selectedGoalId].name;
    }

    // Mostrar Hábitos y Rutinas
    if (_resHabitsRoutines && recommendations.habitsRoutines) {
        _resHabitsRoutines.innerHTML = '';
        if (Array.isArray(recommendations.habitsRoutines)) {
            recommendations.habitsRoutines.forEach(item => {
                const listItem = document.createElement('li');
                listItem.textContent = item;
                _resHabitsRoutines.appendChild(listItem);
            });
        } else {
            _resHabitsRoutines.textContent = recommendations.habitsRoutines;
        }
    } else if (_resHabitsRoutines) {
        _resHabitsRoutines.innerHTML = '<li>No hay recomendaciones de hábitos disponibles.</li>';
    }


    // Mostrar Plan de Dieta Semanal 
    if (_resDietPlan) {
        console.log("DEBUG_DIET: Elemento _resDietPlan existe:", _resDietPlan);
        if (recommendations.dietPlan && Array.isArray(recommendations.dietPlan) && recommendations.dietPlan.length > 0) {
            _resDietPlan.innerHTML = ''; // Limpiar cualquier contenido previo
            console.log("DEBUG_DIET: recommendations.dietPlan es un array no vacío. Longitud:", recommendations.dietPlan.length);

            // Definir el orden de las comidas y sus traducciones
            const mealOrder = ['breakfast', 'midMorning', 'lunch', 'afternoon', 'dinner']; 
            const mealTranslations = {
                breakfast: 'Desayuno',
                midMorning: 'Media Mañana',
                lunch: 'Almuerzo',
                afternoon: 'Media Tarde', 
                dinner: 'Cena'
            };

            recommendations.dietPlan.forEach((dietObject, index) => {
              
                if (typeof dietObject === 'object' && dietObject !== null) {
                    console.log(`DEBUG_DIET: Procesando dietObject[${index}]:`, dietObject);

                    // Título del plan de dieta 
                    const planTitle = dietObject.title || `Plan de Dieta ${index + 1}`;
                    const titleItem = document.createElement('li');
                    titleItem.classList.add('list-group-item', 'fw-bold', 'mt-2', 'bg-light');
                    titleItem.textContent = planTitle;
                    _resDietPlan.appendChild(titleItem);
                    console.log(`DEBUG_DIET: Añadido título del plan: "${planTitle}"`);

                    // Resumen de restricciones 
                    if (dietObject.restriction_summary) {
                        const restrictionSummaryItem = document.createElement('li');
                        restrictionSummaryItem.classList.add('list-group-item', 'fst-italic', 'text-muted', 'small');
                        restrictionSummaryItem.textContent = `Resumen: ${dietObject.restriction_summary}`;
                        _resDietPlan.appendChild(restrictionSummaryItem);
                        console.log(`DEBUG_DIET: Añadido resumen de restricciones: "${dietObject.restriction_summary}"`);
                    }


                    // Iteración de las ccomidas en el orden definido
                    mealOrder.forEach(mealKey => {
                        if (dietObject[mealKey]) { 
                            const mealItem = document.createElement('li');
                            mealItem.classList.add('list-group-item', 'ms-3');
                           
                            mealItem.textContent = `${mealTranslations[mealKey] || mealKey}: ${dietObject[mealKey]}`;
                            _resDietPlan.appendChild(mealItem);
                            console.log(`DEBUG_DIET: Añadido elemento de comida [${index}][${mealKey}]: "${dietObject[mealKey]}"`);
                        } else {
                            console.log(`DEBUG_DIET: La comida '${mealKey}' no está presente en dietObject[${index}].`);
                        }
                    });

                   
                    if (recommendations.dietPlan.length > 1 && index < recommendations.dietPlan.length - 1) {
                        const separator = document.createElement('hr');
                        _resDietPlan.appendChild(separator);
                        console.log("DEBUG_DIET: Añadido separador entre planes.");
                    }

                } else {
                    
                    const listItem = document.createElement('li');
                    listItem.classList.add('list-group-item', 'text-danger');
                    listItem.textContent = `ERROR: Formato de plan de dieta inesperado para el índice ${index}. Objeto: ${JSON.stringify(dietObject)}.`;
                    _resDietPlan.appendChild(listItem);
                    console.error(`DEBUG_DIET: ${listItem.textContent}`);
                }
            });
        } else {
            // Mensaje si no hay ningún plan de dieta en recommendations o si el array está vacío
            _resDietPlan.innerHTML = '<li class="list-group-item">No se pudo generar un plan de dieta específico o no hay datos de dietas.</li>';
            console.log("DEBUG_DIET: recommendations.dietPlan es nulo, no es un array o está vacío.");
        }
    } else {
        console.error("DEBUG_DIET: Elemento DOM _resDietPlan no encontrado. Asegúrate de que el ID 'resDietPlan' exista en tu HTML.");
    }


    
    if (!incomingElements && resultsDisplaySection) {
        resultsDisplaySection.style.display = 'block';
        resultsDisplaySection.classList.add('animate__fadeIn');
        console.log("DEBUG_DISPLAY: Mostrando resultsDisplaySection.");
    }
    console.log(">>> displayResults FIN <<<");
}

// Función para guardar PDF con estilos
savePdfBtn.addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Estilos generales
    doc.setFont('helvetica');
    doc.setTextColor(33, 37, 41); // Color oscuro para el texto principal

    let yPos = 20;
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();

    // Título Principal
    doc.setFontSize(22);
    doc.setTextColor(0, 123, 255); 
    doc.text("Recomendaciones Nutricionales NutriCoach", pageWidth / 2, yPos, { align: 'center' });
    yPos += 10;

    // Línea separadora
    doc.setDrawColor(0, 123, 255);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 10;
    doc.setTextColor(33, 37, 41);

    // Función auxiliar para añadir texto con manejo de línea
    const addText = (label, value) => {
        if (yPos > 270) { 
            doc.addPage();
            yPos = 20;
            doc.setFontSize(10);
        }
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`${label}:`, margin, yPos);
        doc.setFont('helvetica', 'normal');
        const valueText = doc.splitTextToSize(value, pageWidth - 2 * margin - doc.getTextWidth(`${label}: `));
        doc.text(valueText, margin + doc.getTextWidth(`${label}: `), yPos);
        yPos += (valueText.length * 7) + 3; 
    };

    // Sección de Datos del Usuario
    doc.setFontSize(16);
    doc.setTextColor(40, 167, 69); 
    doc.text("Datos del Usuario:", margin, yPos);
    yPos += 7;
    doc.setTextColor(33, 37, 41); 

    addText("Nombre", resFullName.textContent);
    addText("Edad", resAge.textContent + " años");
    addText("Peso", resWeight.textContent + " kg");
    addText("Estatura", resHeight.textContent + " cm");
    addText("Género", resGender.textContent);
    addText("Padecimientos", resAilments.textContent);
    addText("IMC", resIMC.textContent + " (" + resIMCStatus.textContent + ")");

    yPos += 10;

    // Sección de Indicaciones de Hábitos y Rutinas
    doc.setFontSize(16);
    doc.setTextColor(255, 193, 7); 
    doc.text("Indicaciones de Hábitos y Rutinas:", margin, yPos);
    yPos += 7;
    doc.setTextColor(33, 37, 41);

    const habitsRoutinesListItems = Array.from(resHabitsRoutines.querySelectorAll('li')).map(li => `- ${li.textContent}`);
    const habitsRoutinesText = habitsRoutinesListItems.join('\n');
    const splitHabits = doc.splitTextToSize(habitsRoutinesText, pageWidth - 2 * margin);
    doc.setFontSize(11);
    doc.text(splitHabits, margin, yPos);
    yPos += (splitHabits.length * 6) + 10;

    // Sección de Sugerencias de Dietas Semanales
    doc.setFontSize(16);
    doc.setTextColor(23, 162, 184); 
    doc.text("Sugerencias de Dietas Semanales:", margin, yPos);
    yPos += 7;
    doc.setTextColor(33, 37, 41);

    const dietPlanCards = resDietPlan.querySelectorAll('.card');
    if (dietPlanCards.length === 0) {
        doc.setFontSize(11);
        doc.text("No se encontraron planes de dieta específicos. Intenta ajustar tus selecciones.", margin, yPos);
        yPos += 10;
    } else {
        dietPlanCards.forEach(card => {
            if (yPos > 250) { 
                doc.addPage();
                yPos = 20;
                doc.setFontSize(11);
            }

            const title = card.querySelector('.card-header').innerText;
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text(title, margin, yPos);
            yPos += 7;
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);

            const meals = ['Desayuno', 'Media Mañana', 'Almuerzo', 'Merienda', 'Cena'];
            meals.forEach((meal, index) => {
                const pElement = card.querySelector(`p:nth-child(${index + 1})`);
                const mealText = pElement ? pElement.innerText : `${meal}: No especificado`;
                const [mealLabel, mealValue] = mealText.split(':');
                if (mealValue) {
                    addText(mealLabel.trim(), mealValue.trim());
                } else {
                     addText(mealLabel.trim(), 'No especificado');
                }
            });
            yPos += 5; 
        });
    }

    // Pie de página 
    doc.setFontSize(8);
    doc.setTextColor(108, 117, 125);
    doc.text(`Generado por NutriCoach - ${new Date().toLocaleDateString()}`, margin, doc.internal.pageSize.getHeight() - 10);

    doc.save("NutriCoach_Recomendaciones.pdf");
});


// Botón para volver a revisar opciones
reviewOptionsBtn.addEventListener('click', () => {
    // Limpiar campos o resetear estados si es necesario
    userDataForm.reset();
    dynamicQuestionsForm.reset();
    document.querySelectorAll('.goal-card').forEach(c => c.classList.remove('selected'));
    selectedGoalId = null;
    dynamicAnswers = {};
    userData = {};
    currentRecommendations = {};
    currentIMCResult = {};

    // DESMARCAR todas las opciones en el select de padecimientos
    Array.from(ailmentsSelect.options).forEach(option => {
        option.selected = false;
    });

    const noneOption = Array.from(ailmentsSelect.options).find(opt => opt.value === 'none');
    if (noneOption) {
        noneOption.selected = true;
    }


    showSection(initialDataFormSection); 
});


// Lógica de Administración

// Listener para el icono de Admin
adminIconLink.addEventListener('click', (e) => {
    e.preventDefault();
    // Verificar si el usuario ya está logueado como admin
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
        alert('Hubo un error al cerrar sesión. Por favor, inténtalo de nuevo.');
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
    usersTableBody.innerHTML = '<tr><td colspan="8" class="text-center">Cargando usuarios...</td></tr>';
    try {
        const querySnapshot = await db.collection('users').orderBy('timestamp', 'desc').get();
        usersTableBody.innerHTML = ''; 

        if (querySnapshot.empty) {
            usersTableBody.innerHTML = '<tr><td colspan="8" class="text-center">No hay usuarios registrados.</td></tr>';
            return;
        }

        querySnapshot.forEach(doc => {
            const user = doc.data();
            const userId = doc.id;
            const row = usersTableBody.insertRow();

            // Padecimientos a mostrar 
            const ailmentsText = user.ailments && user.ailments.length > 0
                ? user.ailments.map(a => window.knowledgeBase.recommendations.ailments[a]?.name || a).join(', ')
                : 'Ninguno';

            // Nombre del objetivo 
            const goalName = window.knowledgeBase.goals.find(g => g.id === user.selectedGoalId)?.name || user.selectedGoalId || 'N/A';

            row.innerHTML = `
                <td>${user.fullName || 'N/A'}</td>
                <td>${user.dui || 'N/A'}</td>
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
                viewUserRecommendations(e.currentTarget.dataset.id);
            });
        });

    } catch (error) {
        console.error("Error al cargar usuarios:", error);
        usersTableBody.innerHTML = '<tr><td colspan="8" class="text-center text-danger">Error al cargar usuarios.</td></tr>';
    }
}

// Función para abrir el modal de edición de usuario
async function editUser(userId) {
    try {
        const userDoc = await db.collection('users').doc(userId).get();
        if (!userDoc.exists) {
            alert('Usuario no encontrado.');
            return;
        }
        const user = userDoc.data();
        currentEditingUserId = userId; // Guarda el ID del usuario que se está editando

 
        document.getElementById('editFullName').value = user.fullName;
        document.getElementById('editAge').value = user.age;
        document.getElementById('editWeight').value = user.weightKg;
        document.getElementById('editHeight').value = user.heightCm;
        document.getElementById('editGender').value = user.gender;

       
        const editAilmentsSelect = document.getElementById('editAilments');
     
        for (let i = 0; i < editAilmentsSelect.options.length; i++) {
            editAilmentsSelect.options[i].selected = false;
        }
        if (user.ailments && Array.isArray(user.ailments)) {
            user.ailments.forEach(ailment => {
                const option = Array.from(editAilmentsSelect.options).find(opt => opt.value === ailment);
                if (option) {
                    option.selected = true;
                }
            });
        }

        // Lógica para el DUI (Denuevo xd)
        const editDUIInput = document.getElementById('editDUI');
        editDUIInput.value = user.dui || ''; 
        
        // El DUI se deshabilita si el usuario es mayor de edad (>= 18)
        // o si ya tenía un DUI registrado y ha alcanzado la mayoría de edad.
        // Si es menor de edad, el DUI del responsable sí es editable.
        if (user.age >= 18) {
            editDUIInput.setAttribute('disabled', 'true');
            editDUIInput.classList.add('bg-light');
            console.log(`DEBUG_EDIT: DUI (${user.dui}) deshabilitado para usuario mayor de edad (${user.age} años).`);
        } else {
            editDUIInput.removeAttribute('disabled');
            editDUIInput.classList.remove('bg-light');
            console.log(`DEBUG_EDIT: DUI (${user.dui}) habilitado para usuario menor de edad (${user.age} años).`);
        }

        editGoalSelect.innerHTML = '';
        window.knowledgeBase.goals.forEach(goal => {
            const opt = document.createElement('option');
            opt.value = goal.id;
            opt.textContent = goal.name;
            editGoalSelect.appendChild(opt);
        });
        
        editGoalSelect.value = user.selectedGoalId || '';

        
        populateDynamicQuestions(user.selectedGoalId, editDynamicQuestionsContainer, user.dynamicAnswers || {});

        // Listener para cambiar preguntas dinámicas si cambia el objetivo en el modal

        const oldEditGoalSelect = editGoalSelect;
        const newEditGoalSelect = oldEditGoalSelect.cloneNode(true);
        oldEditGoalSelect.parentNode.replaceChild(newEditGoalSelect, oldEditGoalSelect);

        // Reasignaciónla referencia global a la nueva instancia clonada
        editGoalSelect = newEditGoalSelect;

        editGoalSelect.addEventListener('change', () => {
          
            populateDynamicQuestions(editGoalSelect.value, editDynamicQuestionsContainer, {});
        });

        editUserModalInstance.show();



        editUserModalInstance.show(); 
        console.log('Cargando usuario para edición:', user);

    } catch (error) {
        console.error('Error al cargar datos del usuario para edición:', error);
        alert('Error al cargar datos del usuario para edición. ' + error.message);
    }
}

// Manejador del formulario de edición de usuario
editUserForm.addEventListener('submit', async (e) => {
    e.preventDefault(); 

    // Validación del formulario de edición antes de intentar guardar
    if (!editUserForm.checkValidity()) {
        e.stopPropagation(); 
        editUserForm.classList.add('was-validated'); 
        return; 
    }

     const originalDUI = currentEditedUserDui; 

    const userId = editUserIdInput.value;
    const updatedFullName = editFullNameInput.value.trim(); 
    const updatedDUI = editDUIInput.value.trim(); 
    const updatedAge = parseInt(editAgeInput.value); 

// 1. Validación del formato del DUI para edición
const duiRegex = /^\d{8}-\d{1}$/;
if (!duiRegex.test(updatedDUI)) {
    editDUIInput.classList.add('is-invalid');
    const feedbackElement = editDUIInput.nextElementSibling;
    if (feedbackElement && feedbackElement.classList.contains('invalid-feedback')) {
        feedbackElement.textContent = 'El formato del DUI debe ser 01234567-8';
    } else {
        alert('El formato del DUI debe ser 01234567-8');
    }
    return; 
} else {
    editDUIInput.classList.remove('is-invalid');
    const feedbackElement = editDUIInput.nextElementSibling;
    if (feedbackElement && feedbackElement.classList.contains('invalid-feedback')) {
        feedbackElement.textContent = ''; 
    }
}

// Lógica de verificación para DUI duplicado
 try {
        const usersRef = db.collection('users');
        const querySnapshot = await usersRef.where('dui', '==', updatedDUI).get();

        let isDuplicateButAllowed = false;

        if (!querySnapshot.empty) {
           
            for (const doc of querySnapshot.docs) {
            
                if (doc.id === originalDUI) {
                    isDuplicateButAllowed = true; // El DUI es el mismo, pero pertenece al usuario actual, así que es válido.
                    break; 
                }

                const existingUser = doc.data();
                const existingUserAge = parseInt(existingUser.age);

                // Caso 1: El usuario existente es un adulto (responsable) y el usuario que se edita es un menor con el mismo DUI.
                if (existingUserAge >= 18 && updatedAge < 18) {
                    isDuplicateButAllowed = true;
                    break;
                }
                // Caso 2: El usuario existente es un menor y el usuario que se edita es un adulto (responsable) con el mismo DUI.
                else if (existingUserAge < 18 && updatedAge >= 18) {
                    isDuplicateButAllowed = true;
                    break;
                }
            }
        }

    } catch (error) {
        console.error("Error al verificar DUI duplicado en edición:", error);
        alert("Ocurrió un error al verificar el DUI. Por favor, intenta de nuevo.");
        return;
    }


    // Recolectar datos del formulario para la actualización
    const updatedUserData = {
        fullName: updatedFullName, 
        dui: updatedDUI,          
        age: updatedAge,           
        weight: parseFloat(editWeightInput.value), 
        height: parseFloat(editHeightInput.value), 
        gender: editGenderSelect.value,
       
        ailments: Array.from(editAilmentsSelect.selectedOptions)
                        .map(option => option.value)
                        .filter(a => a !== 'none' || (Array.from(editAilmentsSelect.selectedOptions).length === 1 && a === 'none')), 
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
    const originalUserDoc = await db.collection('users').doc(userId).get();
    const originalUserData = originalUserDoc.data();

    // Combinación de datos actualizados con datos originales para generar recomendaciones
    const dataForRecommendation = {
        ...originalUserData, 
        ...updatedUserData  
    };


    const result = inferenceEngine.generateRecommendations(dataForRecommendation, window.knowledgeBase);
    updatedUserData.imcResult = result.imcResult; 
    updatedUserData.recommendations = {
        habits: result.habits, 
        dietPlan: result.dietPlan 
    };
    updatedUserData.timestamp = firebase.firestore.FieldValue.serverTimestamp(); // Actualización timestamp de modificación
    updatedUserData.lastUpdated = firebase.firestore.FieldValue.serverTimestamp(); 

    try {
        await db.collection('users').doc(userId).update(updatedUserData);
        console.log('Usuario actualizado exitosamente:', userId);
        alert('Usuario y recomendaciones actualizadas.');
       
        editUserModalInstance.hide();
        loadUsersTable(); 
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        alert('Error al guardar los cambios del usuario. ' + error.message);
    }

    editUserForm.classList.remove('was-validated');
});

// Función para mostrar el plan nutricional de un usuario en un modal
async function viewUserRecommendations(userId) {
    try {
        const doc = await db.collection('users').doc(userId).get();
        if (!doc.exists) {
            alert('Usuario no encontrado.');
            return;
        }
        const user = doc.data();

       
        if (!user.recommendations || !user.imcResult) {
            alert('Este usuario aún no tiene recomendaciones generadas.');
            return;
        }

     
        const recsContainerElements = {
            resHabitsRoutines: viewRecsHabitsRoutines,
            resDietPlan: viewRecsDietPlan
        };

      
        displayResults(user, user.recommendations, user.imcResult, recsContainerElements);
       
        viewRecommendationsModalInstance.show();
    } catch (error) {
        console.error("Error al cargar las recomendaciones del usuario:", error);
        alert("Error al cargar el plan nutricional. " + error.message);
    }
}


// Función para eliminar un usuario
async function deleteUser(userId) {
    if (confirm('¿Estás seguro de que quieres eliminar a este usuario? Esta acción es irreversible.')) {
        try {
            await db.collection('users').doc(userId).delete();
            console.log('Usuario eliminado:', userId);
            alert('Usuario eliminado exitosamente.');
            loadUsersTable(); // Recargar la tabla
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            alert('Error al eliminar el usuario. ' + error.message);
        }
    }
}