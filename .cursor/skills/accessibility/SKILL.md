---
name: accessibility
description: WCAG 2.2 Level AA accessibility standards for React components. Ensures semantic HTML, keyboard navigation, ARIA usage, color contrast, form labels, and screen reader support.
---
# Web Accessibility Standards

## Core Principles (WCAG 2.2)

All code must follow [WCAG 2.2 Level AA](https://www.w3.org/TR/WCAG22/) standards:

1. **Perceivable** - Information must be presentable to all users
2. **Operable** - UI components must be operable by all users
3. **Understandable** - Information and operation must be clear
4. **Robust** - Content must work with current and future technologies

## Essential Requirements

### 1. Semantic HTML First

Always use native HTML elements before custom implementations:

```tsx
// ✅ GOOD: Native semantics
<button onClick={handleClick}>Submit</button>
<a href="/page">Navigate</a>
<input type="checkbox" />

// ❌ BAD: Custom elements without semantics
<div onClick={handleClick}>Submit</div>
<span onClick={navigate}>Navigate</span>
```

### 2. Text Alternatives

All non-text content must have text alternatives:

```tsx
// ✅ GOOD: Descriptive alt text
<img src="/chart.png" alt="Sales increased 25% in Q4 2024" />

// ✅ GOOD: Empty alt for decorative images
<img src="/decoration.png" alt="" />

// ✅ GOOD: Icon buttons with labels
<button aria-label="Close dialog">
  <IconClose aria-hidden="true" />
</button>

// ❌ BAD: Missing alt text
<img src="/chart.png" />
```

### 3. Keyboard Accessibility

All interactive elements must be keyboard accessible:

**Required keyboard support:**
- `Tab`/`Shift+Tab` - Navigate between elements
- `Enter` - Activate buttons/links
- `Space` - Activate buttons/checkboxes
- `Escape` - Close modals/dialogs
- Arrow keys - Navigate menus/tabs/lists

```tsx
// ✅ GOOD: Keyboard accessible
<button onClick={handleClick}>Click me</button>

// ❌ BAD: Not keyboard accessible
<div onClick={handleClick}>Click me</div>
```

### 4. Visible Focus Indicators

All interactive elements must have visible focus indicators:

```css
/* ✅ GOOD: Visible focus indicator */
button:focus-visible {
  outline: 2px solid #0066CC;
  outline-offset: 2px;
}

/* ❌ BAD: Removing focus outline */
button:focus {
  outline: none;
}
```

### 5. Color and Contrast

**WCAG AA Requirements:**
- Normal text (< 18pt): 4.5:1 minimum
- Large text (≥ 18pt or bold 14pt): 3:1 minimum
- UI components: 3:1 minimum

```tsx
// ❌ BAD: Color is only indicator
<span style={{ color: 'red' }}>Error occurred</span>

// ✅ GOOD: Icon + text + color
<span style={{ color: 'red' }}>
  <IconError aria-hidden="true" />
  Error: Invalid email address
</span>
```

### 6. Form Accessibility

All form inputs must have associated labels:

```tsx
// ✅ GOOD: Proper form structure
<label htmlFor="email">
  Email Address
  <span aria-label="required">*</span>
</label>
<input
  id="email"
  type="email"
  required
  aria-required="true"
  aria-invalid={!!error}
  aria-describedby={error ? "email-error" : undefined}
/>
{error && (
  <div id="email-error" role="alert">
    {error}
  </div>
)}

// ❌ BAD: Placeholder as label
<input type="email" placeholder="Email Address" />
```

### 7. Heading Hierarchy

Use proper heading levels without skipping:

```tsx
// ✅ GOOD: Logical hierarchy
<h1>Page Title</h1>
  <h2>Section 1</h2>
    <h3>Subsection 1.1</h3>
  <h2>Section 2</h2>

// ❌ BAD: Skipping levels
<h1>Page Title</h1>
<h4>Section</h4>  // Skipped h2, h3
```

### 8. ARIA Usage

Use ARIA only when native HTML is insufficient:

```tsx
// Common ARIA patterns
<button
  aria-expanded={isOpen}
  aria-controls="menu-id"
>
  Menu
</button>

<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="dialog-title"
>
  <h2 id="dialog-title">Dialog Title</h2>
</div>

<div role="alert">Critical error occurred</div>
<div role="status" aria-live="polite">Loading complete</div>
```

### 9. Focus Management

Manage focus for dynamic content:

```tsx
// ✅ GOOD: Modal with focus management
const Modal = ({ isOpen, onClose, title }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousFocus = document.activeElement;
    modalRef.current?.querySelector('button')?.focus();

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      (previousFocus as HTMLElement)?.focus();
    };
  }, [isOpen, onClose]);

  return (
    <div ref={modalRef} role="dialog" aria-modal="true">
      <h2>{title}</h2>
      <button onClick={onClose}>Close</button>
    </div>
  );
};
```

### 10. Dynamic Content Announcements

Announce dynamic content changes to screen readers:

```tsx
// Status messages (polite - wait for user)
<div role="status" aria-live="polite">
  {statusMessage}
</div>

// Error alerts (assertive - interrupt)
<div role="alert" aria-live="assertive">
  {errorMessage}
</div>
```

## Common Patterns

### Screen Reader Only Text

```tsx
const srOnly: React.CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: '0',
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: '0',
};

<button>
  <IconTrash />
  <span style={srOnly}>Delete item</span>
</button>
```

### Skip Links

```tsx
<a href="#main-content" className="skip-link">
  Skip to main content
</a>
<header>...</header>
<main id="main-content">...</main>
```

### Accessible Tables

```tsx
<table>
  <caption>Sales Data Q4 2024</caption>
  <thead>
    <tr>
      <th scope="col">Month</th>
      <th scope="col">Revenue</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">October</th>
      <td>$50,000</td>
    </tr>
  </tbody>
</table>
```

## Top 10 Mistakes to Avoid

1. **Missing alt text** on images
2. **Using `<div>` or `<span>` instead of `<button>`** for actions
3. **Missing form labels** (using placeholder instead)
4. **Removing focus outline** without replacement
5. **Skipping heading levels** (h1 → h4)
6. **Insufficient color contrast** (< 4.5:1)
7. **Color as only indicator** (no icon/text)
8. **No keyboard access** to interactive elements
9. **Not announcing dynamic content** changes
10. **Icon buttons without labels** or aria-label

## Testing Checklist

### Automated Testing
- Use axe-core, Lighthouse, or WAVE browser extensions
- Add automated tests with jest-axe or similar tools

### Manual Testing
- [ ] Tab through all interactive elements
- [ ] All elements reachable by keyboard
- [ ] Focus visible on all elements
- [ ] Enter/Space activates buttons
- [ ] Escape closes modals
- [ ] Works at 200% zoom
- [ ] Color contrast meets WCAG AA
- [ ] Test with screen reader (VoiceOver/NVDA/JAWS)

## Resources

- **WCAG 2.2 Guidelines**: https://www.w3.org/TR/WCAG22/
- **WCAG Quick Reference**: https://www.w3.org/WAI/WCAG22/quickref/
- **ARIA Authoring Practices**: https://www.w3.org/WAI/ARIA/apg/
- **WebAIM**: https://webaim.org/
- **MDN Accessibility**: https://developer.mozilla.org/en-US/docs/Web/Accessibility

## Best Practices Summary

### ✅ Always Do
1. Use semantic HTML first
2. Provide text alternatives
3. Ensure keyboard accessibility
4. Maintain sufficient color contrast
5. Manage focus for dynamic content
6. Use proper heading hierarchy
7. Label all form inputs
8. Test with assistive technology

### ❌ Never Do
1. Remove focus outline without replacement
2. Use color as only indicator
3. Create keyboard traps
4. Skip heading levels
5. Use placeholder as label
6. Make non-interactive elements clickable
7. Rely solely on automated testing
8. Add ARIA when native HTML works
