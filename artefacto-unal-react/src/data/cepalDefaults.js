export const CEPAL_PROBLEM_TREE = [
    {
        codigo: "E2.1",
        tipo: "efecto",
        nivel: 2,
        padre: "E1.1",
        enunciado: "Acelerada migración definitiva de población joven hacia áreas urbanas",
        evidencia: "Estudio Redalyc sobre factores de expulsión y retención en Manizales; estadísticas demográficas rurales.",
        lineaBase: "Tasa estimada de migración juvenil rural superior al 45% en corregimientos.",
        confianza: "Alta",
        origen: "Revisión CEPAL",
        esAccion: false
    },
    {
        codigo: "E2.2",
        tipo: "efecto",
        nivel: 2,
        padre: "E1.2",
        enunciado: "Deterioro del relevo generacional y abandono progresivo de unidades productivas campesinas",
        evidencia: "Problemas percibidos por productores y organizaciones cafeteras de Caldas.",
        lineaBase: "Edad promedio de productores agropecuarios en Manizales superior a 57 años.",
        confianza: "Alta",
        origen: "Revisión CEPAL",
        esAccion: false
    },
    {
        codigo: "E1.1",
        tipo: "efecto",
        nivel: 1,
        padre: "P",
        enunciado: "Baja expectativa de los jóvenes de consolidar un proyecto de vida digno y viable en el campo",
        evidencia: "Pregunta orientadora y percepción sistematizada de jóvenes rurales y familias.",
        lineaBase: "Más del 60% de los jóvenes rurales encuestados proyecta su futuro laboral fuera del campo.",
        confianza: "Media",
        origen: "Revisión CEPAL",
        esAccion: false
    },
    {
        codigo: "E1.2",
        tipo: "efecto",
        nivel: 1,
        padre: "P",
        enunciado: "Debilitamiento de la economía campesina y reducción de ingresos familiares en veredas",
        evidencia: "Percepción de familias rurales y diagnósticos de la Secretaría de Agricultura.",
        lineaBase: "Ingresos medios agropecuarios juveniles por debajo del salario mínimo legal.",
        confianza: "Media",
        origen: "Revisión CEPAL",
        esAccion: false
    },
    {
        codigo: "C1.1",
        tipo: "causa",
        nivel: 1,
        padre: "P",
        enunciado: "Oferta de empleo rural formal y remunerado para jóvenes escasa e inestable",
        evidencia: "Factor laboral identificado y problemas percibidos por jóvenes rurales y productores.",
        lineaBase: "Menos del 15% de jóvenes rurales ocupados cuenta con contrato formal y seguridad social.",
        confianza: "Alta",
        origen: "Revisión CEPAL",
        esAccion: false
    },
    {
        codigo: "C2.1",
        tipo: "causa",
        nivel: 2,
        padre: "C1.1",
        enunciado: "Baja rentabilidad y escasa capacidad de contratación formal en fincas tradicionales",
        evidencia: "Problemas percibidos por productores sobre costos de producción y mano de obra.",
        lineaBase: "Fincas tradicionales con márgenes netos reducidos en venta de café pergamino estándar.",
        confianza: "Media",
        origen: "Revisión CEPAL",
        esAccion: false
    },
    {
        codigo: "C3.1",
        tipo: "causa",
        nivel: 3,
        padre: "C2.1",
        enunciado: "Predominio de producción primaria tradicional con mínima agregación de valor local",
        evidencia: "Diagnóstico socioeconómico de la Secretaría de Agricultura de Manizales.",
        lineaBase: "Más del 80% de la producción se vende en materia prima sin transformación ni marca.",
        confianza: "Alta",
        origen: "Revisión CEPAL",
        esAccion: false
    },
    {
        codigo: "C3.2",
        tipo: "causa",
        nivel: 3,
        padre: "C2.1",
        enunciado: "Alta estacionalidad en la demanda de jornales y elevados costos de intermediación",
        evidencia: "Registros de ciclos de cosecha cafetera y comercialización de intermediarios locales.",
        lineaBase: "Picos de empleo concentrados únicamente en 3 meses del año durante cosecha principal.",
        confianza: "Media",
        origen: "Revisión CEPAL",
        esAccion: false
    },
    {
        codigo: "C2.2",
        tipo: "causa",
        nivel: 2,
        padre: "C1.1",
        enunciado: "Dispersión y bajo conocimiento de convocatorias y oportunidades de empleo rural",
        evidencia: "Insumo de jóvenes rurales y Secretaría de Agricultura.",
        lineaBase: "Ausencia de un canal unificado de intermediación laboral para los corregimientos.",
        confianza: "Baja",
        origen: "Revisión CEPAL",
        esAccion: false
    },
    {
        codigo: "C1.2",
        tipo: "causa",
        nivel: 1,
        padre: "P",
        enunciado: "Acceso restringido de los jóvenes a tierra, activos productivos y capital inicial de trabajo",
        evidencia: "Factor productivo/financiero y problemas percibidos por jóvenes emprendedores.",
        lineaBase: "Menos del 8% de jóvenes rurales de Manizales posee títulos de propiedad o tierra propia.",
        confianza: "Alta",
        origen: "Revisión CEPAL",
        esAccion: false
    },
    {
        codigo: "C2.3",
        tipo: "causa",
        nivel: 2,
        padre: "C1.2",
        enunciado: "Altas barreras económicas y legales para la titulación y arrendamiento seguro de tierras",
        evidencia: "Insumo de familias rurales y registros de tenencia de tierras del municipio.",
        lineaBase: "Costos de arrendamiento elevados y falta de contratos formales a largo plazo.",
        confianza: "Media",
        origen: "Revisión CEPAL",
        esAccion: false
    },
    {
        codigo: "C3.3",
        tipo: "causa",
        nivel: 3,
        padre: "C2.3",
        enunciado: "Esquemas de banco de tierras o figuras de comodato asociativo juvenil inexistentes en el municipio",
        evidencia: "Revisión de programas municipales de tierras y fomento rural.",
        lineaBase: "Cero figuras de banco de tierras público implementadas a nivel corregimental.",
        confianza: "Baja",
        origen: "Revisión CEPAL",
        esAccion: false
    },
    {
        codigo: "C2.4",
        tipo: "causa",
        nivel: 2,
        padre: "C1.2",
        enunciado: "Oferta crediticia rígida con garantías y requisitos inaccesibles para proyectos juveniles",
        evidencia: "Revisión de líneas de microcrédito agropecuario y requisitos de banca tradicional.",
        lineaBase: "Rechazo de más del 70% de solicitudes de crédito agropecuario juvenil por falta de historial.",
        confianza: "Alta",
        origen: "Revisión CEPAL",
        esAccion: false
    },
    {
        codigo: "C3.4",
        tipo: "causa",
        nivel: 3,
        padre: "C2.4",
        enunciado: "Escasez de fondos de capital semilla no reembolsables adaptados al perfil del joven rural",
        evidencia: "Fondo Emprender SENA e incentivos municipales de la Secretaría de Agricultura.",
        lineaBase: "Cupos anuales de capital semilla alcanzan a cubrir a menos del 10% de demandantes.",
        confianza: "Media",
        origen: "Revisión CEPAL",
        esAccion: false
    },
    {
        codigo: "C1.3",
        tipo: "causa",
        nivel: 1,
        padre: "P",
        enunciado: "Desarticulación entre los programas formativos y la vocación productiva territorial",
        evidencia: "Factor educativo y problemas percibidos por colegios rurales, SENA y universidades.",
        lineaBase: "Baja tasa de inserción en actividades rurales de egresados de media técnica agropecuaria.",
        confianza: "Alta",
        origen: "Revisión CEPAL",
        esAccion: false
    },
    {
        codigo: "C2.5",
        tipo: "causa",
        nivel: 2,
        padre: "C1.3",
        enunciado: "Contenidos curriculares desactualizados y poco orientados a la innovación y agroindustria",
        evidencia: "Mesas de trabajo de educación rural e instituciones educativas.",
        lineaBase: "Mallas curriculares enfocadas en labores tradicionales sin componentes de biotecnología o TIC.",
        confianza: "Media",
        origen: "Revisión CEPAL",
        esAccion: false
    },
    {
        codigo: "C3.5",
        tipo: "causa",
        nivel: 3,
        padre: "C2.5",
        enunciado: "Escasas experiencias de formación práctica directamente en fincas modelo y parcelas demostrativas",
        evidencia: "Insumo de docentes y egresados de colegios rurales.",
        lineaBase: "Menos del 25% del tiempo formativo se dedica a prácticas aplicadas en campo.",
        confianza: "Media",
        origen: "Revisión CEPAL",
        esAccion: false
    },
    {
        codigo: "C2.6",
        tipo: "causa",
        nivel: 2,
        padre: "C1.3",
        enunciado: "Asistencia técnica y acompañamiento productivo discontinuos tras culminar la capacitación",
        evidencia: "Reportes de extensión agropecuaria municipal y comités de cafeteros.",
        lineaBase: "Frecuencia promedio de visitas técnicas inferior a 2 visitas al año por emprendimiento.",
        confianza: "Media",
        origen: "Revisión CEPAL",
        esAccion: false
    },
    {
        codigo: "C3.6",
        tipo: "causa",
        nivel: 3,
        padre: "C2.6",
        enunciado: "Seguimiento en campo y acompañamiento técnico deficientes para la consolidación de planes de negocio juveniles",
        evidencia: "Tasa de mortalidad de emprendimientos rurales en los primeros 18 meses.",
        lineaBase: "Más del 50% de proyectos productivos juveniles cesa actividades tras el primer año.",
        confianza: "Baja",
        origen: "Revisión CEPAL",
        esAccion: false
    },
    {
        codigo: "C1.4",
        tipo: "causa",
        nivel: 1,
        padre: "P",
        enunciado: "Debilidad en esquemas de asociatividad juvenil y canales de comercialización directa",
        evidencia: "Factor comercial/organizacional y percepción de asociaciones y compradores.",
        lineaBase: "Menos del 12% de jóvenes rurales participa activamente en asociaciones de productores.",
        confianza: "Alta",
        origen: "Revisión CEPAL",
        esAccion: false
    },
    {
        codigo: "C2.7",
        tipo: "causa",
        nivel: 2,
        padre: "C1.4",
        enunciado: "Baja representatividad e incentivos para la participación juvenil en asociaciones existentes",
        evidencia: "Insumo de asociaciones de productores y comités gremiales.",
        lineaBase: "Estatutos asociativos sin capítulos juveniles ni cuotas de participación en juntas directivas.",
        confianza: "Media",
        origen: "Revisión CEPAL",
        esAccion: false
    },
    {
        codigo: "C3.7",
        tipo: "causa",
        nivel: 3,
        padre: "C2.7",
        enunciado: "Estructuras organizativas cerradas con limitados incentivos para el relevo de liderazgos",
        evidencia: "Entrevistas diagnósticas con líderes comunitarios y jóvenes de corregimientos.",
        lineaBase: "Promedio de permanencia de juntas directivas superior a 10 años en organizaciones rurales.",
        confianza: "Baja",
        origen: "Revisión CEPAL",
        esAccion: false
    },
    {
        codigo: "C2.8",
        tipo: "causa",
        nivel: 2,
        padre: "C1.4",
        enunciado: "Dificultades para acceder a mercados diferenciados, empaque, marcas y circuitos directos",
        evidencia: "Fuente institucional de la Secretaría de Agricultura sobre Mercado Campesino.",
        lineaBase: "Menos del 10% de productos juveniles cuenta con marca propia, registro sanitario y empaque comercial.",
        confianza: "Alta",
        origen: "Revisión CEPAL",
        esAccion: false
    },
    {
        codigo: "C3.8",
        tipo: "causa",
        nivel: 3,
        padre: "C2.8",
        enunciado: "Insuficiente infraestructura logística, de acopio y transporte para iniciativas de jóvenes",
        evidencia: "Diagnóstico de comercialización rural de Manizales.",
        lineaBase: "Falta de rutas de recolección y centros de consolidación logística en corregimientos.",
        confianza: "Media",
        origen: "Revisión CEPAL",
        esAccion: false
    }
];

export const CEPAL_EAP = {
    fin: "Contribuir a la sostenibilidad del desarrollo rural y al relevo generacional productivo en el municipio de Manizales.",
    proposito: "Jóvenes de la zona rural de Manizales acceden y consolidan oportunidades laborales, productivas, formativas y comerciales que hacen viable y atractiva su permanencia en el territorio.",
    componentes: [
        {
            codigo: "COMP-1",
            nombre: "Rutas de vinculación laboral y agregación de valor rural articuladas",
            causa_asociada: "C1.1",
            actividades: [
                "Caracterizar las unidades productivas rurales con potencial de contratación y aprendizaje juvenil en los siete corregimientos.",
                "Diseñar e implementar acuerdos de vinculación laboral formal y pasantías remuneradas con productores y gremios agropecuarios.",
                "Implementar programas de capacitación y dotación para la transformación y agregación de valor en origen (cafés especiales, agroindustria).",
                "Poner en funcionamiento una ventanilla única territorial de orientación, intermediación laboral y oportunidades para jóvenes rurales."
            ]
        },
        {
            codigo: "COMP-2",
            nombre: "Mecanismos de acceso a tierras, capital semilla y activos productivos implementados",
            causa_asociada: "C1.2",
            actividades: [
                "Estructurar e implementar un programa piloto de banco de tierras y contratos de arrendamiento seguro para jóvenes rurales.",
                "Constituir y operar un fondo rotatorio de capital semilla e incentivos no reembolsables para emprendimientos juveniles.",
                "Facilitar paquetes tecnológicos, dotación de herramientas y maquinaria menor adaptada a iniciativas agropecuarias juveniles.",
                "Brindar asesoría técnica y financiera especializada para la formulación, sustentación y ejecución de planes de inversión productiva."
            ]
        },
        {
            codigo: "COMP-3",
            nombre: "Oferta formativa aplicada y asistencia técnica continua en territorio fortalecidas",
            causa_asociada: "C1.3",
            actividades: [
                "Concertar y actualizar con el SENA, colegios rurales y universidades mallas curriculares enfocadas en innovación agropecuaria y TIC.",
                "Establecer parcelas demostrativas y fincas modelo en los corregimientos para el desarrollo de prácticas y formación en campo.",
                "Prestar asistencia técnica integral y acompañamiento socioempresarial continuo a iniciativas juveniles poscapacitación.",
                "Implementar un programa de mentorías intergeneracionales con productores destacados y comités cafeteros."
            ]
        },
        {
            codigo: "COMP-4",
            nombre: "Canales de comercialización directa y asociatividad juvenil rural consolidados",
            causa_asociada: "C1.4",
            actividades: [
                "Promover la conformación de comités juveniles y reformas estatutarias en asociaciones y cooperativas agropecuarias.",
                "Diseñar y registrar marcas colectivas territoriales, etiquetas, empaques y certificaciones de calidad para productos juveniles.",
                "Habilitar y consolidar espacios permanentes de venta directa en Mercados Campesinos y circuitos comerciales urbanos de Manizales.",
                "Suscribir acuerdos comerciales de proveeduría directa con compradores urbanos, restaurantes y cadenas del sector HORECA."
            ]
        }
    ]
};

export const CEPAL_OBJECTIVES_MAP = {
    "E2.1": { codigo: "F2.1", tipo: "Fin indirecto", nivel: 2, padre: "F1.1", enunciado: "Permanencia voluntaria y reducción de la migración forzada de población joven hacia áreas urbanas", origen: "E2.1 (Efecto indirecto)" },
    "E2.2": { codigo: "F2.2", tipo: "Fin indirecto", nivel: 2, padre: "F1.2", enunciado: "Relevo generacional productivo asegurado y sostenibilidad socioeconómica de unidades campesinas", origen: "E2.2 (Efecto indirecto)" },
    "E1.1": { codigo: "F1.1", tipo: "Fin directo", nivel: 1, padre: "Obj_P", enunciado: "Elevada expectativa de los jóvenes de consolidar un proyecto de vida digno y viable en el campo", origen: "E1.1 (Efecto directo)" },
    "E1.2": { codigo: "F1.2", tipo: "Fin directo", nivel: 1, padre: "Obj_P", enunciado: "Economía campesina fortalecida e incremento de los ingresos familiares en veredas de Manizales", origen: "E1.2 (Efecto directo)" },
    "P": { codigo: "Obj_P", tipo: "Propósito Central", nivel: 0, padre: "Fin", enunciado: "Oportunidades laborales y productivas consolidadas y suficientemente atractivas para favorecer la permanencia de los jóvenes en la zona rural de Manizales", origen: "P (Problema central)" },
    "C1.1": { codigo: "M1.1", tipo: "Medio directo (Componente 1)", nivel: 1, padre: "Obj_P", enunciado: "Oferta de empleo rural formal y remunerado para jóvenes ampliada y estable", origen: "C1.1 (Causa directa)" },
    "C2.1": { codigo: "M2.1", tipo: "Medio indirecto", nivel: 2, padre: "M1.1", enunciado: "Mayor rentabilidad y capacidad de contratación laboral formal en fincas y unidades productivas", origen: "C2.1 (Causa indirecta)" },
    "C3.1": { codigo: "M3.1", tipo: "Medio fundamental (Actividad)", nivel: 3, padre: "M2.1", enunciado: "Diversificación y agregación de valor local a la producción agropecuaria primaria en origen", origen: "C3.1 (Causa raíz)" },
    "C3.2": { codigo: "M3.2", tipo: "Medio fundamental (Actividad)", nivel: 3, padre: "M2.1", enunciado: "Estabilidad en la demanda de mano de obra y reducción de sobrecostos de intermediación", origen: "C3.2 (Causa raíz)" },
    "C2.2": { codigo: "M2.2", tipo: "Medio indirecto", nivel: 2, padre: "M1.1", enunciado: "Canales unificados y amplia difusión territorial de convocatorias y oportunidades laborales rurales", origen: "C2.2 (Causa indirecta)" },
    "C1.2": { codigo: "M1.2", tipo: "Medio directo (Componente 2)", nivel: 1, padre: "Obj_P", enunciado: "Acceso equitativo y oportuno de jóvenes a tierra, activos productivos y capital inicial de trabajo", origen: "C1.2 (Causa directa)" },
    "C2.3": { codigo: "M2.3", tipo: "Medio indirecto", nivel: 2, padre: "M1.2", enunciado: "Barreras económicas y legales reducidas para la titulación y arrendamiento seguro de tierras", origen: "C2.3 (Causa indirecta)" },
    "C3.3": { codigo: "M3.3", tipo: "Medio fundamental (Actividad)", nivel: 3, padre: "M2.3", enunciado: "Esquemas de banco de tierras y figuras de comodato asociativo juvenil implementados", origen: "C3.3 (Causa raíz)" },
    "C2.4": { codigo: "M2.4", tipo: "Medio indirecto", nivel: 2, padre: "M1.2", enunciado: "Líneas de microcrédito y garantías flexibles adaptadas a las condiciones de jóvenes rurales", origen: "C2.4 (Causa indirecta)" },
    "C3.4": { codigo: "M3.4", tipo: "Medio fundamental (Actividad)", nivel: 3, padre: "M2.4", enunciado: "Fondos de capital semilla no reembolsables disponibles y ajustados al perfil juvenil rural", origen: "C3.4 (Causa raíz)" },
    "C1.3": { codigo: "M1.3", tipo: "Medio directo (Componente 3)", nivel: 1, padre: "Obj_P", enunciado: "Articulación efectiva entre programas formativos y la vocación productiva territorial", origen: "C1.3 (Causa directa)" },
    "C2.5": { codigo: "M2.5", tipo: "Medio indirecto", nivel: 2, padre: "M1.3", enunciado: "Contenidos curriculares actualizados e integrados con innovación agropecuaria y TIC", origen: "C2.5 (Causa indirecta)" },
    "C3.5": { codigo: "M3.5", tipo: "Medio fundamental (Actividad)", nivel: 3, padre: "M2.5", enunciado: "Experiencias de formación práctica directamente en fincas modelo y parcelas demostrativas", origen: "C3.5 (Causa raíz)" },
    "C2.6": { codigo: "M2.6", tipo: "Medio indirecto", nivel: 2, padre: "M1.3", enunciado: "Asistencia técnica y acompañamiento productivo continuos posteriores a la capacitación", origen: "C2.6 (Causa indirecta)" },
    "C3.6": { codigo: "M3.6", tipo: "Medio fundamental (Actividad)", nivel: 3, padre: "M2.6", enunciado: "Seguimiento en campo permanente para la consolidación de planes de negocio juveniles", origen: "C3.6 (Causa raíz)" },
    "C1.4": { codigo: "M1.4", tipo: "Medio directo (Componente 4)", nivel: 1, padre: "Obj_P", enunciado: "Esquemas de asociatividad juvenil y canales de comercialización directa fortalecidos", origen: "C1.4 (Causa directa)" },
    "C2.7": { codigo: "M2.7", tipo: "Medio indirecto", nivel: 2, padre: "M1.4", enunciado: "Alta representatividad e incentivos para la participación juvenil en asociaciones rurales", origen: "C2.7 (Causa indirecta)" },
    "C3.7": { codigo: "M3.7", tipo: "Medio fundamental (Actividad)", nivel: 3, padre: "M2.7", enunciado: "Estructuras organizativas abiertas con liderazgo y relevo generacional incentivado", origen: "C3.7 (Causa raíz)" },
    "C2.8": { codigo: "M2.8", tipo: "Medio indirecto", nivel: 2, padre: "M1.4", enunciado: "Acceso consolidado a mercados diferenciados, valor agregado, empaque y marcas comerciales", origen: "C2.8 (Causa indirecta)" },
    "C3.8": { codigo: "M3.8", tipo: "Medio fundamental (Actividad)", nivel: 3, padre: "M2.8", enunciado: "Infraestructura logística, centros de acopio y transporte rural habilitados para jóvenes", origen: "C3.8 (Causa raíz)" }
};
