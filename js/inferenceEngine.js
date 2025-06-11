// Creado por: Brandon Henríquez.

const inferenceEngine = {

    calculateIMC: function(weightKg, heightCm) {
        const heightM = heightCm / 100; // Convertir cm a metros
        const imc = weightKg / (heightM * heightM);

        let status = '';
        if (imc < 18.5) {
            status = 'Bajo peso';
        } else if (imc >= 18.5 && imc < 24.9) {
            status = 'Peso normal';
        } else if (imc >= 25 && imc < 29.9) {
            status = 'Sobrepeso';
        } else {
            status = 'Obesidad';
        }

        return { imc: imc.toFixed(2), status: status };
    },


// Genera recomendaciones basadas en los datos del usuario, el objetivo y las respuestas a las preguntas dinámicas.

    generateRecommendations: function(userData, selectedGoalId, answers) {
        const { status } = this.calculateIMC(userData.weightKg, userData.heightCm); 
        let habits = "";
        let dietPlan = [];

        // 1. Obtener recomendaciones base según el estado del IMC
        const formattedImcStatus = status.toLowerCase().replace(' ', ''); 
        const baseRecs = knowledgeBase.recommendations[formattedImcStatus];
        if (baseRecs) {
            habits = baseRecs.habits;
            if (baseRecs.diet && Array.isArray(baseRecs.diet.plan)) {
                dietPlan = [...baseRecs.diet.plan]; 
            }
        }

        // 2. Ajustar según el objetivo seleccionado y las respuestas dinámicas
        const detailedRecs = knowledgeBase.recommendations.detailed[selectedGoalId];
        if (detailedRecs) {
            for (const key in answers) {
                const answerValue = answers[key];
                const answerKey = `${key}_${answerValue}`;

                if (detailedRecs[answerKey]) {
                    if (detailedRecs[answerKey].habits) {
                        habits += " " + detailedRecs[answerKey].habits;
                    }
                    if (detailedRecs[answerKey].diet_addition) {
                        dietPlan.push(detailedRecs[answerKey].diet_addition);
                    }
                }
            }
        }

        // 3. Aplicar restricciones/modificaciones específicas por padecimiento
        if (userData.ailments && userData.ailments.length > 0 && !userData.ailments.includes('none')) {
            userData.ailments.forEach(ailment => {
                if (knowledgeBase.recommendations.ailments[ailment]) {
                    if (knowledgeBase.recommendations.ailments[ailment].diet_restriction) {
                        dietPlan.unshift(knowledgeBase.recommendations.ailments[ailment].diet_restriction);
                    }
                }
            });
        }

        // Si no se genera un plan de dieta específico (por ejemplo, si no hay baseRecs ni detailedRecs), usar uno general predeterminado.
        // Se asegura de que siempre haya algo en dietPlan.
        if (dietPlan.length === 0) {
            if (knowledgeBase.recommendations.normal && knowledgeBase.recommendations.normal.diet && Array.isArray(knowledgeBase.recommendations.normal.diet.plan)) {
                dietPlan = [...knowledgeBase.recommendations.normal.diet.plan]; 
            } else {
                dietPlan = ["No se pudo generar un plan de dieta específico. Por favor, revisa tus selecciones o contáctanos para un plan personalizado."];
            }
        }

        return {
            habits: habits.trim(),
            dietPlan: dietPlan
        };
    }
};