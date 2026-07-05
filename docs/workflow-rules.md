# Workflow Editor & Node Developer Rules 🧩

This guide outlines the architectural patterns, directory structures, coding rules, context APIs, type definitions, and localization rules for developing new workflow nodes in the AI Agent Builder. Developers must strictly follow these rules to maintain consistency, type safety, and component reusability.

---

## 1. Directory Structure

Every workflow node must be isolated in its own subfolder under `components/layout/workflow-layout/nodes/`. Each node folder must follow this exact naming and file layout (note: `executor.ts` is only required for execution-carrying logic/action nodes, while static helper/boundary nodes map to `null`):

```
📁 components/layout/workflow-layout/nodes/
└── 📁 {node-type-name}/               # Folder name in kebab-case (e.g., api-node)
    ├── 📄 config.ts                     # Default configuration & handle definitions
    ├── 📄 index.tsx                    # Main visual React component of the node
    ├── 📄 info.tsx                     # Info dialog component (documentation pane)
    └── 📄 executor.ts                   # Modular execution logic (Only for execution-carrying nodes)
```

---

## 2. Naming Conventions

To keep imports clean and consistent, implement the following naming conventions:

| File | Target Entity | Naming Pattern | Example |
| :--- | :--- | :--- | :--- |
| **Folder** | Directory | kebab-case | `api-node` |
| **config.ts** | Configuration Object | `camelCaseNodeConfig` | `apiNodeConfig` |
| **index.tsx** | React Component | `PascalCaseNode` | `ApiNode` |
| **info.tsx** | Info Component | `PascalCaseNodeInfo` | `ApiNodeInfo` |
| **executor.ts** | Execution Function (if needed) | `camelCaseNodeExecutor` | `apiNodeExecutor` |
| **types.ts** | Enum Entry | `UPPERCASE_SNAKE_CASE` | `NodeType.API` |

---

## 3. Strict Reusability Rules

To keep the UI consistent and avoid code duplication, follow these component rules:

### A. Wrapping the Node
* **Do NOT** write custom visual card containers or styles for node wrappers.
* **MUST use** the `NodeWrapper` component from `components/layout/workflow-layout/nodes/node-wrapper/NodeWrapper.tsx`.
* `NodeWrapper` handles standard behaviors automatically:
  * Selection borders (`ring-2 ring-primary`).
  * Execution status indicators (Idle, Running, Success, Failure, Waiting).
  * Info button trigger & documentation dialog overlay.
  * Node actions (Duplicate, Delete, Manual Execution).

### B. Rendering Handles & Inputs
* **Do NOT** render custom HTML inputs (`<input>`, `<select>`, `<textarea>`) or raw `@xyflow/react` `<Handle>` elements inside the node components unless the node type demands an entirely non-standard layout (like `StartNode` or `EndNode`).
* **MUST use** the `NodeHandles` component from `components/layout/workflow-layout/nodes/node-wrapper/NodeHandles.tsx`.
* Pass the `handleRows` array directly to `NodeHandles`. It dynamically manages:
  * Port placements (Left for Target/Input, Right for Source/Output).
  * Handle formatting (colors, connections, validations).
  * Connection state representation (disables manual inputs and shows a "Connected" badge when a handle is linked).
  * Standard inputs (text, number, select, boolean toggles).

---

## 4. State & Context Management

All nodes must interact with the workflow editor state through the centralized `WorkflowContext`:

* **Never maintain local state** inside node components for values that belong to the workflow graph.
* **Use** the `useWorkflow` context hook from `components/context/workflow-context`.
* **State Updates:** To modify configurations or row values (e.g., when an input changes), call `updateNodeData(nodeId, updates)`.
* **Flow Controls:** Use methods provided by the context (like `duplicateNode`, `removeNode`, `executeNode`) instead of writing standalone graph mutation logic.

---

## 5. Node Localization (i18n) Rules 🌐

To support multi-language localizations, all user-facing copy must be resolved dynamically through the locale files:

* **Define keys in JSON:** Put all text copy inside `i18n/locales/en.json` (and other translation locale files) using structured paths.
* **Define translation keys in config.ts:** Do NOT write raw user-facing text strings like `"Start"`, `"Text"`, or `"Enter text..."` inside the configuration files. Instead, set the properties directly to their translation path keys. For example:
  * `header.label`: `"flow.nodeTypes.nodes.textNode.label"`
  * `header.description`: `"flow.nodeTypes.nodes.textNode.description"`
  * `handleRows[0].label`: `"flow.nodeTypes.nodes.textNode.fields.text-value.label"`
  * `handleRows[0].config.placeholder`: `"flow.nodeTypes.nodes.textNode.fields.text-value.placeholder"`
* **Load Translation Hook:** Load the dictionary object inside components using `useTheme()` and resolve path strings using `getNestedProperty`:
  ```tsx
  const { dictionary } = useTheme();
  const t = useCallback(
    (path: string, defaultValue: string): string => {
      if (!dictionary) return defaultValue;
      return getNestedProperty(dictionary, path) || defaultValue;
    },
    [dictionary]
  );
  ```
* **Automatic Translation Resolution:** The generic node components automatically call `t(header.label)` and `t(row.label)`:
  * [NodeWrapper](file:///C:/Users/Pawan/Desktop/FullStackProject/agent-builder/components/layout/workflow-layout/nodes/node-wrapper/NodeWrapper.tsx) automatically translates the header labels and descriptions.
  * [NodeHandles](file:///C:/Users/Pawan/Desktop/FullStackProject/agent-builder/components/layout/workflow-layout/nodes/node-wrapper/NodeHandles.tsx) and [NodeInputRenderer](file:///C:/Users/Pawan/Desktop/FullStackProject/agent-builder/components/layout/workflow-layout/nodes/node-wrapper/NodeHandles.tsx) translate row labels, placeholders, select options, and badges automatically using the configuration key directly.

---

## 6. Translation Mapping for All Node Types 🗺️

When developing any node type registered under the `NodeType` enum, you must implement the corresponding translation structure inside `i18n/locales/en.json`. Use the following standard keys to resolve titles, fields, input placeholders, handles, and helper texts:

### Translation Paths & Fields Map

| Node Type (`NodeType`) | JSON Node Key | Example Field Paths (`fields.{fieldId}.*`) |
| :--- | :--- | :--- |
| `START` | `startNode` | `start.label`, `start.description` |
| `END` | `endNode` | `end.label`, `end.description` |
| `TEXT` | `textNode` | `text-value.label`, `text-value.placeholder` |
| `NUMBER` | `numberNode` | `number-value.label`, `number-value.placeholder` |
| `API` | `apiNode` | `url.label`, `url.placeholder`, `method.label`, `headers.label` |
| `LLM` | `llmNode` | `model.label`, `prompt.label`, `temperature.label` |
| `CONDITIONAL` | `conditionalNode` | `condition.label`, `condition.placeholder` |
| `LOOP` | `loopNode` | `items.label`, `loop-count.label` |
| `INPUT` | `inputNode` | `input-key.label`, `input-type.label` |
| `OUTPUT` | `outputNode` | `output-format.label` |
| `MODEL` | `modelNode` | `model-path.label` |
| `TOOL` | `toolNode` | `tool-select.label` |
| `CODE` | `codeNode` | `language.label`, `script-body.placeholder` |
| `DATABASE` | `databaseNode` | `query.label`, `connection.placeholder` |
| `EMAIL` | `emailNode` | `to.label`, `subject.label`, `body.placeholder` |
| `WEBHOOK` | `webhookNode` | `endpoint-url.label` |
| `MESSAGE` | `messageNode` | `recipient.label`, `message-body.placeholder` |
| `FILTER` | `filterNode` | `rule.label`, `matching-value.placeholder` |
| `TIMER` | `timerNode` | `duration.label`, `unit.label` |
| `MAP` | `mapNode` | `mapping-expression.label` |
| `FILE` | `fileNode` | `file-path.label`, `operation-mode.label` |
| `IMAGE` | `imageNode` | `image-url.label`, `filter-type.label` |
| `TABLE` | `tableNode` | `columns.label`, `rows.label` |
| `CALENDAR` | `calendarNode` | `date-time.label`, `time-zone.label` |
| `UPLOAD` | `uploadNode` | `allowed-extensions.label`, `max-bytes.label` |

### JSON Translation Structure Example (`i18n/locales/en.json`)
```json
{
  "flow": {
    "nodeTypes": {
      "nodes": {
        "apiNode": {
          "label": "API Request",
          "description": "Make HTTP requests to external endpoints",
          "fields": {
            "url": {
              "label": "Endpoint URL",
              "placeholder": "https://api.example.com/v1",
              "targetHandle": {
                "label": "URL Input",
                "description": "Dynamic endpoint path input"
              }
            },
            "method": {
              "label": "HTTP Method",
              "placeholder": "Select Method..."
            }
          },
          "info": {
            "title": "API Request Node",
            "subtitle": "External integration",
            "description": "Trigger an external HTTP request using parameters from connected nodes."
          }
        }
      }
    }
  }
}
```

---

## 7. Workflow Context Reference (`useWorkflow()`)

The `WorkflowContext` coordinates state updates, execution states, and node selection.

### Properties & State
* `nodes: AppNode[]` — List of current node instances on the canvas.
* `edges: Edge[]` — List of current connecting edges.
* `selectedNode: AppNode | null` — The node that is currently clicked/selected on the canvas.
* `isExecuting: boolean` — True if the workflow is currently running.

### API Methods

#### 1. `addNode`
Inserts a new node instance onto the canvas at a specific coordinate.
* **Arguments:**
  * `type: NodeType` — The registered enum value of the node.
  * `position: { x: number, y: number }` — Client coordinates where the node should be spawned.
* **Returns:** `string` (The unique auto-generated node identifier, e.g. `TEXT_12345678`).

#### 2. `updateNodeData`
Partially updates the data properties of a specific node.
* **Arguments:**
  * `nodeId: string` — The ID of the node to update.
  * `updates: Partial<AppNodeData>` — The new properties to merge into `node.data` (e.g., merging updated `handleRows`).
* **Returns:** `void`

#### 3. `removeNode`
Removes a node and its attached connections from the canvas.
* **Arguments:**
  * `nodeId: string` — The ID of the target node to delete.
* **Returns:** `void`

#### 4. `duplicateNode`
Clones a node configuration and spawns an offset copy (`x + 50`, `y + 50`) on the canvas.
* **Arguments:**
  * `nodeId: string` — The ID of the node to clone.
* **Returns:** `void`

#### 5. `getNodeById`
Finds and retrieves a node by its identifier.
* **Arguments:**
  * `nodeId: string` — The ID of the node to locate.
* **Returns:** `AppNode | undefined`

#### 6. `setInitialNodes` & `setInitialEdges`
Initializes the editor with loaded nodes/edges from DB files.
* **Arguments:**
  * `nodes: AppNode[]` / `edges: Edge[]`
* **Returns:** `void`

#### 7. `executeNode`
Asynchronously runs the backend or side-effect logic associated with a single node.
* **Arguments:**
  * `nodeId: string` — The ID of the node to execute.
* **Returns:** `Promise<void>`

#### 8. `executeWorkflow`
Asynchronously triggers execution of the entire workflow starting from the `START` node.
* **Returns:** `Promise<void>`

#### 9. `resetWorkflow`
Resets the execution status of all nodes on the canvas to `NodeExecutionStatus.IDLE`.
* **Returns:** `void`

---

## 8. TypeScript Reference & Type System

These types are defined in `components/layout/workflow-layout/types.ts` and must be utilized to maintain type safety:

```typescript
import { Node, Position } from "@xyflow/react";
import React, { ElementType } from "react";

// ==================== Enums ====================

export enum NodeType {
  START = "START",
  END = "END",
  API = "API",
  LLM = "LLM",
  CONDITIONAL = "CONDITIONAL",
  LOOP = "LOOP",
  INPUT = "INPUT",
  OUTPUT = "OUTPUT",
  TEXT = "TEXT",
  NUMBER = "NUMBER",
  MODEL = "MODEL",
  TOOL = "TOOL",
  CODE = "CODE",
  DATABASE = "DATABASE",
  EMAIL = "EMAIL",
  WEBHOOK = "WEBHOOK",
  MESSAGE = "MESSAGE",
  FILTER = "FILTER",
  TIMER = "TIMER",
  MAP = "MAP",
  FILE = "FILE",
  IMAGE = "IMAGE",
  TABLE = "TABLE",
  CALENDAR = "CALENDAR",
  UPLOAD = "UPLOAD",
  CUSTOM = "CUSTOM", // Example custom node addition
}

export enum NodeExecutionStatus {
  IDLE = "IDLE",
  RUNNING = "RUNNING",
  SUCCESS = "SUCCESS",
  FAILURE = "FAILURE",
  WAITING = "WAITING",
}

export enum HandleDataFormat {
  STRING = "string",
  NUMBER = "number",
  BOOLEAN = "boolean",
  OBJECT = "object",
  ARRAY = "array",
  ANY = "any",
}

export enum HandleValueSource {
  MANUAL = "manual",
  CONNECTED = "connected",
  EXECUTION = "execution",
  DEFAULT = "default",
}

export enum HandleRowType {
  INPUT = "input",
  OUTPUT = "output",
  INPUT_OUTPUT = "input-output",
}

// ==================== Validation ====================

export interface HandleValidationConfig {
  required: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  enum?: string[];
  message?: string;
}

export interface HandleValidation {
  config: HandleValidationConfig;
  validator?: (
    value: unknown,
    config: HandleValidationConfig,
  ) => boolean | string;
}

export interface ConnectionValidation {
  maxConnections: number;
  connectableNodes: string[];
  required: boolean;
}

// ==================== Handles ====================

export interface BaseHandle {
  id: string;
  position: Position;
  label: string;
  description?: string;
  placeholder?: string;
  value: unknown;
  defaultValue?: unknown;
  source: HandleValueSource;
  dataFormat: HandleDataFormat;
  validation: HandleValidation;
  schema?: any;
  tooltip?: ElementType;
  visible: boolean;
  disabled: boolean;
}

export interface InputHandle extends BaseHandle {
  type: "target";
  connection: ConnectionValidation & {
    connectedNodeId?: string;
    connectedHandleId?: string;
  };
}

export interface OutputHandle extends BaseHandle {
  type: "source";
  connection: ConnectionValidation & {
    connectedNodeIds: string[];
    connectedHandleIds: string[];
  };
}

// ==================== Row Configurations ====================

export interface KeyValuePair {
  id: string;
  key: string;
  value: string;
  source: "manual" | "connection";
  connectedNodeId?: string;
  connectedHandleId?: string;
}

export interface HandleRowConfig {
  value: unknown;
  defaultValue?: unknown;
  inputType:
    | "text"
    | "number"
    | "select"
    | "textarea"
    | "json"
    | "key-value"
    | "boolean";
  placeholder?: string;
  options?: { label: string; value: string }[];
  keyValuePairs?: KeyValuePair[];
}

export interface HandleRow {
  id: string;
  label: string;
  type: HandleRowType;
  description?: string;
  config: HandleRowConfig;
  targetHandle?: InputHandle;
  sourceHandle?: OutputHandle;
}

// ==================== Node Headers ====================

export interface NodeHeaderAction {
  isEnabled: boolean;
  icon?: React.ElementType;
  tooltip?: string;
}

export interface NodeHeaderInfoAction extends NodeHeaderAction {
  component?: React.ElementType;
}

export interface NodeHeader {
  label: string;
  description?: string;
  icon?: React.ElementType;
  type: NodeType;
  status: NodeExecutionStatus;
  actions: {
    copy: NodeHeaderAction;
    delete: NodeHeaderAction;
    execute?: NodeHeaderAction;
    info?: NodeHeaderInfoAction;
  };
}

// ==================== Complete Node Data Structure ====================

export interface AppNodeData extends Record<string, unknown> {
  type: NodeType;
  header: NodeHeader;
  config: Record<string, unknown>;
  inputHandles: InputHandle[];
  outputHandles: OutputHandle[];
  handleRows: HandleRow[];
  isStartNode: boolean;
  isEndNode: boolean;
}

export type AppNode = Node<AppNodeData>;
```

---

## 9. Node Registry Integration

After creating a node, it must be registered in the central systems:

1. **Register the Enum**: Add the new node type enum to `NodeType` in [types.ts](file:///C:/Users/Pawan/Desktop/FullStackProject/agent-builder/components/layout/workflow-layout/types.ts).
2. **Set Color**: Map the node type to a hex code color in `nodeColors` inside [nodes/index.ts](file:///C:/Users/Pawan/Desktop/FullStackProject/agent-builder/components/layout/workflow-layout/nodes/index.ts).
3. **Register Config**: Map the configuration object in `nodeConfigs`.
4. **Register Component**: Map the rendering component in `nodeComponents`.
5. **Register Executor**: Register the runner logic in `nodeExecutors`. Note that only execution-carrying logic/action nodes (like `UPPERCASE` or `OUTPUT`) require an `executor.ts` file; static helper or boundary nodes (like `START`, `END`, `TEXT`) should not contain execution files and must map directly to `null` in the `nodeExecutors` registry.
6. **Sidebar Registration**: Place the node in the appropriate category in `nodeSidebarGroups` so it appears in the drag-and-drop menu.

---

## 10. Code Examples

Below is a reference implementation showing how a new custom node should be structured with full dynamic localization.

### A. Translation Schema (`i18n/locales/en.json`)

Add translations to the workspace JSON dictionary:

```json
{
  "flow": {
    "nodeTypes": {
      "nodes": {
        "customNode": {
          "label": "Custom Action",
          "description": "Executes custom workflows",
          "fields": {
            "payload-value": {
              "label": "Payload",
              "description": "Payload text value",
              "placeholder": "Enter payload text...",
              "targetHandle": {
                "label": "Input Data",
                "description": "Must have a connected input target"
              },
              "sourceHandle": {
                "label": "Output Result",
                "description": "Outputs are formatted as a serialized string datatype."
              }
            }
          },
          "info": {
            "title": "Custom Action",
            "subtitle": "Executes custom triggers",
            "description": "The Custom Action node allows workflows to evaluate payloads dynamically and route information to subsequent nodes in the network.",
            "usageTitle": "Usage Rules",
            "rule1": "Must have a connected input target to process arguments.",
            "rule2": "Outputs are formatted as a serialized string datatype."
          }
        }
      }
    }
  }
}
```

### B. The Configuration File (`config.ts`)

```typescript
// components/layout/workflow-layout/nodes/custom-node/config.ts
import {
  NodeType,
  NodeExecutionStatus,
  HandleRowType,
  HandleDataFormat,
  HandleValueSource,
  AppNodeData,
} from "../../types";
import { Position } from "@xyflow/react";
import { Zap } from "lucide-react";
import { CustomNodeInfo } from "./info";

export const customNodeConfig: AppNodeData = {
  type: NodeType.CUSTOM,
  header: {
    label: "flow.nodeTypes.nodes.customNode.label",
    description: "flow.nodeTypes.nodes.customNode.description",
    icon: Zap,
    type: NodeType.CUSTOM,
    status: NodeExecutionStatus.IDLE,
    actions: {
      copy: { isEnabled: true },
      delete: { isEnabled: true },
      execute: { isEnabled: true },
      info: {
        isEnabled: true,
        component: CustomNodeInfo,
      },
    },
  },
  config: {},
  inputHandles: [],
  outputHandles: [],
  handleRows: [
    {
      id: "payload-value",
      label: "flow.nodeTypes.nodes.customNode.fields.payload-value.label",
      type: HandleRowType.INPUT_OUTPUT,
      description: "flow.nodeTypes.nodes.customNode.fields.payload-value.description",
      config: {
        value: "",
        inputType: "text",
        placeholder: "flow.nodeTypes.nodes.customNode.fields.payload-value.placeholder",
      },
      targetHandle: {
        id: "payload-input",
        position: Position.Left,
        label: "flow.nodeTypes.nodes.customNode.fields.payload-value.targetHandle.label",
        description: "flow.nodeTypes.nodes.customNode.fields.payload-value.targetHandle.description",
        value: null,
        source: HandleValueSource.DEFAULT,
        dataFormat: HandleDataFormat.STRING,
        validation: { config: { required: true } },
        type: "target",
        connection: {
          maxConnections: 1,
          connectableNodes: [NodeType.START, NodeType.TEXT],
          required: true,
        },
        visible: true,
        disabled: false,
      },
      sourceHandle: {
        id: "payload-output",
        position: Position.Right,
        label: "flow.nodeTypes.nodes.customNode.fields.payload-value.sourceHandle.label",
        description: "flow.nodeTypes.nodes.customNode.fields.payload-value.sourceHandle.description",
        value: null,
        source: HandleValueSource.DEFAULT,
        dataFormat: HandleDataFormat.STRING,
        validation: { config: { required: false } },
        type: "source",
        connection: {
          maxConnections: Infinity,
          connectableNodes: [NodeType.END, NodeType.TEXT],
          required: false,
        },
        visible: true,
        disabled: false,
      },
    },
  ],
  isStartNode: false,
  isEndNode: false,
};
```

### C. The Component File (`index.tsx`)

```tsx
// components/layout/workflow-layout/nodes/custom-node/index.tsx
"use client";

import { memo, useCallback } from "react";
import { type NodeProps } from "@xyflow/react";
import { AppNode } from "../../types";
import { NodeWrapper } from "../node-wrapper/NodeWrapper";
import { NodeHandles } from "../node-wrapper/NodeHandles";
import { useWorkflow } from "@/components/context/workflow-context";

type CustomNodeProps = NodeProps<AppNode>;

const CustomNode = memo((props: CustomNodeProps) => {
  const { id, data } = props;
  const { updateNodeData } = useWorkflow();
  const handleRows = data?.handleRows ?? [];

  const handleInputChange = useCallback(
    (rowId: string, value: string | number | boolean) => {
      const updatedRows = handleRows.map((row) =>
        row.id === rowId
          ? { ...row, config: { ...row.config, value } }
          : row
      );
      updateNodeData(id, { handleRows: updatedRows });
    },
    [id, handleRows, updateNodeData]
  );

  return (
    <NodeWrapper {...props}>
      <div className="w-[240px] px-1 py-0.5">
        <NodeHandles
          handleRows={handleRows}
          onChange={handleInputChange}
        />
      </div>
    </NodeWrapper>
  );
});

CustomNode.displayName = "CustomNode";

export { customNodeConfig };
export default CustomNode;
```

### D. The Info/Documentation File (`info.tsx`)

```tsx
// components/layout/workflow-layout/nodes/custom-node/info.tsx
"use client";

import { memo, useCallback } from "react";
import { Zap } from "lucide-react";
import { getNestedProperty } from "@/lib/utils";
import { useTheme } from "@/components/context/theme-context";

export const CustomNodeInfo = memo(() => {
  const { dictionary } = useTheme();

  const t = useCallback(
    (path: string, defaultValue: string): string => {
      if (!dictionary) return defaultValue;
      return getNestedProperty(dictionary, path) || defaultValue;
    },
    [dictionary]
  );

  return (
    <div className="space-y-4">
      {/* Hero */}
      <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
          <Zap className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-base">
            {t("flow.nodeTypes.nodes.customNode.info.title", "Custom Action")}
          </h3>
          <p className="text-xs text-muted-foreground">
            {t("flow.nodeTypes.nodes.customNode.info.subtitle", "Executes custom triggers")}
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm leading-relaxed">
        {t(
          "flow.nodeTypes.nodes.customNode.info.description",
          "The Custom Action node allows workflows to evaluate payloads dynamically and route information to subsequent nodes in the network."
        )}
      </p>

      {/* Usage Guidelines */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t("flow.nodeTypes.nodes.customNode.info.usageTitle", "Usage Rules")}
        </h4>
        <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-1.5">
          <li>{t("flow.nodeTypes.nodes.customNode.info.rule1", "Must have a connected input target to process arguments.")}</li>
          <li>{t("flow.nodeTypes.nodes.customNode.info.rule2", "Outputs are formatted as a serialized string datatype.")}</li>
        </ul>
      </div>
    </div>
  );
});

CustomNodeInfo.displayName = "CustomNodeInfo";
```

---

## 11. Special UX & Styling Rules 🎨

### A. Dynamic Header Icon Retrieval
* **Retrieval Rule:** Every node component wrapped inside `NodeWrapper` automatically fetches its matching icon and theme color definitions directly from the central `nodeSidebarItems` configuration in `nodes/index.ts`.
* **Rendering Pattern:** If the node's custom icon exists in the sidebar configuration, it must be rendered in the header using the node's theme color. If no sidebar icon mapping exists, fall back to rendering a standard solid circle representing the node type color.

### B. Clockwise Rotating Border Animation
* **Activation:** When a node has a status of `NodeExecutionStatus.RUNNING`, it applies the CSS helper class `.animate-node-running`.
* **CSS Layering Mechanics:**
  * Enforce `isolation: isolate` on the parent node container to declare a local stacking context.
  * Use a circular `conic-gradient` spinning helper inside the `::before` pseudo-element layer (`z-index: -2`), extending slightly outside the container borders (e.g., `-inset-[1.5px]`).
  * Use the card background color `hsl(var(--card))` inside the `::after` pseudo-element layer (`z-index: -1`) to cover the center of the spinning gradient, leaving only a 1.5px rotating gradient border contour visible.
  * Ensures front-facing node content and xyflow connection handles remain fully interactive and visible.
* **Uniform Themes:** Standardize border execution gradient colors to use the primary style variable (`hsl(var(--primary))`) across all nodes instead of per-node colors to maintain visual symmetry.

### C. No-Input Connection Handles
* **Data Receivers:** For handle rows that serve only to receive inputs from upstream connections (such as on the OutputNode) and do not support manual textbox entry, configure their fields using `inputType: "none"`.
* **Hide Inputs:** The `NodeInputRenderer` returns `null` when encountering `"none"`, rendering only the handle connection port.

