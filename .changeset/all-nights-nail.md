---
'playroom': minor
---

**Snippets:** Update `group` treatment and add `description` support

Improve affordance of snippet `group` by nesting snippets under sticky group headers.
Snippets also now support an optional `description` property to help users differentiate similar snippets.

#### Migration

While not a breaking change, this update does change the way snippets are rendered and how groups are treated, so some migration may be desired.

Previously snippets rendered the `group` and `name` on the same line.
For example:

```json
[
  {
    "group": "Button",
    "name": "Small",
    "code": "..."
  },
  {
    "group": "Button",
    "name": "Large",
    "code": "..."
  }
]
```

resulted in:

```
---------------
Button Small
Button Large
---------------
```

Groups are now elevated to sticky headers, with snippets nested underneath:

```
---------------
Button
---------------
Small
Large
---------------
```

To avoid grouping migrate to use `name` and `description` properties instead, and omit `group`:

```diff
 [
   {
-    group: 'Button',
+    name: 'Button',
-    name: 'Small',
+    description: 'Small',
     code: '...',
   },
   {
-    group: 'Button',
+    name: 'Button',
-    name: 'Large',
+    description: 'Large',
     code: '...',
   },
 ]
```

which results in the same UX as previously.
