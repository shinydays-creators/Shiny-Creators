-- ============================================================
-- SHINY CREATORS — Biblioteca de contenido
-- Pega en Supabase > SQL Editor y haz clic en Run ▶️
-- ============================================================

CREATE TABLE IF NOT EXISTS public.content_library (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title       text NOT NULL,
  category    text NOT NULL CHECK (category IN ('grabar','editar','crecer','colaboraciones')),
  emoji       text DEFAULT '📖',
  preview     text,           -- Texto corto que se ve siempre (también en premium)
  body        text,           -- Contenido completo (solo visible si is_premium = false)
  is_premium  boolean DEFAULT false,
  order_index integer DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE public.content_library ENABLE ROW LEVEL SECURITY;

-- Cualquier usuaria autenticada puede leer
CREATE POLICY "Leer contenido autenticada" ON public.content_library
  FOR SELECT TO authenticated USING (true);

-- ─── CONTENIDO DE EJEMPLO ────────────────────────────────────────────────────

INSERT INTO public.content_library (title, category, emoji, preview, body, is_premium, order_index) VALUES

-- GRABAR
('Los 3 errores que arruinan tu vídeo (y cómo evitarlos)', 'grabar', '🎥',
 'Pequeños fallos técnicos que alejan a tu audiencia antes de que llegue al minuto 1.',
 E'Grabar bien no requiere una cámara cara. Requiere evitar estos tres errores que cometen el 90% de creadoras nuevas:\n\n**1. Mala iluminación**\nLa luz natural es tu mejor amiga. Siéntate de frente a una ventana, nunca de espaldas. Si grabas de noche, una ring light de 30€ cambia todo.\n\n**2. Audio con eco**\nGrabar en habitaciones vacías crea eco. Coloca una manta detrás de ti, graba en un armario lleno de ropa o usa un micrófono de solapa (desde 15€ en Amazon).\n\n**3. Encuadre cortado**\nDeja espacio por encima de tu cabeza pero no demasiado. La regla de los tercios: tus ojos deben estar en el tercio superior del plano.',
 false, 1),

('Cómo grabar con el móvil como una pro', 'grabar', '📱',
 'Tu iPhone o Android es más que suficiente. El secreto está en cómo lo usas.',
 E'El 90% de las creadoras que triunfan en TikTok e Instagram graban con el móvil. Aquí van los trucos que marcan la diferencia:\n\n**Configura la cámara**\nGraba siempre en la máxima resolución disponible (4K si puedes). En iOS: Ajustes > Cámara > Grabar vídeo > 4K 30fps.\n\n**Bloquea el foco y la exposición**\nMantén pulsado en la pantalla donde estás tú hasta que aparezca "AE/AF BLOQUEADO". Así el móvil no cambiará el enfoque mientras grabas.\n\n**Usa el modo retrato con cuidado**\nEl modo retrato desenfoca el fondo, pero puede crear bordes raros. Prueba a alejarte físicamente del fondo en lugar de usar este modo.\n\n**Trípode siempre**\nUn trípode de 10€ elimina el temblor. Es la inversión más rentable que puedes hacer.',
 false, 2),

('La iluminación perfecta sin gastar dinero', 'grabar', '💡',
 'Aprende a usar la luz que ya tienes en casa para conseguir un resultado profesional.',
 null, true, 3),

('Mi setup completo para grabar en casa', 'grabar', '🏠',
 'Todo lo que uso para grabar: cámara, micro, luz y fondo. Con opciones para cada presupuesto.',
 null, true, 4),

-- EDITAR
('Edita un Reel en 10 minutos con CapCut', 'editar', '✂️',
 'La app gratuita que usan las mejores creadoras. Paso a paso desde cero.',
 E'CapCut es gratis, está en español y funciona en iPhone y Android. Aquí el flujo más rápido:\n\n**Paso 1 — Importa tus clips**\nAbre CapCut > Nuevo proyecto > selecciona tus vídeos en orden.\n\n**Paso 2 — Corta lo que no sirve**\nPulsa sobre el clip > Dividir. Elimina silencios, tartamudeos y partes aburridas. Regla de oro: si no añade valor, fuera.\n\n**Paso 3 — Añade subtítulos automáticos**\nTexto > Subtítulos automáticos. CapCut transcribe tu voz en segundos. Ajusta el estilo para que encaje con tu estética.\n\n**Paso 4 — Música y sonido**\nUsa la biblioteca de CapCut (son libres de derechos). Baja el volumen de la música al 15-20% para que tu voz se escuche bien.\n\n**Paso 5 — Exporta**\n1080p, 30fps para Instagram y TikTok. Listo.',
 false, 1),

('Los 5 cortes que necesitas saber', 'editar', '🎬',
 'No necesitas efectos complicados. Con estos 5 tipos de corte puedes hacer cualquier vídeo.',
 E'El montaje no es magia. Es saber cuándo y cómo cortar. Estos son los 5 cortes fundamentales:\n\n**1. Corte seco**\nPasas de un plano a otro sin transición. Es el más usado y el más limpio. Úsalo siempre que puedas.\n\n**2. Jump cut**\nCortas dentro del mismo plano para eliminar silencios o repeticiones. Muy usado en vídeos de YouTube y tutoriales.\n\n**3. Corte en L**\nEl audio de la siguiente escena empieza antes de que cambies la imagen. Crea una sensación de fluidez muy profesional.\n\n**4. Corte en J**\nAl revés: ves la nueva escena antes de escuchar su audio. Genera expectativa.\n\n**5. Corte por acción**\nCortas justo en el momento de un movimiento (un aplauso, una puerta que se abre). Hace el montaje invisible.',
 false, 2),

('Cómo hacer transiciones que enganchen', 'editar', '🌀',
 'Las transiciones virales de TikTok explicadas paso a paso. Más fáciles de lo que parecen.',
 null, true, 3),

('Mi flujo de edición completo paso a paso', 'editar', '⚡',
 'Cómo edito un vídeo de principio a fin en menos de 2 horas. Mi proceso exacto.',
 null, true, 4),

-- CRECER
('Qué publicar cuando no tienes ideas', 'crecer', '💡',
 'El bloqueo creativo le pasa a todas. Aquí tienes un sistema para nunca quedarte sin contenido.',
 E'El truco no es tener más ideas. Es tener un sistema para generarlas cuando no tienes ninguna.\n\n**El método de las 3 columnas**\nCoge papel y dibuja 3 columnas:\n- Columna 1: temas de tu nicho (maquillaje, viajes, fitness...)\n- Columna 2: formatos (tutorial, opinión, día en mi vida, ranking...)\n- Columna 3: ganchos emocionales (error que cometí, lo que nadie te cuenta, probé durante 30 días...)\n\nCombina una opción de cada columna y tienes un vídeo.\n\n**Ejemplo:**\nMaquillaje + Tutorial + "Lo que nadie te cuenta" = "Lo que nadie te cuenta sobre el contouring que aprendí tras 3 años"\n\n**Roba como una artista**\nBusca en TikTok o YouTube los vídeos más vistos de tu nicho. No copies, pero adapta el formato a tu estilo y audiencia.',
 false, 1),

('Cómo funciona el algoritmo de Instagram en 2025', 'crecer', '📊',
 'Sin tecnicismos: lo que el algoritmo premia y lo que penaliza. Explicado fácil.',
 E'Instagram no quiere que la gente deje de usar Instagram. Eso es todo. Si tu contenido consigue que la gente se quede más tiempo en la app, Instagram lo mostrará a más personas.\n\n**Lo que el algoritmo premia:**\n- Tiempo de visualización (cuánto ven tu Reel antes de irse)\n- Guardados (señal muy fuerte de que el contenido es valioso)\n- Compartidos (especialmente en Stories y DMs)\n- Comentarios con texto (no solo emojis)\n\n**Lo que el algoritmo penaliza:**\n- Bajadas bruscas de visualización (si mucha gente se va en los primeros 2 segundos)\n- Contenido con marcas de agua de otras apps (el logo de TikTok, por ejemplo)\n- Publicar y desaparecer (responde comentarios en la primera hora)\n\n**El hook es todo**\nLos primeros 2-3 segundos deciden si alguien se queda o se va. Empieza siempre con algo que genere curiosidad o sorpresa.',
 false, 2),

('La estrategia que me llevó a 10K seguidores', 'crecer', '🚀',
 'Paso a paso, semana a semana. El plan exacto para llegar a tu primer hito grande.',
 null, true, 3),

('Cómo analizar tus métricas para crecer más rápido', 'crecer', '📈',
 'Las 5 métricas que de verdad importan y cómo usarlas para tomar decisiones.',
 null, true, 4),

-- COLABORACIONES
('Cómo escribir un email a una marca', 'colaboraciones', '📧',
 'La plantilla exacta que funciona. Sin adornos, sin miedo, sin que parezca un spam.',
 E'Las marcas reciben cientos de emails de creadoras. La mayoría los ignoran porque son genéricos. El tuyo no lo será.\n\n**Estructura del email perfecto:**\n\nAsunto: Colaboración [Nombre Marca] x [Tu nombre/canal]\n\n"Hola [nombre real de la persona, búscalo en LinkedIn],\n\nSoy [tu nombre], creadora de contenido de [nicho] con [X seguidores] en [plataforma]. Mi audiencia es [descripción breve: mujeres 18-30, apasionadas por la moda sostenible].\n\nMe encanta [producto concreto de la marca] porque [razón genuina]. Creo que encajaría perfectamente con mi comunidad porque [conexión real].\n\nMe gustaría proponer una colaboración de [formato: unboxing / review / integración en vídeo]. ¿Tienes 15 minutos esta semana para hablarlo?\n\n[Tu nombre]\n[Enlace a tu perfil]"\n\n**Claves:** sé específica, menciona un producto real, propón algo concreto y no pidas dinero en el primer email.',
 false, 1),

('Cuánto cobrar por una colaboración', 'colaboraciones', '💰',
 'La fórmula que usan las creadoras profesionales para no regalarse ni perder oportunidades.',
 E'El error más común: cobrar demasiado poco por miedo o demasiado sin saber el estándar del mercado.\n\n**La fórmula base:**\nSeguidores ÷ 1000 × CPM de tu nicho = precio mínimo por publicación\n\nCPM aproximado por nicho:\n- Belleza y moda: 20-40€\n- Fitness y salud: 25-45€\n- Lifestyle: 15-30€\n- Tecnología: 30-60€\n\n**Ejemplo:**\n5.000 seguidores ÷ 1000 × 25€ = 125€ mínimo por post\n\n**Ajustes al precio:**\n+50% si incluye vídeo editado\n+30% si piden exclusividad\n+20% si es contenido urgente (menos de 1 semana)\n-20% si es tu primera colaboración con esa marca (solo para conseguir la primera)\n\n**Importante:** siempre pide un briefing por escrito antes de confirmar el precio.',
 false, 2),

('Mi plantilla de media kit lista para usar', 'colaboraciones', '📄',
 'El documento que las marcas te piden antes de contratarte. Te doy mi plantilla exacta.',
 null, true, 3),

('Cómo conseguir tu primer brand deal sin seguidores', 'colaboraciones', '🤝',
 'El método que funciona cuando eres pequeña. No necesitas 10K para conseguir tu primera colaboración.',
 null, true, 4);

-- ✅ Listo. Gestiona tu contenido desde Supabase > Table Editor > content_library
