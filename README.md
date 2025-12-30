# 📘 runtime-intent-z

[![NPM](https://img.shields.io/npm/v/runtime-intent-z.svg)](https://www.npmjs.com/package/runtime-intent-z)
![Downloads](https://img.shields.io/npm/dt/runtime-intent-z.svg)

<a href="https://codesandbox.io/p/sandbox/hdllq7" target="_blank">LIVE EXAMPLE</a>

---

**runtime-intent-z** is a lightweight **intent-first orchestration engine**.

- ❌ Not a state manager  
- ❌ Not an event bus  
- ❌ Not tied to React  

It provides a **runtime layer to orchestrate behavior**, async flows, computed logic, and side effects — driven by **intents**, not UI components.

> Think of it as:  
> **“Business behavior runtime, independent from framework & rendering.”**

---

## ✨ Why / When to Use

Use **runtime-intent-z** when:

- Business logic should **not live inside UI components**
- UI should only **emit intent**, not orchestrate logic
- Async flows are complex (login → fetch → redirect → notify)
- Side effects must be **predictable & testable**
- You want **headless tests** without rendering React
- Multiple independent domains / engines exist
- You follow DDD, hexagonal, or layered architecture

---

## 🧠 Mental Model

```txt
UI / Adapter Layer
 └─ emits intent
      ↓
Intent Engine (runtime-intent-z)
 ├─ intent handlers
 ├─ async orchestration
 ├─ computed graph
 └─ side effects
```

- UI never orchestrates logic.
- It only says: “this intent happened”.

---

## 📦 Installation

```bash
npm install runtime-intent-z
```

---

## 🚀 Basic Usage (Headless)

### Create Engine

```ts
import { createIntentEngine } from "runtime-intent-z"

const engine = createIntentEngine({ name: "cart" })
```

### Define Intent

```ts
// cart/addItem.ts
export function registerCartAddItem(engine) {
  engine.intent("cart.addItem", {
    reducer(state, item) {
      return {
        ...state,
        cart: {
          items: [...(state.cart?.items ?? []), item]
        }
      }
    }
  })
}

```

### Define Computed

```ts
engine.computed("cart.total", {
  deps: ["cart"],
  onIntent: ["cart.addItem"],

  compute({ values }) {
    const items = values.cart?.items ?? []
    return items.reduce(
      (sum: number, item: any) => sum + item.price,
      0
    )
  },

  effect({ value, intent }) {
    console.log("[computed]", intent, "→ total =", value)
  }
})

engine.computed("cart.canCheckout", {
  deps: ["cart.total"],

  compute({ values }) {
    return values["cart.total"] > 0
  }
})
```

### Dispatch

```ts
engine.dispatch("cart.addItem", { price: 100 })
engine.dispatch("cart.addItem", { price: 50 })

engine.getComputed("cart.total")      // 150
engine.getComputed("cart.canCheckout") // true

```

---

## ⚛️ Using with React

```ts
<IntentProvider engine={engine}>
  <App />
</IntentProvider>
```

```ts
function Cart() {
  const engine = useEngine()
  const total = useComputed("cart.total")

  return (
    <>
      <div>Total: {total}</div>

      <button
        onClick={() =>
          engine.dispatch("cart.addItem", { price: 100 })
        }
      >
        Add item
      </button>
    </>
  )
}
```
---

## ⚡ Async Orchestration Example

```ts
engine.intent("user.login", {
  effect(_, { engine }) {
    engine.dispatchAsync(
      "user.login.start",
      null,
      async () => {
        const user = await api.login()
        engine.dispatch("user.login.success", user)
      }
    )
  }
})
```

- No async logic in UI
- Flow is testable & deterministic
- Side effects are centralized

---

--- 


## 🧩 Multiple Engines

```ts
const authEngine = createIntentEngine({ name: "auth" })
const cartEngine = createIntentEngine({ name: "cart" })
```

Each engine:
- Has isolated state
- Has isolated effects
- Can be mounted in different React trees
- Can be tested independently

---

## 🧪 Testing Example

```ts
import { createEngine } from "runtime-intent-z"

test("cart.addItem updates total", () => {
  const engine = createEngine({ name: "test" })

  engine.intent("add", {
    reducer(state, n) {
      return { total: (state.total ?? 0) + n }
    }
  })

  engine.computed("total", {
    deps: ["total"],
    compute({ values }) {
      return values.total
    }
  })

  engine.dispatch("add", 5)
  engine.dispatch("add", 10)

  expect(engine.getComputed("total")).toBe(15)
})
```

- ✔ No React
- ✔ No DOM
- ✔ Pure business test

---

## 🔍 Comparison

| Feature        | runtime-intent-z  | Redux       | Event Bus  |
| -------------- | ----------------  | ----------- | ---------- |
| Intent-based   | ✅                | ❌           | ❌         |
| Async built-in | ✅                | ❌           | ❌         |
| Side effects   | First-class       | Middleware  | Ad-hoc     |
| Computed graph | ✅                | ❌           | ❌         |
| Headless test  | ✅                | ⚠️           | ❌         |


---

## 📜 License

MIT
