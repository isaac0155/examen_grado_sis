# Revisión del banco de preguntas

Fecha: 16 de septiembre de 2026. Fuente: BANCO DE PREGUNTAS.docx.

Se hicieron tres pasadas por el mismo asistente: resolución conceptual de las 147 preguntas; revisión de distractores, supuestos y errores, con contraste documental de los casos dudosos; y control final de cada clave y explicación. No son tres dictámenes independientes ni una validación del docente. Las pruebas de software verifican el simulador; no sustituyen la revisión académica.

## Hallazgos que cambian el estudio

- **55**: el Word marca D, pero la premisa sobre vistas con JOIN es falsa como regla general. Se conserva sin puntaje y con referencia a la documentación de MySQL.
- **118**: se aceptan B (LIFO) y C (FILO); describen lo mismo.
- **50**: el SQL original tiene errores (`AS SELECT` sin paréntesis y `ROM`). Se corrige la presentación y se califica C para la consulta corregida, conservando `sourcePrompt`.
- **30**: se separa entrega continua de despliegue continuo.
- **63**: se añade un manejador de excepción con `ROLLBACK` y `RESIGNAL`. Un comentario que diga deshacer ante errores no lo hace automáticamente.
- **68**: la condición se hace segura ante valores NULL; se explica cuándo también sirve la original.
- **72**: la consulta original falla después de la última corrección. Se ofrece una guía que contempla ese caso y se explicitan los límites del esquema: eventos ausentes, fechas empatadas y fecha de creación desconocida.
- **85**: se corrige el orden de separación de datos, preprocesamiento y selección de hiperparámetros para evitar fuga de datos.
- Se conservan las letras originales en las demás preguntas, con aclaraciones cuando la opción elegida es la mejor disponible pero simplifica un concepto.

## Criterio de calificación

Las 12 abiertas se autoevalúan, sin comparación automática de palabras. La pregunta 55 no suma ni resta y se excluye del denominador. Todas las demás valen un punto. «No sé» e incorrectas valen cero. El resultado separa calificación automática y autoevaluación.

## Registro final por pregunta

La columna original reproduce la letra del Word cuando existe. «Guía» identifica respuestas abiertas. «Con nota» exige leer la aclaración inferior o el campo `reviewNote` del JSON.

| N.º | Clave original | Clave revisada | Resultado de las tres pasadas |
| --- | --- | --- | --- |
| 1 | B | B | Revisada |
| 2 | C | C | Revisada |
| 3 | B | B | Revisada |
| 4 | A | A | Revisada |
| 5 | B | B | Revisada |
| 6 | C | C | Revisada, con nota |
| 7 | B | B | Revisada |
| 8 | C | C | Revisada |
| 9 | B | B | Revisada |
| 10 | C | C | Revisada |
| 11 | B | B | Revisada |
| 12 | C | C | Revisada |
| 13 | B | B | Revisada, con nota |
| 14 | B | B | Revisada |
| 15 | B | B | Revisada |
| 16 | C | C | Revisada |
| 17 | B | B | Revisada |
| 18 | A | A | Revisada |
| 19 | B | B | Revisada |
| 20 | B | B | Revisada |
| 21 | A | A | Revisada |
| 22 | B | B | Revisada |
| 23 | B | B | Revisada |
| 24 | B | B | Revisada |
| 25 | C | C | Revisada |
| 26 | B | B | Revisada |
| 27 | B | B | Revisada |
| 28 | Guía | Autoevaluación | Revisada |
| 29 | Guía | Autoevaluación | Revisada |
| 30 | Guía | Autoevaluación | Revisada, con nota |
| 31 | A | A | Revisada, con nota |
| 32 | B | B | Revisada |
| 33 | C | C | Revisada, con nota |
| 34 | D | D | Revisada |
| 35 | A | A | Revisada |
| 36 | B | B | Revisada |
| 37 | C | C | Revisada, con nota |
| 38 | D | D | Revisada |
| 39 | A | A | Revisada |
| 40 | B | B | Revisada |
| 41 | C | C | Revisada, con nota |
| 42 | D | D | Revisada |
| 43 | A | A | Revisada, con nota |
| 44 | B | B | Revisada, con nota |
| 45 | Guía | Autoevaluación | Revisada |
| 46 | C | C | Revisada, con nota |
| 47 | D | D | Revisada |
| 48 | A | A | Revisada, con nota |
| 49 | B | B | Revisada |
| 50 | C | C | Revisada, con nota |
| 51 | D | D | Revisada, con nota |
| 52 | A | A | Revisada |
| 53 | B | B | Revisada |
| 54 | C | C | Revisada |
| 55 | D | Sin calificación | Revisada, con nota |
| 56 | A | A | Revisada, con nota |
| 57 | B | B | Revisada |
| 58 | C | C | Revisada, con nota |
| 59 | D | D | Revisada |
| 60 | A | A | Revisada, con nota |
| 61 | B | B | Revisada |
| 62 | C | C | Revisada, con nota |
| 63 | Guía | Autoevaluación | Revisada, con nota |
| 64 | D | D | Revisada, con nota |
| 65 | A | A | Revisada, con nota |
| 66 | B | B | Revisada, con nota |
| 67 | C | C | Revisada |
| 68 | Guía | Autoevaluación | Revisada, con nota |
| 69 | D | D | Revisada |
| 70 | A | A | Revisada |
| 71 | B | B | Revisada |
| 72 | Guía | Autoevaluación | Revisada, con nota |
| 73 | C | C | Revisada, con nota |
| 74 | D | D | Revisada |
| 75 | A | A | Revisada, con nota |
| 76 | B | B | Revisada, con nota |
| 77 | C | C | Revisada |
| 78 | D | D | Revisada, con nota |
| 79 | A | A | Revisada |
| 80 | B | B | Revisada |
| 81 | C | C | Revisada |
| 82 | D | D | Revisada |
| 83 | B | B | Revisada |
| 84 | V | V | Revisada |
| 85 | Guía | Autoevaluación | Revisada, con nota |
| 86 | B | B | Revisada |
| 87 | V | V | Revisada |
| 88 | Guía | Autoevaluación | Revisada |
| 89 | B | B | Revisada |
| 90 | F | F | Revisada |
| 91 | Guía | Autoevaluación | Revisada |
| 92 | B | B | Revisada |
| 93 | Guía | Autoevaluación | Revisada |
| 94 | A | A | Revisada |
| 95 | F | F | Revisada |
| 96 | Guía | Autoevaluación | Revisada |
| 97 | B | B | Revisada |
| 98 | C | C | Revisada |
| 99 | B | B | Revisada |
| 100 | B | B | Revisada, con nota |
| 101 | B | B | Revisada |
| 102 | C | C | Revisada |
| 103 | B | B | Revisada, con nota |
| 104 | C | C | Revisada |
| 105 | C | C | Revisada |
| 106 | B | B | Revisada |
| 107 | B | B | Revisada |
| 108 | B | B | Revisada |
| 109 | B | B | Revisada |
| 110 | B | B | Revisada |
| 111 | B | B | Revisada |
| 112 | B | B | Revisada |
| 113 | B | B | Revisada |
| 114 | B | B | Revisada |
| 115 | B | B | Revisada |
| 116 | B | B | Revisada |
| 117 | B | B | Revisada |
| 118 | B | B, C | Revisada, con nota |
| 119 | B | B | Revisada |
| 120 | B | B | Revisada |
| 121 | B | B | Revisada |
| 122 | B | B | Revisada |
| 123 | C | C | Revisada |
| 124 | B | B | Revisada |
| 125 | A | A | Revisada |
| 126 | B | B | Revisada |
| 127 | B | B | Revisada |
| 128 | B | B | Revisada |
| 129 | C | C | Revisada |
| 130 | C | C | Revisada |
| 131 | A | A | Revisada |
| 132 | B | B | Revisada |
| 133 | B | B | Revisada |
| 134 | C | C | Revisada |
| 135 | A | A | Revisada |
| 136 | C | C | Revisada |
| 137 | B | B | Revisada |
| 138 | B | B | Revisada |
| 139 | B | B | Revisada |
| 140 | A | A | Revisada |
| 141 | B | B | Revisada |
| 142 | B | B | Revisada |
| 143 | A | A | Revisada |
| 144 | C | C | Revisada |
| 145 | B | B | Revisada |
| 146 | C | C | Revisada |
| 147 | B | B | Revisada |

## Aclaraciones y fuentes

### Pregunta 6

La mejora del rendimiento se suele llamar mantenimiento perfectivo; C es la mejor opción ofrecida para añadir funcionalidades.


### Pregunta 13

La opción B es abreviada: faltan el objetivo del Sprint y el plan de entrega.

- [Documentación de referencia 1](https://scrumguides.org/scrum-guide.html)

### Pregunta 30

Se distingue entrega continua de despliegue continuo; el Word mezclaba ambos conceptos.


### Pregunta 31

La combinación debe ser UNIQUE (vuelo_id, asiento_id). Para que garantice ocupación única, ambas columnas deben ser NOT NULL; MySQL admite varios NULL en índices UNIQUE.


### Pregunta 33

La respuesta aplica a InnoDB. En este motor NO ACTION, que es el valor predeterminado documentado, equivale a RESTRICT.

- [Documentación de referencia 1](https://dev.mysql.com/doc/refman/8.4/en/create-table-foreign-keys.html)

### Pregunta 37

Si se filtran reservas confirmadas, el filtro de estado debe ir en ON para conservar también vuelos sin reservas confirmadas.


### Pregunta 41

C es la opción pretendida. Para garantizar dos transacciones diferentes añadir t1.id <> t2.id; si se exige estrictamente después, usar t2.fecha > t1.fecha. BETWEEN incluye ambos límites.


### Pregunta 43

Se corrigió una errata de sintaxis del SQL original; el enunciado original se conserva en sourcePrompt.


### Pregunta 44

B reproduce el conjunto de filas del ejemplo. UNION elimina duplicados; para preservar multiplicidades en general se usa LEFT JOIN UNION ALL con solo las filas sin coincidencia del otro lado.


### Pregunta 46

C expresa la mejora esperada, no una garantía. El optimizador puede transformar subconsultas correlacionadas; comprobar el plan y medir con EXPLAIN ANALYZE.

- [Documentación de referencia 1](https://dev.mysql.com/doc/refman/8.4/en/derived-table-optimization.html)

### Pregunta 48

Se corrigieron espacios del SQL. Una tabla derivada necesita alias, pero el optimizador puede fusionarla: no siempre materializa una tabla temporal.

- [Documentación de referencia 1](https://dev.mysql.com/doc/refman/8.4/en/derived-tables.html)
- [Documentación de referencia 2](https://dev.mysql.com/doc/refman/8.4/en/derived-table-optimization.html)

### Pregunta 50

El SQL original no tenía el paréntesis tras AS y decía ROM en vez de FROM: literalmente no ejecuta. La web corrige esas erratas y califica C para la consulta corregida.

- [Documentación de referencia 1](https://dev.mysql.com/doc/refman/8.4/en/with.html)

### Pregunta 51

D explica el problema con WHERE, pero no es obligatorio usar una CTE: GROUP BY ... HAVING SUM(monto) > 5000 también es válido.


### Pregunta 55

El Word marca D. La premisa es incorrecta; esta pregunta se conserva para estudiar, pero no suma ni resta puntos. Consultar al docente.

- [Documentación de referencia 1](https://dev.mysql.com/doc/refman/8.4/en/view-updatability.html)

### Pregunta 56

La respuesta se refiere a los métodos básicos de Sequelize del escenario. No debe generalizarse a todos los ORM ni a todas sus versiones.

- [Documentación de referencia 1](https://sequelize.org/docs/v6/core-concepts/raw-queries/)

### Pregunta 58

La respuesta se refiere a los métodos básicos de Sequelize del escenario. No debe generalizarse a todos los ORM ni a todas sus versiones.

- [Documentación de referencia 1](https://sequelize.org/docs/v6/core-concepts/raw-queries/)

### Pregunta 60

A supone que fecha es DATE. Si fuera DATETIME, comparar un rango desde p_fecha hasta p_fecha + INTERVAL 1 DAY para incluir todas las horas del día.


### Pregunta 62

Se corrigió una errata de sintaxis del SQL original; el enunciado original se conserva en sourcePrompt.


### Pregunta 63

Cuerpo de procedimiento: declarar el manejador antes de las sentencias. Se requiere un motor transaccional como InnoDB y que el procedimiento controle esta transacción. El comentario del Word no ejecutaba ROLLBACK.

- [Documentación de referencia 1](https://dev.mysql.com/doc/refman/8.4/en/declare-handler.html)

### Pregunta 64

SIGNAL impide que la sentencia termine correctamente. En tablas transaccionales se revierte esa sentencia; no asumir que automáticamente revierte toda una transacción con sentencias anteriores.

- [Documentación de referencia 1](https://dev.mysql.com/doc/refman/8.0/en/trigger-syntax.html)

### Pregunta 65

SIGNAL impide que la sentencia termine correctamente. En tablas transaccionales se revierte esa sentencia; no asumir que automáticamente revierte toda una transacción con sentencias anteriores.

- [Documentación de referencia 1](https://dev.mysql.com/doc/refman/8.0/en/trigger-syntax.html)

### Pregunta 66

SIGNAL impide que la sentencia termine correctamente. En tablas transaccionales se revierte esa sentencia; no asumir que automáticamente revierte toda una transacción con sentencias anteriores.

- [Documentación de referencia 1](https://dev.mysql.com/doc/refman/8.0/en/trigger-syntax.html)

### Pregunta 68

La expresión del Word (OLD.estado <> 'cancelada') es válida si estado no admite NULL. La guía usa comparación segura ante NULL para detectar también NULL → cancelada.

- [Documentación de referencia 1](https://dev.mysql.com/doc/refman/8.4/en/comparison-operators.html)

### Pregunta 72

El Word solo busca el cambio siguiente y falla después del último. La guía toma primero el último cambio hasta la fecha, o el valor anterior del primer cambio posterior. Supone auditoría completa, fechas sin empate y un historial ya existente en la fecha consultada. Sin eventos, fecha de creación o desempate, el esquema dado no permite reconstruir todos los casos.


### Pregunta 73

FULLTEXT busca términos y no sustituye exactamente a LIKE '%texto%'. Un índice puede servir para un escaneo de cobertura, aunque no para la búsqueda por prefijo de este ejemplo.

- [Documentación de referencia 1](https://dev.mysql.com/doc/refman/8.4/en/range-optimization.html)

### Pregunta 75

A utiliza el prefijo izquierdo (categoria, marca), no las tres columnas como filtro. No es cierto que todas las otras consultas siempre recorran la tabla: existen estrategias como skip scan.

- [Documentación de referencia 1](https://dev.mysql.com/doc/refman/8.4/en/range-optimization.html)

### Pregunta 76

UNIQUE permite varios NULL en MySQL. Usar también NOT NULL si todos los usuarios deben tener correo; la igualdad depende de la collation.


### Pregunta 78

MongoDB tiene esquema flexible, y también permite configurar validación de esquema.


### Pregunta 85

El preprocesamiento que aprende parámetros debe ajustarse solo con entrenamiento. No usar el conjunto de prueba para elegir hiperparámetros.

- [Documentación de referencia 1](https://scikit-learn.org/1.8/common_pitfalls.html)

### Pregunta 100

Se distingue tamaño conocido al compilar de inicialización estática o dinámica.


### Pregunta 103

B es la propiedad básica buscada. Si se interpreta vector como std::vector, C también describe su capacidad de cambiar de tamaño; aquí el tema distingue vector básico de vector dinámico.


### Pregunta 118

Se aceptan B y C: LIFO y FILO son equivalentes. El documento solo marca B.


## Integridad de extracción

147 números consecutivos, 131 preguntas de opción múltiple, 4 de verdadero/falso, 12 abiertas y 13 tablas. Se preservan saltos de línea, caracteres de código y la pregunta 43, pegada a la explicación de la 42 en el Word. Las revisiones viven separadas del importador en `data/revisions.json`.
