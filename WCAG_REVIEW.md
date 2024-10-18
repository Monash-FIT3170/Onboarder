# WCAG Guidelines: Onboarder

For the WCAG guidelines, we decided to follow the criteria based on the following list below. We decided to only implement the Level A Criteria because our current application has not been deployed yet and is still in its early stages of development. Each guideline contains criteria which checks to see if they are being followed, and, if they are not, with a note of what is being failed and its reasons. 

**_Any guidelines which are not applicable have been crossed out._**

## Guideline 1.1 Text Alternatives

### 1.1.1 Non-text Content

- Images, image buttons, and image map hotspots have appropriate, equivalent alternative text.

- Images that are decorative or redundant are given empty alt text (alt="") or used as CSS backgrounds.

- Complex images have alternative text in context or on a linked page.

- Form buttons have descriptive values.

- Inputs have appropriate accessible names.

- Embedded multimedia is identified with accessible text.

- Frames and iframes are titled appropriately.

\[Passed/Failed]: Passed all criteria under 1.1.1 Non-text Content.

## <strike>Guideline 1.2 Time-based Media</strike>

### <strike>1.2.1 Audio-only and Video-only (Prerecorded)</strike>

-  <strike>Descriptive transcripts are provided for non-live audio and non-live video (unless decorative).</strike>

### <strike>1.2.2 Captions (Prerecorded)</strike>  

-  <strike>Synchronised captions are provided for non-live video.</strike>

### <strike>1.2.3 Audio Description or Media Alternative (Prerecorded)</strike>  

-  <strike>Descriptive transcript or audio description is provided for non-live video (if visual content is not in the audio).</strike>

\[Passed/Failed]: Not Applicable.

## Guideline 1.3 Adaptable

### 1.3.1 Info and Relationships

- Semantic markup is used appropriately for headings, regions, lists, and special text.

- Tables are used for tabular data, and data cells are associated with headers.

- Form inputs have associated text labels, and related controls are grouped with fieldset/legend.

### 1.3.2 Meaningful Sequence

- Reading and navigation order is logical and intuitive.

### 1.3.3 Sensory Characteristics

- Instructions do not rely on shape, size, visual location, or sound.

\[Passed/Failed]: Passed all criteria under 1.3.1 Info and Relationships, 1.3.2 Meaningful Sequence and 1.3.3 Sensory Characteristics.

## Guideline 1.4 Distinguishable

### 1.4.1 Use of Color

- Color is not the sole method of conveying information or distinguishing elements.

### <strike>1.4.2 Audio Control</strike>

- <strike>A mechanism is provided to stop, pause, or mute audio that plays automatically for more than 3 seconds.</strike>

\[Passed/Failed]: Passed all criteria under 1.4.1 Use of Color.

## Guideline 2.1 Keyboard Accessible

### 2.1.1 Keyboard

- All page functionality is accessible via keyboard.

### 2.1.2 No Keyboard Trap

- Keyboard focus is never locked or trapped at a particular element.

\[Passed/Failed]: Failed. Application does not completely rely on keyboard, requires cursor.

## Guideline 2.2 Enough Time

### 2.2.1 Timing Adjustable

- Users can turn off, adjust, or extend any time limits (with exceptions).

### 2.2.2 Pause, Stop, Hide

- Users can pause, stop, or hide moving, blinking, or scrolling content lasting more than 5 seconds. Users can also pause or control dynamically updating content.

## Guideline 2.3 Seizures

### 2.3.1 Three Flashes or Below Threshold

- Content does not flash more than 3 times per second unless it is small, low contrast, or not too red.

\[Passed/Failed]: Passed all criteria under 2.3.1 Three Flashes or Below Threshold.

## Guideline 2.4 Navigable

### 2.4.1 Bypass Blocks

- A "skip" link is provided to skip navigation or repeated content.

### 2.4.2 Page Titled

- Pages have descriptive and informative titles.

### 2.4.3 Focus Order

- Focusable elements (links, form controls) are navigable in a logical, intuitive order.

### 2.4.4 Link Purpose (In Context)

- The purpose of links and buttons can be determined from their text or context.

\[Passed/Failed]: Passed all criteria.

## Guideline 2.5 Input Modalities

### 2.5.1 Pointer Gestures:

- All functionality that uses multipoint or path-based gestures can also be operated with a single pointer without path-based gestures.

### 2.5.2 Pointer Cancellation:

- If a control can be activated by a pointer, activation is not triggered on the down-event.

### 2.5.3 Label in Name:

- Components that include a visible text label also include that text as part of the accessible name.

### 2.5.4 Motion Actuation:

- Functionality operated by device motion or user motion can also be operated by user interface components and can be disabled to prevent accidental actuation.

\[Passed/Failed]: 

## Guideline 3.1 Readable

### 3.1.1 Language of Page:

- The default human language of each web page can be programmatically determined.

\[Passed/Failed]: 

## Guideline 3.2 Predictable

### 3.2.1 On Focus:

- When any component receives focus, it does not initiate a change of context.

### 3.2.2 On Input:

- Changing the setting of any user interface component does not automatically cause a change of context unless the user has been informed of this behaviour before using the component.

\[Passed/Failed]: 

## Guideline 3.3 Input Assistance

### 3.3.1 Error Identification:

- If an input error is detected, the item that is in error is identified, and the error is described to the user in text.

### 3.3.2 Labels or Instructions:

- Labels or instructions are provided when content requires user input.

\[Passed/Failed]: 

## Guideline 4.1 Compatible

### 4.1.2 Name, Role, Value:

- For all user interface components (including form elements, links, and components generated by scripts), the name and role can be programmatically determined, states and properties can be set by user agents, and notification of changes to these items is available to user agents, including assistive technologies.

\[Passed/Failed]: