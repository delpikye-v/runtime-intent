## 🔀 runtime-intent-z

[![NPM](https://img.shields.io/npm/v/runtime-intent-z.svg)](https://www.npmjs.com/package/runtime-intent-z)
![Downloads](https://img.shields.io/npm/dt/runtime-intent-z.svg)

<a href="https://codesandbox.io/p/sandbox/hdllq7" target="_blank">LIVE EXAMPLE</a>

---

**runtime-intent-z** is a lightweight **intent-first orchestration engine** for frontend & headless applications.

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
 ├─ intent handlers (reducers + effects)
 ├─ async orchestration
 ├─ computed graph
 └─ side effects
```

- UI never orchestrates logic.
- It only says: “this intent happened”.

---

## 📦 Installation
```ts
npm install runtime-intent-z
```
---

## 🚀 Basic Usage (Headless / No Framework)

#### Create Engine
```ts
import { createEngine } from "runtime-intent-z"

const engine = createEngine({ name: "cart" })

```

#### Define Intent
```ts
engine.intent("cart.addItem", {
  reducer(state, item: { price: number }) {
    return {
      ...state,
      cart: {
        items: [...(state.cart?.items ?? []), item]
      }
    }
  }
})

```

#### Define Computed
```ts
engine.computed("cart.total", {
  deps: ["cart"],
  onIntent: ["cart.addItem"],

  compute({ values }) {
    const items = values.cart?.items ?? []
    return items.reduce(
      (sum, item) => sum + item.price,
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

#### Dispatch
```ts
engine.dispatch("cart.addItem", { price: 100 })
engine.dispatch("cart.addItem", { price: 50 })

engine.getComputed<number>("cart.total")       // 150
engine.getComputed<boolean>("cart.canCheckout") // true
```

---

## ⚛️ Using with React (WITHOUT Provider)

#### Engine as Module Singleton

```ts
// cart.engine.ts
import { createEngine } from "runtime-intent-z"

export const cartEngine = createEngine({ name: "cart" })
```

#### React Component
```ts
import { useEffect, useState } from "react"
import { cartEngine } from "./cart.engine"

export function Cart() {
  const [, force] = useState(0)

  useEffect(() => {
    return cartEngine.subscribe(() => {
      force(x => x + 1)
    })
  }, [])

  const total = cartEngine.getComputed<number>("cart.total")

  return (
    <>
      <div>Total: {total}</div>

      <button
        onClick={() =>
          cartEngine.dispatch("cart.addItem", { price: 100 })
        }
      >
        Add item
      </button>
    </>
  )
}
```
✔ No Provider.  
✔ No Context.  
✔ Engine is framework-agnostic.  

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

- Flow is deterministic

- Easy to test

---

## 🧩 Multiple Engines

```ts
const authEngine = createEngine({ name: "auth" })
const cartEngine = createEngine({ name: "cart" })
```

---

## 🧪 Testing Example (Headless)
```ts
import { createEngine } from "runtime-intent-z"

test("cart.addItem updates total", () => {
  const engine = createEngine({ name: "test" })

  engine.intent("add", {
    reducer(state, n: number) {
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

  expect(engine.getComputed<number>("total")).toBe(15)
})

```

## 🔍 Comparison

| Feature        | runtime-intent-z  | Redux       | Event Bus  |
| -------------- | ----------------  | ----------- | ---------  |
| Intent-based   | ✅                | ❌           | ❌         |
| Async built-in | ✅                | ❌           | ❌         |
| Side effects   | First-class       | Middleware  | Ad-hoc     |
| Computed graph | ✅                | ❌           | ❌         |
| Headless test  | ✅                | ⚠️           | ❌         |

---

## 📜 License

MIT