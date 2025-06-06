/// CREADO POR: BRANDON HENRÍQUEZ
/// Script de la base de conocimientos (Que fue importada a Firebase).

const knowledgeBase = {
    // Objetivos que el usuario puede seleccionar
    goals: [
        { id: 'muscleGain', name: 'Aumento de masa muscular', description: 'Programas de entrenamiento y nutrición para ganar músculo.', image: 'assets/muscle.png' },
        { id: 'healthyDiet', name: 'Dieta Saludable', description: 'Recomendaciones generales para una alimentación balanceada.', image: 'assets/healthy.png' },
        { id: 'energyBoost', name: 'Aumento Energético', description: 'Estrategias para mejorar tus niveles de energía diarios.', image: 'assets/energy.png' },
        { id: 'weightLoss', name: 'Pérdida de Peso', description: 'Planes de dieta y ejercicio para adelgazar de forma saludable.', image: 'assets/weightloss.png' },
        { id: 'stressReduction', name: 'Reducción de Estrés', description: 'Combinación de nutrición y hábitos para manejar el estrés.', image: 'assets/stress.png' },
        { id: 'improveSleep', name: 'Mejorar el Sueño', description: 'Consejos nutricionales y de rutina para un mejor descanso.', image: 'assets/sleep.png' },
    ],

    // Preguntas dinámicas basadas en el objetivo seleccionado
    questions: {
        muscleGain: [
            { id: 'trainingFrequency', question: '¿Con qué frecuencia entrenas con pesas a la semana?', type: 'radio', options: [{value: '1-2 veces', text: '1-2 veces'}, {value: '3-4 veces', text: '3-4 veces'}, {value: '5+ veces', text: '5+ veces'}] },
            { id: 'proteinSource', question: '¿Cuál es tu principal fuente de proteína?', type: 'select', options: [{value: 'carne', text: 'Carne'}, {value: 'vegetales', text: 'Vegetales'}, {value: 'suplementos', text: 'Suplementos'}] },
            { id: 'snackPreference', question: '¿Qué tipo de snack prefieres post-entrenamiento?', type: 'radio', options: [{value: 'fruta', text: 'Fruta'}, {value: 'batido_proteina', text: 'Batido de proteína'}, {value: 'sandwich', text: 'Sándwich'}] }
        ],
        weightLoss: [
            { id: 'activityLevel', question: '¿Cuál es tu nivel de actividad física actual?', type: 'select', options: [{value: 'sedentario', text: 'Sedentario'}, {value: 'ligero', text: 'Ligero (1-3 días/sem ejercicio)'}, {value: 'moderado', text: 'Moderado (3-5 días/sem ejercicio)'}, {value: 'activo', text: 'Activo (6-7 días/sem ejercicio)'}] },
            { id: 'mealFrequency', question: '¿Cuántas comidas haces al día?', type: 'number', min: 2, max: 6 },
            { id: 'sugarIntake', question: '¿Con qué frecuencia consumes bebidas azucaradas?', type: 'radio', options: [{value: 'diario', text: 'Diario'}, {value: 'ocasionalmente', text: 'Ocasionalmente'}, {value: 'nunca', text: 'Nunca'}] }
        ],
        healthyDiet: [
            { id: 'vegetableIntake', question: '¿Cuántas porciones de vegetales consumes al día?', type: 'number', min: 1, max: 10 },
            { id: 'waterIntake', question: '¿Cuántos litros de agua bebes al día?', type: 'number', min: 1, max: 5 },
            { id: 'cookingMethod', question: '¿Cuál es tu método de cocción preferido?', type: 'select', options: [{value: 'horneado', text: 'Horneado/Asado'}, {value: 'frito', text: 'Frito'}, {value: 'vapor', text: 'Vapor/Hervido'}] }
        ],
        energyBoost: [
            { id: 'caffeineConsumption', question: '¿Con qué frecuencia consumes cafeína?', type: 'radio', options: [{value: 'diario', text: 'Diario'}, {value: 'ocasionalmente', text: 'Ocasionalmente'}, {value: 'nunca', text: 'Nunca'}] },
            { id: 'sleepHours', question: '¿Cuántas horas duermes en promedio por noche?', type: 'number', min: 4, max: 10 },
            { id: 'breakfastType', question: '¿Qué tipo de desayuno consumes usualmente?', type: 'select', options: [{value: 'ligero', text: 'Ligero (fruta, café)'}, {value: 'completo', text: 'Completo (proteína, carbohidratos)'}, {value: 'ninguno', text: 'Ninguno'}] }
        ],
        stressReduction: [
            { id: 'stressLevel', question: 'En una escala del 1 al 10, ¿cuál es tu nivel de estrés promedio?', type: 'number', min: 1, max: 10 },
            { id: 'relaxationActivity', question: '¿Practicas alguna actividad de relajación (yoga, meditación)?', type: 'radio', options: [{value: 'si', text: 'Sí'}, {value: 'no', text: 'No'}] },
            { id: 'comfortFood', question: '¿Con qué frecuencia recurres a la comida como consuelo?', type: 'radio', options: [{value: 'siempre', text: 'Siempre'}, {value: 'a_veces', text: 'A veces'}, {value: 'nunca', text: 'Nunca'}] }
        ],
        improveSleep: [
            { id: 'screenTimeBeforeBed', question: '¿Cuánto tiempo antes de dormir usas pantallas (móvil, tablet, TV)?', type: 'select', options: [{value: 'menos_30_min', text: 'Menos de 30 min'}, {value: '30_60_min', text: '30-60 min'}, {value: 'mas_60_min', text: 'Más de 60 min'}] },
            { id: 'sleepEnvironment', question: '¿Cómo describirías tu ambiente para dormir?', type: 'select', options: [{value: 'oscuro_silencioso', text: 'Oscuro y silencioso'}, {value: 'luz_ruido', text: 'Con algo de luz o ruido'}, {value: 'mucho_ruido_luz', text: 'Mucho ruido y luz'}] },
            { id: 'eveningMealTime', question: '¿A qué hora sueles cenar en relación a la hora de dormir?', type: 'radio', options: [{value: '2_horas_antes', text: '2 horas o más antes'}, {value: '1_hora_antes', text: '1 hora antes'}, {value: 'justo_antes', text: 'Justo antes de dormir'}] }
        ]
    },

    // Recomendaciones basadas en IMC, padecimientos y objetivos
    recommendations: {
        // Basadas en IMC
        underweight: {
            habits: "Para aumentar de peso de forma saludable, enfócate en alimentos densos en nutrientes y consume comidas más frecuentes y pequeñas a lo largo del día. Prioriza fuentes de proteínas, carbohidratos complejos y grasas saludables. Puedes añadir batidos o suplementos calóricos bajo supervisión profesional.",
            diet: {
                title: "Dieta para Aumento de Peso Saludable",
                breakfast: "Avena con leche entera, frutas secas, nueces y una cucharada de mantequilla de cacahuete.",
                midMorning: "Yogur griego con granola y un plátano.",
                lunch: "Arroz integral con pollo o pescado graso (salmón), aguacate y ensalada de hojas verdes con aceite de oliva.",
                afternoon: "Batido de frutas con leche, proteína en polvo (opcional) y semillas de chía.",
                dinner: "Pasta integral con salsa boloñesa (carne magra), queso parmesano y una porción extra de aceite de oliva."
            }
        },
        normal: {
            habits: "Mantener un peso saludable implica una dieta equilibrada, ejercicio regular y hábitos de vida sanos. Continúa con una alimentación variada y escucha las señales de hambre y saciedad de tu cuerpo.",
            diet: {
                title: "Dieta Equilibrada General",
                breakfast: "Tostadas integrales con aguacate y huevo cocido.",
                midMorning: "Una manzana y un puñado de almendras.",
                lunch: "Ensalada grande de pollo a la parrilla con lentejas, pepino, tomate y aderezo de vinagreta.",
                afternoon: "Yogur natural con frutos rojos.",
                dinner: "Pescado al horno con brócoli al vapor y batata."
            }
        },
        overweight: {
            habits: "Para la pérdida de peso, concéntrate en reducir la ingesta calórica y aumentar la actividad física. Prioriza alimentos integrales, verduras, frutas y proteínas magras. Controla el tamaño de las porciones y limita los azúcares y grasas saturadas.",
            diet: {
                title: "Dieta con Control de Porciones para Pérdida de Peso",
                breakfast: "Batido de espinacas, plátano, proteína en polvo (opcional) y agua o leche vegetal.",
                midMorning: "Puñado de nueces.",
                lunch: "Pechuga de pollo a la plancha con abundantes vegetales al vapor y una pequeña porción de quinoa.",
                afternoon: "Rodajas de pepino con hummus.",
                dinner: "Sopa de verduras con un trozo de pan integral."
            }
        },
        obese: {
            habits: "La obesidad requiere un enfoque integral para la salud. Es fundamental trabajar con profesionales (médicos, nutricionistas) para desarrollar un plan seguro y sostenible. Enfócate en cambios graduales en la dieta, aumentando la fibra y la proteína, y en una actividad física regular adaptada a tus capacidades.",
            diet: {
                title: "Dieta para Manejo de Obesidad (Requiere Supervisión Profesional)",
                breakfast: "Claras de huevo revueltas con espinacas y una rebanada de pan integral tostado.",
                midMorning: "Frutos rojos.",
                lunch: "Ensalada de atún (en agua) con muchas verduras frescas y un aderezo ligero. Evitar mayonesa.",
                afternoon: "Palitos de zanahoria y apio.",
                dinner: "Salmón al vapor con espárragos y una pequeña porción de puré de coliflor."
            }
        },

        // Padecimientos
        ailments: {
            diabetes: {
                name: "Diabetes",
                diet_restriction: "Control de carbohidratos, priorizar integrales, evitar azúcares simples. Monitoreo constante."
            },
            hypertension: {
                name: "Hipertensión",
                diet_restriction: "Reducir sodio, aumentar potasio y fibra."
            },
            celiac: {
                name: "Enfermedad Celíaca",
                diet_restriction: "Eliminación total de gluten (trigo, cebada, centeno). Leer etiquetas cuidadosamente."
            },
            lactoseIntolerance: {
                name: "Intolerancia a la Lactosa",
                diet_restriction: "Evitar productos lácteos o usar alternativas sin lactosa. Considerar fuentes de calcio no lácteas."
            },
            heartDisease: {
                name: "Enfermedad Cardíaca",
                diet_restriction: "Limitar grasas saturadas y trans, colesterol. Enfatizar grasas saludables y fibra."
            }
        },

        // Recomendaciones detalladas por objetivo (ejemplos)
        detailed: {
            muscleGain: {
                'trainingFrequency_1-2 veces': {
                    habits: "Para ganar masa muscular, aumenta tu frecuencia de entrenamiento a al menos 3-4 veces por semana. Asegúrate de un consumo adecuado de proteínas.",
                    diet_addition: "Considera un batido de proteína post-entrenamiento en los días de ejercicio."
                },
                'trainingFrequency_3-4 veces': {
                    habits: "¡Excelente frecuencia de entrenamiento! Mantén la consistencia y enfócate en la sobrecarga progresiva en tus levantamientos.",
                    diet_addition: "Asegúrate de un consumo de proteína de 1.6-2.2g por kg de peso corporal para optimizar el crecimiento muscular."
                },
                'trainingFrequency_5+ veces': {
                    habits: "Tu alta frecuencia de entrenamiento es ideal para el crecimiento muscular. Asegúrate de periodos de descanso adecuados y escucha a tu cuerpo para evitar el sobreentrenamiento.",
                    diet_addition: "Un enfoque en carbohidratos complejos antes y después del entrenamiento es crucial para la energía y la recuperación."
                },
                'proteinSource_carne': {
                    diet_addition: "Continúa priorizando carnes magras como pollo, pavo y cortes magros de res para tu ingesta de proteínas."
                },
                'proteinSource_vegetales': {
                    diet_addition: "Asegúrate de combinar fuentes de proteína vegetal (legumbres, quinoa, tofu, frutos secos) para obtener un perfil completo de aminoácidos."
                },
                'proteinSource_suplementos': {
                    diet_addition: "Los suplementos son un excelente complemento, pero asegúrate de que la mayor parte de tu proteína provenga de alimentos integrales. Considera proteína de suero o caseína."
                },
                'snackPreference_fruta': {
                    diet_addition: "Si prefieres fruta post-entrenamiento, combínala con una fuente de proteína como yogur griego o un puñado de nueces para una mejor recuperación."
                },
                'snackPreference_batido_proteina': {
                    diet_addition: "Un batido de proteína post-entrenamiento es ideal para la recuperación rápida de músculos. Asegúrate de añadir un carbohidrato simple como plátano o dextrosa."
                },
                'snackPreference_sandwich': {
                    diet_addition: "Si optas por un sándwich, elige pan integral y rellenos ricos en proteínas como pavo, pollo o atún para una buena recuperación."
                }
            },
            weightLoss: {
                'activityLevel_sedentario': {
                    habits: "Inicia un plan de actividad física gradual, como caminatas diarias de 30 minutos, para complementar tu dieta y acelerar la pérdida de peso."
                },
                'activityLevel_ligero': {
                    habits: "Considera aumentar la intensidad o duración de tus ejercicios, o añadir un día más a tu rutina para mejorar los resultados en la pérdida de peso."
                },
                'activityLevel_moderado': {
                    habits: "Tu nivel de actividad es bueno. Asegúrate de que tu dieta esté alineada con tu gasto calórico para ver progreso continuo."
                },
                'activityLevel_activo': {
                    habits: "Mantén este nivel de actividad. Enfócate en la nutrición para optimizar la quema de grasa y recuperación muscular."
                },
                'mealFrequency_2': {
                    habits: "Comer solo 2 veces al día puede ralentizar tu metabolismo y aumentar la probabilidad de comer en exceso. Intenta distribuir tus calorías en 3-4 comidas para mantener la saciedad."
                },
                'mealFrequency_3': {
                    habits: "3 comidas principales es un buen punto de partida. Asegúrate de que sean equilibradas en proteínas, fibra y grasas saludables."
                },
                'mealFrequency_4': {
                    habits: "Distribuir tus comidas en 4 tomas puede ayudar a controlar el hambre y mantener el metabolismo activo. Asegúrate de controlar las porciones."
                },
                'mealFrequency_5': {
                    habits: "5 comidas pequeñas al día es una estrategia efectiva para la pérdida de peso, ayudando a controlar los antojos y mantener la energía. Asegúrate de que cada comida sea balanceada."
                },
                'mealFrequency_6': {
                    habits: "6 comidas pequeñas puede ser beneficioso si tienes un metabolismo muy activo o si te cuesta controlar el hambre. La clave es el tamaño de las porciones."
                },
                'sugarIntake_diario': {
                    habits: "Eliminar o reducir drásticamente las bebidas azucaradas es uno de los cambios más efectivos para la pérdida de peso. Sustitúyelas por agua, té sin azúcar o infusiones."
                },
                'sugarIntake_ocasionalmente': {
                    habits: "Limitar el consumo de bebidas azucaradas a ocasiones especiales es un buen paso. Sigue buscando alternativas más saludables."
                },
                'sugarIntake_nunca': {
                    habits: "¡Excelente! No consumir bebidas azucaradas te da una ventaja significativa en tus objetivos de pérdida de peso. Mantén este hábito."
                }
            },
            healthyDiet: {
                'vegetableIntake_1': {
                    habits: "Intenta aumentar gradualmente tu consumo de vegetales. Busca incluir al menos 3-4 porciones diarias. Las verduras son clave para la fibra y los nutrientes."
                },
                'vegetableIntake_2': {
                    habits: "Bien, pero aún puedes mejorar. Busca añadir vegetales en cada comida, como un extra en el desayuno o snacks vegetales."
                },
                'vegetableIntake_3': {
                    habits: "¡Buen consumo de vegetales! Esto es fundamental para una dieta saludable y para obtener fibra y vitaminas esenciales."
                },
                'vegetableIntake_4': {
                    habits: "¡Excelente consumo de vegetales! Esto te proporciona una gran cantidad de nutrientes, fibra y antioxidantes. Sigue así."
                },
                 'vegetableIntake_5': {
                    habits: "¡Excelente consumo de vegetales! Esto te proporciona una gran cantidad de nutrientes, fibra y antioxidantes. Sigue así."
                },
                 'vegetableIntake_6': {
                    habits: "¡Excelente consumo de vegetales! Esto te proporciona una gran cantidad de nutrientes, fibra y antioxidantes. Sigue así."
                },
                 'vegetableIntake_7': {
                    habits: "¡Excelente consumo de vegetales! Esto te proporciona una gran cantidad de nutrientes, fibra y antioxidantes. Sigue así."
                },
                 'vegetableIntake_8': {
                    habits: "¡Excelente consumo de vegetales! Esto te proporciona una gran cantidad de nutrientes, fibra y antioxidantes. Sigue así."
                },
                 'vegetableIntake_9': {
                    habits: "¡Excelente consumo de vegetales! Esto te proporciona una gran cantidad de nutrientes, fibra y antioxidantes. Sigue así."
                },
                 'vegetableIntake_10': {
                    habits: "¡Excelente consumo de vegetales! Esto te proporciona una gran cantidad de nutrientes, fibra y antioxidantes. Sigue así."
                },
                'waterIntake_1': {
                    habits: "Incrementa tu consumo de agua. El objetivo es al menos 2-3 litros al día para mantener una hidratación óptima y apoyar las funciones corporales."
                },
                'waterIntake_2': {
                    habits: "Buen consumo de agua. Intenta alcanzar al menos 2.5-3 litros al día, especialmente si eres activo."
                },
                'waterIntake_3': {
                    habits: "¡Excelente hidratación! Mantener este nivel de consumo de agua es ideal para tu salud."
                },
                'waterIntake_4': {
                    habits: "¡Excelente hidratación! Mantener este nivel de consumo de agua es ideal para tu salud."
                },
                'waterIntake_5': {
                    habits: "¡Excelente hidratación! Mantener este nivel de consumo de agua es ideal para tu salud."
                },
                'cookingMethod_horneado': {
                    habits: "Horneado y asado son excelentes métodos de cocción para una dieta saludable, ya que requieren menos grasa y conservan nutrientes."
                },
                'cookingMethod_frito': {
                    habits: "Reduce el consumo de alimentos fritos y opta más por horneados, asados o al vapor para reducir grasas saturadas y calorías."
                },
                'cookingMethod_vapor': {
                    habits: "Cocinar al vapor o hervido es una de las formas más saludables de preparar alimentos, ya que preserva nutrientes y evita grasas añadidas."
                }
            },
            energyBoost: {
                'caffeineConsumption_diario': {
                    habits: "Considera reducir tu consumo diario de cafeína, ya que puede afectar la calidad del sueño y llevar a picos y caídas de energía."
                },
                'caffeineConsumption_ocasionalmente': {
                    habits: "Un consumo ocasional de cafeína está bien. Asegúrate de no depender de ella para tu energía y que tu dieta sea la principal fuente."
                },
                'caffeineConsumption_nunca': {
                    habits: "¡Excelente! No depender de la cafeína es ideal para mantener niveles de energía estables. Asegúrate de obtener suficientes vitaminas B y hierro."
                },
                'sleepHours_4': {
                    habits: "La falta de sueño es un gran ladrón de energía. Intenta mejorar tu higiene del sueño para alcanzar 7-9 horas de descanso de calidad por noche."
                },
                 'sleepHours_5': {
                    habits: "La falta de sueño es un gran ladrón de energía. Intenta mejorar tu higiene del sueño para alcanzar 7-9 horas de descanso de calidad por noche."
                },
                 'sleepHours_6': {
                    habits: "La falta de sueño es un gran ladrón de energía. Intenta mejorar tu higiene del sueño para alcanzar 7-9 horas de descanso de calidad por noche."
                },
                'sleepHours_7': {
                    habits: "7 horas de sueño es un buen punto de partida. Asegúrate de que la calidad sea óptima para maximizar tus niveles de energía."
                },
                 'sleepHours_8': {
                    habits: "¡Excelente! 8 horas de sueño es ideal para la recuperación y para mantener altos tus niveles de energía durante el día."
                },
                 'sleepHours_9': {
                    habits: "¡Excelente! 9 horas de sueño es ideal para la recuperación y para mantener altos tus niveles de energía durante el día."
                },
                 'sleepHours_10': {
                    habits: "¡Excelente! 10 horas de sueño es ideal para la recuperación y para mantener altos tus niveles de energía durante el día."
                },
                'breakfastType_ligero': {
                    habits: "Un desayuno ligero puede no ser suficiente para darte energía sostenida. Intenta incluir proteínas y carbohidratos complejos para empezar el día con fuerza."
                },
                'breakfastType_completo': {
                    habits: "Un desayuno completo es la mejor forma de asegurar energía duradera. ¡Sigue así!"
                },
                'breakfastType_ninguno': {
                    habits: "Saltarse el desayuno afecta tus niveles de energía. Intenta incorporar una comida nutritiva en la mañana para activar tu metabolismo."
                }
            },
            stressReduction: {
                'stressLevel_1': {
                    habits: "Tu nivel de estrés es bajo, lo cual es excelente. Mantén tus hábitos saludables para seguir manejándolo de forma efectiva."
                },
                 'stressLevel_2': {
                    habits: "Tu nivel de estrés es bajo, lo cual es excelente. Mantén tus hábitos saludables para seguir manejándolo de forma efectiva."
                },
                 'stressLevel_3': {
                    habits: "Tu nivel de estrés es bajo, lo cual es excelente. Mantén tus hábitos saludables para seguir manejándolo de forma efectiva."
                },
                'stressLevel_4': {
                    habits: "Tu nivel de estrés es moderado. Considera la inclusión regular de alimentos ricos en magnesio (verduras de hoja verde, frutos secos) y omega-3 (pescado graso) en tu dieta."
                },
                 'stressLevel_5': {
                    habits: "Tu nivel de estrés es moderado. Considera la inclusión regular de alimentos ricos en magnesio (verduras de hoja verde, frutos secos) y omega-3 (pescado graso) y ashwagandha en tu dieta."
                },
                 'stressLevel_6': {
                    habits: "Tu nivel de estrés es moderado. Considera la inclusión regular de alimentos ricos en magnesio (verduras de hoja verde, frutos secos) y omega-3 (pescado graso) y ashwagandha en tu dieta."
                },
                'stressLevel_7': {
                    habits: "Tu nivel de estrés es alto. Además de una dieta equilibrada, enfócate en técnicas de manejo del estrés como la meditación, el yoga o la respiración profunda. Limita la cafeína y el alcohol."
                },
                 'stressLevel_8': {
                    habits: "Tu nivel de estrés es alto. Además de una dieta equilibrada, enfócate en técnicas de manejo del estrés como la meditación, el yoga o la respiración profunda. Limita la cafeína y el alcohol."
                },
                 'stressLevel_9': {
                    habits: "Tu nivel de estrés es alto. Además de una dieta equilibrada, enfócate en técnicas de manejo del estrés como la meditación, el yoga o la respiración profunda. Limita la cafeína y el alcohol."
                },
                 'stressLevel_10': {
                    habits: "Tu nivel de estrés es alto. Además de una dieta equilibrada, enfócate en técnicas de manejo del estrés como la meditación, el yoga o la respiración profunda. Limita la cafeína y el alcohol."
                },
                'relaxationActivity_si': {
                    habits: "¡Excelente! Continuar con actividades de relajación es clave para manejar el estrés. Combínalo con una nutrición adecuada."
                },
                'relaxationActivity_no': {
                    habits: "Intenta incorporar 10-15 minutos diarios de una actividad de relajación que disfrutes, como meditar, escuchar música tranquila o pasear."
                },
                'comfortFood_siempre': {
                    habits: "Reconocer la comida como consuelo es el primer paso. Busca estrategias alternativas para manejar el estrés que no involucren comida, como ejercicio, hobbies o hablar con alguien."
                },
                'comfortFood_a_veces': {
                    habits: "Sé consciente de cuándo recurres a la comida por estrés. Intenta encontrar alternativas saludables en esos momentos y no te castigues si ocurre."
                },
                'comfortFood_nunca': {
                    habits: "¡Ideal! No usar la comida como consuelo es un signo de una buena relación con la alimentación y un manejo efectivo del estrés."
                }
            },
            improveSleep: {
                'screenTimeBeforeBed_menos_30_min': {
                    habits: "Minimizar el tiempo de pantalla antes de dormir es excelente para la calidad del sueño. Mantén esta rutina y considera leer un libro o escuchar música relajante."
                },
                'screenTimeBeforeBed_30_60_min': {
                    habits: "Intenta reducir tu tiempo de pantalla a menos de 30 minutos antes de dormir. La luz azul puede interferir con la producción de melatonina."
                },
                'screenTimeBeforeBed_mas_60_min': {
                    habits: "Elimina por completo el uso de pantallas al menos 1 hora antes de dormir. Establece una rutina de relajación nocturna para mejorar tu sueño."
                },
                'sleepEnvironment_oscuro_silencioso': {
                    habits: "Un ambiente oscuro y silencioso es ideal para el sueño. Mantén estas condiciones para un descanso óptimo."
                },
                'sleepEnvironment_luz_ruido': {
                    habits: "Intenta hacer tu habitación lo más oscura y silenciosa posible. Considera cortinas opacas, tapones para los oídos o una máquina de ruido blanco."
                },
                'sleepEnvironment_mucho_ruido_luz': {
                    habits: "Es crucial mejorar tu ambiente de sueño. Invierte en cortinas que bloqueen la luz y reduce el ruido. Un buen ambiente es fundamental para un sueño reparador."
                },
                'eveningMealTime_2_horas_antes': {
                    habits: "Cenar al menos 2 horas antes de dormir es ideal para una digestión adecuada y un sueño ininterrumpido. Sigue con este hábito."
                },
                'eveningMealTime_1_hora_antes': {
                    habits: "Intenta cenar un poco antes, dejando al menos 1.5 - 2 horas antes de ir a la cama, para que tu cuerpo pueda digerir correctamente."
                },
                'eveningMealTime_justo_antes': {
                    habits: "Cenar justo antes de dormir puede dificultar la digestión y afectar la calidad de tu sueño. Intenta adelantar tu cena y opta por comidas más ligeras por la noche."
                }
            }
        },

        // Planes de dieta alternativos o específicos que pueden sobrescribir o complementar
        alternativeDietPlans: {
            // Dietas específicas para ciertos objetivos
            individual: {
                weightLoss: {
                    title: "Plan de Dieta Específico para Pérdida de Peso",
                    breakfast: "Licuado de proteína con espinacas y bayas.",
                    midMorning: "Puñado de almendras.",
                    lunch: "Ensalada grande de pollo a la parrilla con aguacate y aderezo de limón.",
                    afternoon: "Palitos de zanahoria con hummus.",
                    dinner: "Salmón al horno con espárragos y batata pequeña."
                },
                muscleGain: {
                    title: "Plan de Dieta Específico para Aumento de Masa Muscular",
                    breakfast: "Tortilla de 3 huevos con espinacas, una taza de avena con leche y frutas.",
                    midMorning: "Batido de proteína con leche, plátano y mantequilla de cacahuete.",
                    lunch: "200g de pechuga de pollo, 1 taza de arroz integral y vegetales al vapor.",
                    afternoon: "Yogur griego con frutos secos y una fruta.",
                    dinner: "200g de carne magra, 1.5 tazas de quinoa y una ensalada grande con aceite de oliva."
                },
                 healthyDiet: {
                    title: "Plan de Dieta Específico para Dieta Saludable",
                    breakfast: "Bowl de yogur natural con granola casera, frutos rojos y semillas de chía.",
                    midMorning: "Una porción de fruta (manzana o pera).",
                    lunch: "Wrap integral de vegetales con hummus y tiras de pavo.",
                    afternoon: "Un puñado de frutos secos (nueces, almendras).",
                    dinner: "Sopa de lentejas con verduras y una rebanada de pan integral."
                },
                 energyBoost: {
                    title: "Plan de Dieta Específico para Aumento Energético",
                    breakfast: "Avena con frutos secos, miel y semillas de lino.",
                    midMorning: "Yogur con un puñado de arándanos.",
                    lunch: "Ensalada de quinoa con garbanzos, aguacate y vegetales frescos.",
                    afternoon: "Barrita energética casera (avena, frutos secos).",
                    dinner: "Salteado de tofu o pollo con verduras y arroz integral."
                },
                stressReduction: {
                    title: "Plan de Dieta Específico para Reducción de Estrés",
                    breakfast: "Batido de espinacas, plátano, leche de almendras y semillas de chía.",
                    midMorning: "Un puñado de nueces de Brasil (ricas en selenio).",
                    lunch: "Salmón al horno con vegetales verdes (brócoli, espinacas) y arroz integral.",
                    afternoon: "Infusión de manzanilla con un puñado de almendras.",
                    dinner: "Sopa de champiñones cremosa (con leche vegetal) y pan integral."
                },
                improveSleep: {
                    title: "Plan de Dieta Específico para Mejorar el Sueño",
                    breakfast: "Tostada integral con mantequilla de almendras y plátano.",
                    midMorning: "Yogur natural con cerezas (ricas en melatonina).",
                    lunch: "Pavo a la plancha con batata y espárragos.",
                    afternoon: "Un vaso de leche tibia (de almendras o vaca) con una galleta integral.",
                    dinner: "Pescado blanco al vapor con quinoa y calabacín. Cena ligera."
                }
            },
            // Dietas para combinaciones específicas de padecimientos
            combinations: {
                diabetes_hypertension: {
                    title: "Dieta para Diabetes e Hipertensión",
                    plan: [
                        "Desayuno: Tortilla de claras con espinacas y avena sin azúcar.",
                        "Media Mañana: Frutos secos sin sal.",
                        "Almuerzo: Pescado al horno con ensalada de quinoa y muchos vegetales verdes.",
                        "Merienda: Yogur natural sin azúcar.",
                        "Cena: Pechuga de pollo a la plancha con brócoli y judías verdes."
                    ],
                    restriction_summary: "Control estricto de carbohidratos, reducción de sodio, priorizar integrales y grasas saludables. Monitorizar glucosa y presión."
                },
                 diabetes_celiac: {
                    title: "Dieta para Diabetes y Celiaquía",
                    plan: [
                        "Desayuno: Pan sin gluten tostado con aguacate y huevo cocido.",
                        "Media Mañana: Frutos rojos y un puñado de almendras.",
                        "Almuerzo: Salmón al vapor con arroz integral y brócoli.",
                        "Merienda: Batido de proteína sin gluten ni azúcar añadido.",
                        "Cena: Pechuga de pavo al horno con quinoa y ensalada verde."
                    ],
                    restriction_summary: "Eliminación total de gluten y control de carbohidratos. Priorizar alimentos frescos no procesados."
                },
                 hypertension_celiac: {
                    title: "Dieta para Hipertensión y Celiaquía",
                    plan: [
                        "Desayuno: Avena sin gluten con leche vegetal sin azúcar y frutas frescas.",
                        "Media Mañana: Manzana y un puñado de nueces sin sal.",
                        "Almuerzo: Pollo al vapor con batata y una ensalada grande (aderezo casero sin sal).",
                        "Merienda: Palitos de pepino y zanahoria.",
                        "Cena: Pescado blanco al horno con quinoa y espárragos."
                    ],
                    restriction_summary: "Eliminación de gluten y estricta reducción de sodio. Enfatizar alimentos frescos y naturales."
                },
                lactoseIntolerance_celiac: {
                    title: "Dieta Libre de Lactosa y Gluten (para Celiaquía e Intolerancia a la Lactosa)",
                    plan: [
                        "Desayuno: Cereales de arroz con leche de almendras y fruta.",
                        "Media Mañana: Galletas de arroz con mantequilla de cacahuete.",
                        "Almuerzo: Pasta sin gluten (arroz, maíz) con salsa de tomate casera y carne picada.",
                        "Merienda: Zumo natural de frutas.",
                        "Cena: Tiras de pollo salteadas con verduras y arroz."
                    ],
                    restriction_summary: "Evitar lácteos y gluten por completo. Leer etiquetas cuidadosamente en productos procesados."
                }
            }
        }
    }
};

// Esto asegura que la variable 'knowledgeBase' esté explícitamente disponible en el objeto global 'window'.
window.knowledgeBase = knowledgeBase;