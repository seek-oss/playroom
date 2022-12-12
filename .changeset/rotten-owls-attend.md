---
'playroom': patch
---

Fix error message on gutter marker tooltip

Playroom wraps the code in a Fragment to compile it and then removes it from the error message displayed as a tooltip on the gutter marker if it fails to compile.

The logic has been improved to remove the first occurence of an opening `<React.Fragment>` and the last occurence of `</React.Fragment>`.

Errors should no longer incorrectly have a stray closing fragment:

```diff
"unknown: Expected corresponding JSX closing tag for <Boxerror>. (3:0)

   1 | <Boxerror>
   2 |   ...
-> 3 | </Box></React.Fragment>
+> 3 | </Box>
     | ^"
```
