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
 *     const { data } = await supabase.from('opinions').select('*')
 *   - Firebase: import { collection, getDocs } from 'firebase/firestore'
 *     const snapshot = await getDocs(collection(db, 'opinions'))
 */

export const opinions = [
  {
    id: 1,
    title: 'Elegir bien la estructura societaria: la decisión que lo cambia todo',
    author: 'Fernando Castañeda',
    authorBio: 'Abogado corporativo. Especialista en derecho societario y asesoría a startups.',
    date: '2025-04-15',
    excerpt:
      'Muchos emprendedores constituyen su empresa sin pensar demasiado en la forma societaria. Ese descuido inicial puede costar años de problemas legales y pérdidas económicas.',
    content:
      'Muchos emprendedores constituyen su empresa sin pensar demasiado en la forma societaria. Ese descuido inicial puede costar años de problemas legales y pérdidas económicas. La elección entre una Empresa Individual de Responsabilidad Limitada (EIRL), una Sociedad Anónima Cerrada (SAC) o una Sociedad de Responsabilidad Limitada (SRL) no es un mero trámite burocrático: define cómo se toman decisiones, cómo se distribuyen utilidades, qué pasa si un socio quiere salir, y qué tan atractiva es la empresa para un inversionista.\n\nEn mi experiencia asesorando emprendedores, el error más frecuente es optar por la estructura más sencilla en el momento de constituir, sin proyectar el crecimiento. Una EIRL puede ser suficiente para un freelance que empieza, pero en cuanto aparece un segundo cofundador o un inversionista ángel, la estructura ya no sirve. Reformar una empresa ya constituida es posible, pero implica tiempo, costos notariales y registrales, y puede generar contingencias tributarias.\n\nLa recomendación es clara: antes de ir al notario, siéntate con un abogado corporativo y mapea el escenario de tu empresa a tres años. ¿Tendrás socios? ¿Buscarás inversión? ¿Querrás vender la empresa en algún momento? Esas respuestas determinan la estructura correcta. El costo de esa consulta es incomparablemente menor al costo de una reestructuración forzada.',
    category: 'Derecho Societario',
    featured: true,
  },
  {
    id: 2,
    title: 'El pacto de socios: el contrato que todos firman y nadie lee',
    author: 'Milagros Tejada',
    authorBio: 'Abogada transaccional. Experta en resolución de conflictos societarios y fusiones y adquisiciones.',
    date: '2025-04-02',
    excerpt:
      'El pacto de socios es el documento más importante de una empresa y, paradójicamente, el más ignorado. Cuando llegan los conflictos —y siempre llegan— su ausencia o su mala redacción puede destruir un negocio.',
    content:
      'El pacto de socios es el documento más importante de una empresa y, paradójicamente, el más ignorado. Cuando llegan los conflictos —y siempre llegan— su ausencia o su mala redacción puede destruir un negocio. He visto sociedades de años derrumbarse por no haber acordado qué pasa cuando un socio quiere salir, o quién decide cuando los votos están empatados al 50%.\n\nUn buen pacto de socios debe responder, como mínimo, estas preguntas: ¿Cómo se toman las decisiones ordinarias y extraordinarias? ¿Qué porcentaje se necesita para decisiones críticas? ¿Qué pasa si un socio quiere vender su participación? ¿Existe un derecho de tanteo o de acompañamiento? ¿Qué sucede si un socio fallece o queda incapacitado? ¿Hay cláusulas de no competencia?\n\nMuchos emprendedores evitan este tipo de conversaciones al inicio porque sienten que "enfrían" el entusiasmo fundacional. Es comprensible, pero equivocado. Hablar de los escenarios difíciles cuando todo va bien es infinitamente más fácil que hacerlo en medio de una crisis. El pacto de socios no es una señal de desconfianza: es una señal de madurez empresarial. Redactarlo bien, con asesoría legal adecuada, es una de las mejores inversiones que puede hacer un equipo fundador.',
    category: 'Derecho Contractual',
    featured: true,
  },
  {
    id: 3,
    title: 'Compliance desde el primer día: ¿lujo o necesidad para el emprendedor?',
    author: 'Hernán Quispe',
    authorBio: 'Consultor en cumplimiento normativo y gestión de riesgos legales empresariales.',
    date: '2025-03-20',
    excerpt:
      'El compliance no es una moda corporativa reservada para grandes empresas. Es una disciplina que puede —y debe— adaptarse a la escala y realidad del emprendedor desde el primer día.',
    content:
      'El compliance no es una moda corporativa reservada para grandes empresas. Es una disciplina que puede —y debe— adaptarse a la escala y realidad del emprendedor desde el primer día. En el contexto latinoamericano, donde la informalidad es tentadora y los controles son percibidos como obstáculos, la decisión de operar con cumplimiento normativo desde el inicio es, en realidad, una ventaja competitiva.\n\n¿Por qué? Porque los inversionistas serios hacen due diligence. Porque los clientes grandes —especialmente corporaciones o entidades del Estado— exigen ciertos estándares. Porque las contingencias tributarias, laborales y regulatorias descubiertas tardíamente pueden liquidar años de esfuerzo. El costo de subsanar un incumplimiento detectado en una auditoría de adquisición es exponencialmente mayor que el costo de haber operado correctamente desde el principio.\n\nEl compliance para startups no requiere un departamento legal de veinte personas. Requiere, en esencia, tres pilares: contratos laborales correctamente redactados, obligaciones tributarias al día y una política clara de protección de datos personales, especialmente si el modelo de negocio involucra datos de usuarios. Con esas bases cubiertas, el emprendedor puede crecer sobre terreno firme. El resto puede escalarse conforme la empresa crezca.',
    category: 'Cumplimiento Normativo',
    featured: false,
  },
  {
    id: 4,
    title: 'El emprendedor sin asesoría legal: el riesgo más subestimado de una startup',
    author: 'Carmen Flores',
    authorBio: 'Abogada especializada en derecho corporativo y acompañamiento legal a emprendimientos tecnológicos.',
    date: '2025-03-08',
    excerpt:
      'Emprender sin asesoría legal es como construir un edificio sin planos. Todo puede verse bien desde afuera hasta que aparece la primera grieta.',
    content:
      'Emprender sin asesoría legal es como construir un edificio sin planos. Todo puede verse bien desde afuera hasta que aparece la primera grieta. En el ecosistema emprendedor latinoamericano, la asesoría legal suele verse como un gasto prescindible en las etapas tempranas. Esta percepción es uno de los errores más costosos que cometen los fundadores.\n\nLos problemas legales más comunes en startups no vienen de grandes decisiones estratégicas: vienen de los pequeños descuidos del inicio. Un contrato de servicios firmado sin revisar que transfiere todos los derechos de propiedad intelectual al cliente. Un cofundador que abandona la empresa y se lleva el 30% de las acciones sin restricción alguna, porque no existía un vesting schedule. Un empleado contratado como locador de servicios durante dos años que luego demanda el reconocimiento de vínculo laboral con todos sus beneficios.\n\nEstos escenarios se repiten constantemente y todos eran prevenibles con una revisión legal oportuna. El problema no es la falta de recursos: hoy existen abogados especializados en startups que trabajan con modelos de tarifa fija accesibles, o incluso con participación accionaria. El problema es la mentalidad de que "lo legal puede esperar". No puede. La ventana para estructurar bien una empresa es el momento de su fundación. Después, solo quedan las correcciones, que siempre son más caras.',
    category: 'Derecho Corporativo',
    featured: false,
  },
];
