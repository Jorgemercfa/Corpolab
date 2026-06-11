/**
 * DATOS ESTÁTICOS — Mock Data
 *
 * Actualmente los datos son estáticos (mock data) para esta etapa del proyecto.
 * Cuando el proyecto crezca, este archivo puede reemplazarse fácilmente por una
 * integración con Supabase (recomendado, tiene SDK oficial para Vue) o Firebase Firestore.
 * La estructura de los objetos ya está diseñada para ser compatible con una
 * colección de Supabase/Firestore: cada campo corresponde a una columna/campo del documento.
 *
 * Migración sugerida:
 *   - Supabase: import { createClient } from '@supabase/supabase-js'
 *     const { data } = await supabase.from('articles').select('*')
 *   - Firebase: import { collection, getDocs } from 'firebase/firestore'
 *     const snapshot = await getDocs(collection(db, 'articles'))
 */

export const articles = [
  {
    id: 1,
    title: 'Constitución de sociedades en el Perú: SAC vs. SA para emprendedores',
    authors: 'Ana Lucía Bermúdez, Carlos Soto',
    category: 'Derecho Societario',
    date: '2025-04-10',
    abstract:
      'Este artículo analiza las diferencias fundamentales entre la Sociedad Anónima Cerrada (SAC) y la Sociedad Anónima (SA) bajo la Ley General de Sociedades peruana, con énfasis en las implicancias prácticas para emprendedores en etapa temprana. Se examina la flexibilidad de la SAC en cuanto a restricciones de transferencia de acciones, órganos de administración simplificados y requisitos de capital, comparándola con la mayor rigidez formal de la SA y su idoneidad para empresas que buscan financiamiento público. El estudio concluye con recomendaciones específicas según el tipo de emprendimiento, proyección de crecimiento y necesidades de inversión.',
    pdfUrl: '#',
    image: null,
    featured: true,
  },
  {
    id: 2,
    title: 'Responsabilidad limitada y protección patrimonial del socio emprendedor',
    authors: 'Roberto Villanueva',
    category: 'Derecho Societario',
    date: '2025-03-22',
    abstract:
      'Se examina el principio de responsabilidad limitada como pilar del derecho societario y su relevancia práctica para los emprendedores. El artículo analiza las condiciones bajo las cuales la separación patrimonial entre el socio y la sociedad puede ser desestimada a través de la doctrina del levantamiento del velo societario, identificando conductas de riesgo frecuentes en startups peruanas. Se proponen medidas preventivas de cumplimiento legal para preservar el beneficio de la responsabilidad limitada y blindar el patrimonio personal del emprendedor frente a obligaciones corporativas.',
    pdfUrl: '#',
    image: null,
    featured: false,
  },
  {
    id: 3,
    title: 'Contratos mercantiles esenciales en la etapa temprana de una startup',
    authors: 'Patricia Ríos, Sebastián Cano',
    category: 'Derecho Contractual',
    date: '2025-03-05',
    abstract:
      'A partir de un análisis doctrinal y de casos reales, este artículo identifica los contratos mercantiles críticos que todo emprendedor debe suscribir al lanzar una empresa: acuerdos de confidencialidad (NDA), contratos de prestación de servicios, acuerdos de nivel de servicio (SLA), contratos de trabajo y de locación de servicios, y pactos de accionistas. Se discuten cláusulas esenciales, cláusulas abusivas frecuentes y el valor de la negociación preventiva como herramienta de gestión del riesgo legal. El estudio ofrece una guía práctica orientada al emprendedor no especializado en derecho.',
    pdfUrl: '#',
    image: null,
    featured: true,
  },
  {
    id: 4,
    title: 'Gobierno corporativo en empresas emergentes: principios y aplicación práctica',
    authors: 'Diego Morales',
    category: 'Gobierno Corporativo',
    date: '2025-02-18',
    abstract:
      'Este trabajo evalúa la aplicabilidad de los principios de gobierno corporativo de la OCDE en el contexto de empresas emergentes y startups latinoamericanas. Se argumenta que, aunque el gobierno corporativo se asocia típicamente con grandes corporaciones, su implementación temprana en startups genera ventajas competitivas tangibles: atracción de inversión, reducción de conflictos entre socios y mayor resiliencia ante crisis. Se propone un modelo simplificado de gobierno corporativo adaptado a las condiciones y recursos de una empresa en etapa inicial, con énfasis en la transparencia, la rendición de cuentas y la separación de roles.',
    pdfUrl: '#',
    image: null,
    featured: false,
  },
  {
    id: 5,
    title: 'Propiedad intelectual para emprendedores: marcas, patentes y derechos de autor',
    authors: 'Claudia Herrera, Marcos Espinoza',
    category: 'Propiedad Intelectual',
    date: '2025-01-30',
    abstract:
      'Se analiza el marco legal de protección de la propiedad intelectual aplicable a emprendimientos tecnológicos y creativos en el Perú, con referencias al sistema andino de propiedad industrial (Decisión 486 de la CAN). El artículo distingue entre marcas, nombres comerciales, patentes de invención, modelos de utilidad y derechos de autor, explicando los procedimientos de registro ante INDECOPI, los costos asociados y los plazos de protección. Se identifican los errores más comunes de los emprendedores en esta materia y se ofrecen estrategias para construir un portafolio de activos intangibles sólido desde las etapas fundacionales de la empresa.',
    pdfUrl: '#',
    image: null,
    featured: false,
  },
  {
    id: 6,
    title: 'Marco legal del capital de riesgo y contratos de inversión en América Latina',
    authors: 'Jorge Álvarez, Natalia Paredes',
    category: 'Derecho Financiero',
    date: '2025-01-12',
    abstract:
      'El artículo examina los instrumentos jurídicos utilizados en operaciones de capital de riesgo (venture capital) en América Latina, con énfasis en los contratos de inversión más comunes: notas convertibles, SAFEs (Simple Agreement for Future Equity) y acuerdos de suscripción de acciones preferentes. Se analizan las cláusulas de mayor impacto para el emprendedor, como liquidation preference, anti-dilución, drag-along, tag-along y derechos de información. El estudio concluye con recomendaciones para que los fundadores negocien condiciones de inversión favorables sin comprometer el control operativo de la empresa.',
    pdfUrl: '#',
    image: null,
    featured: true,
  },
];
