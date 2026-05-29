import { CodeExample, PipelineStep } from './types';

export const CODE_EXAMPLES: CodeExample[] = [
  {
    id: 1,
    title: 'Función con Bucles',
    description: 'Lógica compleja que involucra comprensiones de lista (list comprehensions) y patrones de filtrado.',
    src: "def double_evens(items):\n    return [x * 2 for x in items if x % 2 == 0]",
    out: "const doubleEvens = (items) => {\n  return items.filter(x => x % 2 === 0).map(x => x * 2);\n};"
  },
  {
    id: 2,
    title: 'Clase con Métodos',
    description: 'Traducción orientada a objetos que incluye mapeo del método constructor y referencias correctas con "this".',
    src: "class User:\n    def __init__(self, name):\n        self.name = name\n    def greet(self):\n        return f\"Hello {self.name}\"",
    out: "class User {\n  constructor(name) {\n    this.name = name;\n  }\n  greet() {\n    return `Hello ${this.name}`;\n  }\n}"
  },
  {
    id: 3,
    title: 'Algoritmo de Ordenamiento',
    description: 'Patrones de manipulación de arrays y particionamiento crítico para el rendimiento (ej: Quicksort).',
    src: "def quicksort(arr):\n    if len(arr) <= 1: return arr\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    middle = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    return quicksort(left) + middle + quicksort(right)",
    out: "function quicksort(arr) {\n  if (arr.length <= 1) return arr;\n  const pivot = arr[Math.floor(arr.length / 2)];\n  const left = arr.filter(x => x < pivot);\n  const middle = arr.filter(x => x === pivot);\n  const right = arr.filter(x => x > pivot);\n  return [...quicksort(left), ...middle, ...quicksort(right)];\n}"
  }
];

export const PIPELINE_STEPS: PipelineStep[] = [
  {
    id: 1,
    label: 'ENTRADA',
    icon: 'CornerDownRight',
    description: 'Lectura y sanitización del bloque de código original.'
  },
  {
    id: 2,
    label: 'DETECCIÓN',
    icon: 'Binary',
    description: 'Identificación del AST, dialectos y palabras clave primarias.'
  },
  {
    id: 3,
    label: 'TOKENIZACIÓN',
    icon: 'Hash',
    description: 'Análisis léxico en tokens y construcción del árbol sintáctico abstracto.'
  },
  {
    id: 4,
    label: 'MODELO',
    icon: 'Cpu',
    description: 'Traducción inteligente mediante modelos neuronales de IA de alta fidelidad.'
  },
  {
    id: 5,
    label: 'POST-PROCESO',
    icon: 'Sparkles',
    description: 'Ajuste estético de sangría, optimizaciones de API y formateo idiomático.'
  },
  {
    id: 6,
    label: 'SALIDA',
    icon: 'CheckSquare',
    description: 'Retorno listo del código fuente con validación y tasas de confianza.'
  }
];

export const DEFAULT_SOURCE_CODE = `def calculate_total(prices, discount):
    """
    Apply global discount to a list of product prices
    """
    total = sum(prices)
    if discount > 0:
        return total * (1 - discount)
    return total

items = [29.99, 5.00, 15.50]
print(f"Total: {calculate_total(items, 0.1)}")`;

export const DEFAULT_TARGET_CODE = `/**
 * Aplica descuento global a una lista de precios
 */
function calculateTotal(prices, discount) {
    const total = prices.reduce((acc, curr) => acc + curr, 0);
    if (discount > 0) {
        return total * (1 - discount);
    }
    return total;
}

const items = [29.99, 5.0, 15.5];
console.log(\`Total: \${calculateTotal(items, 0.1)}\`);`;
